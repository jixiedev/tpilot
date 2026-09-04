# Databot

Databot 是 TahoePilot 的**数据检索助手**：把自然语言问题变成可审计的查数流程——先找表、再写 SQL、经人工确认后执行，最后给出带证据的回答。

它不是「一次 LLM 调用直接吐 SQL」，而是一条**分阶段流水线**，中间有两道**人工闸门（Human Gate）**，保证表选型和 SQL 在跑数之前可被检查和修改。

---

## 核心设计

Databot 由两层机制组成：

| 层 | 做什么 | 怎么结束 |
|----|--------|----------|
| **外层状态机** | 按阶段推进：发现表 → 审表 → 写 SQL → 审 SQL → 执行 → 总结 | 由 `stage` 字段决定下一步走哪条边 |
| **内层 ReAct 循环** | 在「发现表」「写 SQL」「知识追问」等阶段里，LLM 多轮调用工具取证 | 满足该阶段的**完成条件**后自动退出，交回外层 |

两层共用一份会话状态：聊天历史一直保留；每轮查数产生的表卡片、SQL 草稿、执行结果等，在新一轮问题开始时会被清空（追问除外，见下文）。

---

## 状态机总览

外层状态机用 **`stage`** 表示「当前处于流水线的哪一步」。合法取值及含义：

| `stage` | 用户视角在发生什么 |
|---------|-------------------|
| `fetch` | Agent 在用 RAG / DataHub 等工具找候选表（dbt 模型），并提交一批 TableCard |
| `gate_cards` | **暂停**：等你确认用哪些表继续写 SQL |
| `sql` | Agent 根据已批准的表起草 SQL，并用 EXPLAIN 校验 |
| `gate_sql` | **暂停**：等你确认是否执行这条 SQL |
| `execute` | 在 Trino 上执行已批准的只读 SQL |
| `done` | 本轮结束，已生成最终回复 |

### 状态转移图（主路径 · 数据检索）

```
                              deny-comments
                         ┌──────────────────────┐
                         │                      │
                         ▼                      │
    ┌────────┐      ┌────────────┐      ┌────┴───┐      ┌──────────┐      ┌─────────┐      ┌──────┐
    │  fetch   │─────▶│ gate_cards │─────▶│  sql   │─────▶│ gate_sql │─────▶│ execute │─────▶│ done │
    └────────┘      └─────┬──────┘      └───┬────┘      └────┬─────┘      └─────────┘      └──────┘
          ▲               │                 │                │
          │               │ deny-halt       │ deny-comments    │ deny-halt
          │               ▼                 │                ▼
          │            ┌──────┐             │             ┌──────┐
          └────────────│ done │◀────────────┴─────────────│ done │
           deny-comments└──────┘                          └──────┘
```

**转移条件说明：**

| 从 | 到 | 触发条件 |
|----|-----|----------|
| `fetch` → `gate_cards` | Agent 已提交至少一张候选表（`committed_cards` 非空），系统准备好 gate 材料 |
| `gate_cards` → `sql` | 你 **Approve** 或 **Dry-run**（只预览、不落库） |
| `gate_cards` → `fetch` | 你 **Request changes**：表选错了，带反馈意见退回重找 |
| `gate_cards` → `done` | 你 **Halt**：终止本轮，不执行 SQL |
| `sql` → `gate_sql` | Agent 已写好 SQL 草稿并填好 gate 说明 |
| `gate_sql` → `execute` | 你 **Approve** 或 **Dry-run** |
| `gate_sql` → `sql` | 你 **Request changes**：SQL 有问题，退回重写 |
| `gate_sql` → `done` | 你 **Halt** |
| `execute` → `done` | 查询跑完（成功或失败都会进入总结） |

Gate 上的四个选项在所有闸门语义一致：

| 选项 | 效果 |
|------|------|
| **Approve** | 认可当前内容，进入下一阶段 |
| **Dry-run** | 认可内容但标记为「仅预览」；仍会继续流程，结果写入时跳过持久化 profile |
| **Request changes (deny-comments)** | 不认可，附文字反馈，**退回上一智能阶段**重试 |
| **Halt (deny-halt)** | 直接结束本轮 |

---

## 内层阶段：Agent 在每一步做什么

状态图只画了 `stage`；在每个 `stage` 内部，还有一个 **ReAct 子循环**（想一步 → 调工具 → 看结果 → 再想），直到该阶段任务完成。

### 阶段 1：`fetch`（发现表）

```
  ┌─────────────────────────────────────────────────────────┐
  │  ReAct 循环（stage = fetch）                             │
  │                                                         │
  │   用户问题 ──▶ LLM ──▶ 工具：RAG / DataHub glossary     │
  │                  │                                      │
  │                  └──▶ 工具：commit_cards（提交候选表）      │
  │                                                         │
  │   退出条件：committed_cards 至少有一张                   │
  └─────────────────────────────────────────────────────────┘
                              │
                              ▼
                    准备 gate 材料 → stage = gate_cards
```

要点：

- 必须先**用工具取证**，不能仅凭聊天记忆直接回答。
- 仅凭聊天记忆或空工具列表 **不能**结束这一阶段；必须调用 `commit_cards`。
- 此阶段**不能**跑 SQL。

### 阶段 2：`sql`（写 SQL）

```
  ┌─────────────────────────────────────────────────────────┐
  │  ReAct 循环（stage = sql）                               │
  │                                                         │
  │   已批准的表 ──▶ LLM ──▶ 查 schema / EXPLAIN 校验        │
  │                  │                                      │
  │                  └──▶ propose_sql + 填写 gate 理由        │
  │                                                         │
  │   退出条件：draft_sql 与 sql_reasons 均已填写             │
  └─────────────────────────────────────────────────────────┘
                              │
                              ▼
                       stage = gate_sql
```

要点：

- 只能使用 gate 里**已批准**的表，不能私自加表。
- 此阶段只能 `EXPLAIN`，真正 `SELECT` 要等 SQL gate 通过后的 `execute` 阶段。

### 阶段 3：`execute`（执行）

这不是 ReAct 循环，而是一次确定性执行：读取 `approved_sql`，调用 Trino 只读查询，结果写入 `execution_result`，然后 `stage → done`，最后由总结节点生成用户可见回复。

---

## 追问：第二条状态机分支

上一轮 `stage = done` 后，如果你在 Web 聊天里**继续发消息**（例如「buyer region 是国家还是地区？」），Databot 不会默认重跑整条查数流水线，而是先做一次**意图分类**：

```
                    ┌─────────────────┐
                    │  新用户消息到达   │
                    │  (上一轮 done)   │
                    └────────┬────────┘
                             │
              清空本轮查数产物，保留聊天历史
              follow_up_turn = true
                             │
                             ▼
                    ┌─────────────────┐
                    │   意图分类       │
                    └────────┬────────┘
                             │
            ┌────────────────┴────────────────┐
            │                                 │
            ▼                                 ▼
   intention = knowledge            intention = requery
   （知识追问）                       （重新查数）
            │                                 │
            ▼                                 ▼
   ┌─────────────────┐              回到主路径
   │ ReAct：委托       │              stage = fetch
   │ Knowledge Agent  │              （完整流水线）
   │ → 文本回复（无 tool call）│
   └────────┬────────┘
            │
            ▼
        stage = done
```

### 两类追问

| 类型 | 典型问法 | 走哪条路 |
|------|----------|----------|
| **知识追问** (`knowledge`) | 「这个字段什么意思？」「是国家还是地区？」「GMV 和 revenue 区别？」 | 调用 Knowledge Agent 查文档 / glossary，**不**重跑 SQL |
| **重新查数** (`requery`) | 「我要的是 revenue 不是 GMV」「换成上周」「再查一下分国家」 | 从 `fetch` 开始走完整主路径 |

分类由 LLM 根据**最新一条消息 + 近期对话**判断；判断失败时默认按 **requery** 处理（保守策略，避免漏查）。

---

## 完整状态空间（含追问入口）

把主路径、追问分支、gate 回退画在一张图里：

```
                                    ┌──────────────────────────────────────┐
                                    │         意图分类（仅追问轮）           │
                                    │  knowledge ──▶ 知识子图 ──▶ done     │
                                    │  requery   ──▶ fetch（接入主路径）    │
                                    └───────────────┬──────────────────────┘
                                                    │ requery
                                                    ▼
┌──────┐    ┌────────┐    ┌────────────┐    ┌─────┐    ┌──────────┐    ┌─────────┐    ┌──────┐
│ START│───▶│ (入口) │───▶│   fetch    │───▶│gate │───▶│   sql    │───▶│gate_sql │───▶│execute│───▶ done
└──────┘    └────────┘    └─────▲──────┘    │cards│    └────▲─────┘    └────┬────┘    └───────┘
              │               │             └──┬──┘         │              │
              │  首轮问题      │ deny-comments  │            │ deny-comments│
              │  直接进入 fetch │                │            │              │
              │               └────────────────┘            └──────────────┘
              │
              │  追问轮：先分类再汇入 fetch 或知识子图
              └──────────────────────────────────────────────────────────────▶
```

**`done` 之后的行为：**

- 没有新用户消息 → 停留在 `done`，不再推进。
- 有新用户消息 → 视为新一轮交互：查数产物清零，进入意图分类（追问）或 `fetch`（首轮逻辑）。

---

## 会话里沉淀了什么

理解状态机时，需要区分**跨轮保留**和**每轮重置**两类数据。

### 跨轮保留

- **聊天消息**（`messages`）：你的问题和 Agent 的回复一直累积，供追问时读上下文。

追问时**保留**上一轮 Cards / SQL / Results；仅在分类为 **requery**（新查数任务）并进入 `fetch` 时才清空 staging / committed / SQL / 结果。上一轮 `approved_cards` 保留，供 `commit_cards` 解析旧 id，不会混进本轮 `staging_cards`。知识追问（`knowledge`）全程不清空。

### 每轮重置（新问题时清空）

- **CLI 新提问**：清空全部 pipeline 字段（含 `approved_cards`）
- **分类为 requery**：清空 staging / committed / SQL / 结果；**保留** `approved_cards`
- **追问入口**（仅设 `follow_up_turn`）：**不**清空 pipeline，聊天历史保留

因此：追问「字段含义」时，右侧面板仍显示上一轮结果；只有当你问的是新指标/新时间范围等需要重查时，分类为 requery 后才会清空并重新 fetch。

### 卡片与 SQL 的生命周期（单轮内）

```
  RAG / DataHub 命中
        │
        ▼
  staging_cards ──commit_cards──▶ committed_cards
                                        │
                          prepare_for_gate │
                                        ▼
                                 review_cards  ◀── 你可在 UI 改勾选
                                        │
                               gate_cards 批准
                                        ▼
                                approved_cards
                                        │
                                 generate_sql
                                        ▼
                                   draft_sql
                                        │
                                gate_sql 批准
                                        ▼
                                 approved_sql ──▶ execution_result
```

---

## 你在 UI 里会看到什么

| 阶段 | 右侧 Artifact 面板 | Gate 面板 |
|------|-------------------|-----------|
| `fetch` | Cards 陆续出现 | 无 |
| `gate_cards` | Cards 可勾选编辑 | 四选一 + 可选反馈 |
| `sql` | SQL 草稿 | 无 |
| `gate_sql` | SQL 可编辑 | 四选一 + 可选反馈 |
| `execute` / `done` | Results（表格/图表） | 无 |
| 知识追问 | 无新 pipeline 产物 | 无 |

Gate 暂停时，对话流会挂起，直到你在 Gate 面板做出选择；选完后 Agent 从断点继续，**不会**从头重跑已完成的阶段。

---

## 设计原则（为什么这样建）

1. **证据优先**：表和指标必须来自 RAG / DataHub / schema 工具，不能靠表名猜。
2. **人机协同**：两道 gate 把「选表」和「跑数」两个高风险决策交给人工确认。
3. **只读安全**：全程禁止 mutating SQL；执行层还有 SQL guard 二次拦截。
4. **阶段隔离**：每个 ReAct 子循环只能看到当前阶段的工具，避免在写 SQL 时又去搜表、在搜表时又去跑查询。
5. **追问分流**：语义澄清不必重跑整条流水线；真正要新数字时才重新 `fetch`。

---

## 快速体验

```bash
./scripts/dev.sh backend    # 启动 Agent 服务（:8000）
./scripts/dev.sh frontend   # 启动 Web UI（:3000）
```

浏览器打开 `http://localhost:3000`，在聊天框用自然语言提问即可；遇到 gate 时在右侧面板操作。
