# Databot Code Review

`agent/react/databot/` 是一个**外层状态机 + ReAct 子图**的双层结构。整体设计清楚，但代码规模上来了（10 个文件 / ~1500 行），有几处真实的 bug 和若干可重构的地方。

按严重程度排序，每条都标了文件与行号。

---

## 🐞 真 bug

### 1. `record_metric_conflict` 每次调用都覆盖整个冲突列表
**`stage_tools.py:117-127`**

```python
return Command(update={STATE_KEYS["metric_conflicts"]: [payload], ...})
```

这是**整列表赋值**，不是 append。如果 LLM 在同一轮里发现两个 metric/glossary 冲突（card A + card B），只剩最后一个。同一文件里的 `update_card_selection`、`propose_sql` 都是合并语义，这个明显不一致。

修复：

```python
prev = list(runtime.state.get("metric_conflicts") or [])
return Command(update={STATE_KEYS["metric_conflicts"]: prev + [payload], ...})
```

### 2. `prepare_turn_input` 的默认字段会在 web 端被静默吞掉
**`databot_agent.py:161-181`**

`turn_input.setdefault(key, value)` 只在第一次出现该 key 时有效；AG-UI 路径是带 checkpoint 走 `Command(update=...)`，新 key 需要在 `state.py` 的 TypedDict 里声明（这正是文件顶上 `_tpilot_typed_dict_shim_applied` 注释想解释的坑）。`prepare_cards_for_gate` 直接读 `state["review_cards"]` 不存在时会拿到 `None`，`gate_decisions` 同理。

修复：别靠 `setdefault` 当保险，要么所有默认值在 `DatabotState` 上写 `Annotated[list, ...]`，要么在 `make_databot_entry_node` 入口统一 apply（实际已经做了，但没覆盖 `deny_feedback` 之外的几个 key）。

### 3. `_STAGE_ROUTE_MAP` 同时被两个不同语义的边复用
**`graph.py:38-49`、`graph.py:319`**

```python
_STAGE_ROUTE_MAP = {
    "fetch_cards": "fetch_cards",   # stage value → node name
    "gate_cards": "gate_cards",
    "write_cards_artifact": "write_cards_artifact",
    ...
}
```

被 `inject_system_prompt` 用作 `stage → node`，又被 `generate_sql` 用作 `node → node`。两个 `_stage_route` 函数在两个 conditional edge 里跑出来的语义不同（一个返回 node 名一个返回 stage 名），但用同一张 map。`_after_generate_sql` 在 `stage == "sql"` 时通过 `_stage_route` 返回 `"write_cards_artifact"`——这个恰好对了，但只是巧合。

修复：拆成 `STAGE_TO_NODE_MAP` 和 `STAGE_TO_AFTER_GENERATE_SQL_MAP` 两张，明确各自语义。

### 4. `chart_question` 是一个无操作节点却承担路由职责
**`gates.py:306-311`、`graph.py:339-343`**

```python
def chart_question(state: DatabotState) -> dict[str, Any]:
    return {"stage": "done", "chart_requested": False}
```

没有 interrupt、没用 state。`build_databot_graph` 还要为此加节点 + 条件边 + 加 prompt。`make_chart_question_node` 的 docstring 说"Superset integration TODO"——那就应该直接 `execute_sql → end_with_summary`，把 `chart_question` 整条从图中删掉，等真要做时再加。`chart_requested` 这个状态字段同样可以在那时再引入。

### 5. `_stage_state_exit_router` 默认 `state_exit_keys=()` 在 fetch 子图里其实是死参数
**`subgraphs.py:87、124`**

```python
state_exit_keys=(),  # fetch
state_exit_keys=("draft_sql", "sql_reasons"),  # sql
```

fetch 子图理论上要靠 `committed_cards` 退出，但你传了空元组。子图实际退出靠的是 `chat_completion`（router 内部 `route_after_reason`），那 prompt 已经把 `chat_completion` 标记为 OPTIONAL 了——如果 LLM 不调用且不调 `commit_cards` 就永远停不下来。

修复：fetch 子图要传 `state_exit_keys=("committed_cards",)`，并在 prompt 里把"必须 commit 才能结束"写得**更硬**。

---

## 🛠 重构 / 可优化

### 6. `DatabotAgent` 持有完整 `TahoeAgent` 实例做转发——双层字段冗余
**`databot_agent.py:86-97`**

```python
self.tools = list(tools)                  # 自己存
self.prompt_assembler = ...                 # 自己存
self.completion_tool_name = ...             # 自己存
self._tahoe = TahoeAgent(... tools=tools, prompt_assembler=self.prompt_assembler ...)
self.session = self._tahoe.session         # 转发
self.system_prompt = system_prompt or self._tahoe.render_system_prompt
```

每个公开方法都是 `self._tahoe.<x>()`。这是 has-a 包装的教科书例子，但代价是两份 state、两份配置、真出问题要追两层。

修复：考虑让 `TahoeAgent` 暴露可继承的 hook（如 `build_app_specific_graph`），让 `DatabotAgent` 直接继承，**只**注入 databot 自己的 prompt/工具/图。这会砍掉约 50 行。

### 7. `prepare_turn_input` 和 `_fresh_turn_state_patch` 重复定义
**`databot_agent.py:161-179` ↔ `graph.py:76-104`**

两边维护同一份"每轮重置"的字段表。新增字段时一改就漏。

修复：把表放到一个地方（例如 `state.py` 里一个 `FRESH_TURN_STATE_DEFAULTS` 常量），两边都从这里读。

### 8. `_message_content_to_str` 重复实现
**`stage_prep.py:29-40` ↔ `turn_summary.py:22-33`**

逐字符相同。放到 `agent/react/common/` 或 `graph/messages.py` 里集中维护。

### 9. `prompt.py` 单文件 456 行，混了多个 stage 的 prompt
**`prompt.py`**

`FETCH_CARDS_SYSTEM_PROMPT` / `GENERATE_SQL_SYSTEM_PROMPT` / `TURN_SUMMARY_SYSTEM_PROMPT` / `PREPARE_CARDS_FOR_GATE_PROMPT` / `NEXT_STEP_PROMPT` / `IDLE_CHAT_COMPLETION_PROMPT` / `TOOL_BUDGET_EXHAUSTED_PROMPT` / `REFINE_USER_PROFILE_PROMPT` / `IDLE_NUDGE_PROMPT` 全在一个文件里。`DatabotSystemPrompt` 之外的所有常量都建议拆成 `agent/react/databot/prompts/` 目录分文件：

- `prompts/system.py`（`DatabotSystemPrompt`）
- `prompts/fetch.py`（fetch 阶段所有）
- `prompts/sql.py`（sql 阶段所有）
- `prompts/turn_summary.py` / `prompts/gate_prep.py` / `prompts/idle.py`

### 10. `prompt_assembler_cls` 类变量是死代码
**`databot_agent.py:56`**

```python
prompt_assembler_cls = DatabotSystemPrompt
```

只在 `__init__` 里 `self.prompt_assembler = prompt_assembler or self.prompt_assembler_cls()` 用一次，并且 `prompt_assembler` 构造时没传 fallback 也用这个——其实可以直接 `type(self).prompt_assembler_cls` 都不用。删掉类变量，或在 `BaseAgent` 那边提取成可继承的 hook。

### 11. `_ok_tool_message` 样板代码每个工具都抄
**`stage_tools.py` 5 个工具**

每个工具都是 `tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"`，然后 `_ok_tool_message(tool_call_id, ...)`。可以写个 `databot_state_writing_tool` 装饰器：

```python
def databot_state_writing_tool(fn):
    @wraps(fn)
    def wrapper(*args, runtime=None, **kwargs):
        cmd = fn(*args, runtime=runtime, **kwargs)
        tid = (runtime.tool_call_id if runtime else None) or "missing"
        # 抽 tool_call_id 注入
        ...
        return cmd
    return tool
```

每个工具少 4 行，也避免漏写 ToolMessage 造成 "Expected to have a matching ToolMessage" 错误。

### 12. `_stage_state_exit_router` 返回 `tuple` 没参数化
**`subgraphs.py:52`**

```python
def _stage_state_exit_router(...) -> tuple:
```

应该是 `tuple[Callable[..., str], Callable[..., str]]`（看下 `CompletionToolRouter.route_after_reason()` 实际签名）。

### 13. `_find_tool` 应该提到 `tools/common.py`
**`graph.py:210-215`**

```python
def _find_tool(tools: list[BaseTool], name: str) -> BaseTool | None:
    for tool in tools:
        if getattr(tool, "name", None) == name:
            return tool
    return None
```

全项目应该都不止一处需要"按 name 找 tool"。`tools/common.py` 已有 `bind_tool_to_agent` / `get_agent_tools`，加一个 `find_tool` 顺理成章。

### 14. 全图节点/阶段名都是裸字符串
**`graph.py` 整文件**

`"fetch_cards"`, `"gate_cards"`, `"write_cards_artifact"`, `"generate_sql"`, `"gate_sql"`, `"write_sql_artifact"`, `"execute_sql"`, `"chart_question"`, `"end_with_summary"`, `"end_with_refusal"` 在 5 个不同 dict 里出现。打错一个字母 LangGraph 不会报，运行时才发现。

修复：常量集中在 `databot/graph.py` 顶部或单独 `databot/_constants.py`：

```python
NODE_FETCH_CARDS = "fetch_cards"
NODE_GATE_CARDS = "gate_cards"
...
```

路由 map 用这些常量构造。

### 15. `_trailing_human_wants_new_turn` 类型判断不完整
**`graph.py:52-59`**

只检查 `type == "human"` 或 `role in ("user", "human")`。但 `langchain_core.messages` 的 `RemoveMessage` 也会是 "remove"，系统重放时插的 `FunctionMessage`/`ToolMessage` 也走这条路径。AG-UI 重放时可能插入非用户消息。如果担心"新轮 vs 旧轮"误判，可以要求 `message.additional_kwargs.get("replayed")` 显式为 false 才算新轮，或者对 `type == "remove"` 显式排除。

### 16. `refine_user_profile_node=None` 在子图里硬编码
**`subgraphs.py:97、134`**

两个子图都传了 `refine_user_profile_node=None`。OK，但 subgraphs.py 的 docstring 说"subgraphs do not refine the profile"，这逻辑可以下沉到 `build_react_graph`——传 `None` 不如加个 `include_profile_refinement: bool = False` 默认参数更清晰。

### 17. `parse_card_selection` 对 `dict` 和 `str` 之外的输入返回 `None`，但 `selections_from_tool_payload` 把 legacy 字典原样塞进 list
**`card_staging.py:192-207`**

```python
elif isinstance(item, dict) and item.get("name"):
    # Legacy: full card dict without staging_id — cannot resolve.
    out.append(item)
```

注释说"无法 resolve"，但还是 `out.append(item)` 把它推下去，结果 `apply_add_card_selections` 里 `parse_card_selection(dict_without_id)` 拿到 `staging_id == ""` → 返回 `None` → 进入 `invalid selection` 分支。这条路径死代码——直接 raise 或丢弃会更好。

### 18. `_after_chart` 单独走一张 map，没必要
**`graph.py:339-343`**

只有一个目标 `end_with_summary`，干脆 `graph.add_edge("chart_question", "end_with_summary")`。如果以后真做 Superset 集成，再换回 conditional edge。

### 19. `agent.react.databot.execute` 里 `trino_run_query` 通过闭包注入
**`execute.py:23-26`**

```python
def make_execute_sql_node(trino_run_query, row_limit: int = DEFAULT_ROW_LIMIT):
```

但 `trino_run_query` 实际是 `_build_stage_tool_lists` 解析出来的实例。`build_databot_graph` 把这个实例硬绑进节点，单元测试很难 mock。改成 `trino_run_query` 是可注入的对象（用 `runtime` 拿或者从 state 里取）更好，不过鉴于这是单一后端，目前能用，但建议至少加一行 `if not callable(trino_run_query): raise TypeError(...)` 防止配错。

### 20. `profile_persistence._execution_preview` 与 `turn_summary._execution_preview` 是同一个函数
**`profile_persistence.py:62-69` ↔ `turn_summary.py:57-65`**

逻辑一致，第二个参数（5 vs 5）也一样。提到 `databot/serialization.py` 或类似的工具文件。

---

## 🧹 小清理

| #   | 位置                          | 内容                                                                                                                                                                                                                                                                                                                                  |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 21  | `card_staging.py:12, 210`     | `import json` + `encode_tool_summary` 在文件里出现但从不被调用——删                                                                                                                                                                                                                                                                   |
| 22  | `databot_agent.py:125`        | `_ = (compression_config, enable_compression)` 这种"假装用了"很 hack；要么在签名里去掉参数，要么在 supertype 里支持                                                                                                                                                                                                                     |
| 23  | `gates.py:152-181`            | `_gate_interrupt_kwargs` 把 chart 的 payload 也包到统一结构里——chart 与 cards/sql 结构完全不同，docstring 也承认"直接 build 不走 `_gate_prompt`"。拆成 `_gate_interrupt_kwargs` 和 `_chart_interrupt_kwargs` 两个                                                                                                                  |
| 24  | `graph.py:38-49`              | 路由 map 里同时混了 `fetch_cards` / `write_cards_artifact`（节点名）和 `fetch` / `sql`（阶段名）——读者无法从键名判断是哪种，见第 3 点                                                                                                                                                                                                 |
| 25  | `stage_prep.py:21-26`         | `_DEFAULT_CARDS_GATE_REASONS` 写死英文，没有对应 SQL gate 默认——两边的不对称意味着 prepare_cards_for_gate 永远比 prepare_sql 鲁棒                                                                                                                                                                                                       |
| 26  | `ui_actions.py:97-114`        | `_subgraph_redraft_counters` 和 `_feedback_human_message` 是内部实现细节，但被 `apply_cards_gate_redraft` / `apply_sql_gate_redraft` 共享。提到独立小函数 OK，但**别在模块顶层**——加个 `_` 前缀已经够了                                                                                                                                  |
| 27  | `prompt.py:13-25`             | `STAGE_USER_FACING_OUTPUT_STYLE` 注释里夹了 `Bad: "I've validated the SQL with trino_explain..."`——这个反例已经在 `tools/trino.py` 等多处的 guard 提示里出现，提示和 prompt 是两份 source of truth，建议集中到一处                                                                                                                       |

---

## 🧪 测试覆盖

已有：

- `test_databot_graph.py`（417 行） — 路由、stage machine
- `test_databot_gates.py`（146 行） — gate resume 解析、reason 规范化
- `test_databot_router.py`（55 行） — completion stall
- `test_databot_ui_actions.py`（73 行） — UI action patches

**没覆盖的**：

- `_fresh_turn_state_patch()` 的 reset 完整性（涉及第 2 点）
- `record_metric_conflict` 多次调用累积（第 1 点）
- `chart_question` 当前是 no-op 的回归测试
- `apply_cards_gate_redraft` / `apply_sql_gate_redraft` 的反馈消息体
- `execute_sql` 在 `trino_run_query is None` 时的分支
- `compact_staging_refs` 的截断逻辑

---

## 🎯 建议的优先处理顺序

1. **第 1 点**（conflict 被覆盖）—— silent data loss
2. **第 4 点**（chart_question 死节点）—— 简单删除，砍掉 8 行
3. **第 5 点**（fetch 子图退出条件）—— LLM 不 commit 就会卡住
4. **第 3 点**（路由 map 语义混用）—— 重构一次，受益所有后续阶段
5. **第 6 点**（TahoeAgent 包装层）—— 视未来 agent 数量决定是否值得
6. **第 7、8、20 点**（重复定义）—— 顺手就能做，deduplication
