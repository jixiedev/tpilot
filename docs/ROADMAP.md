# TahoePilot 项目路线图

> 中文 | [English](ROADMAP.en.md)

面向数据团队的 AI Agent 平台：Chatbot、智能取数、团队知识问答、数据诊断、开发辅助、数据分析。

**当前版本**：0.1.0  
**技术栈**：Python 3.11+ · LangGraph · LangChain · OpenAI · Hive HMS · Trino · MCP · Qdrant

---

## Milestones

| ID | Milestone | 描述 | 状态 |
|----|-----------|------|------|
| M0 | 可对话 | CLI 里与 Agent 多轮对话，调用 Hive/Trino/MCP 工具拿到结果 | 已完成：通用 ReAct Graph + `--agent` 插件化；详见 [CHAT_OPTIMIZATION.md](CHAT_OPTIMIZATION.md) |
| M1 | 可恢复 | 对话状态持久化，关掉再开能接着聊；长对话有上下文管理 | 已完成：`AsyncSqliteSaver` + `--session`；上下文压缩（F4）已接入 |
| M2 | 能取数 | 用自然语言描述数据需求，Agent 找表、写 SQL、返回查询结果 | 已完成：glossary-first → 元数据/血缘 → 只读 SQL；`DatabotAgent` v2 分阶段状态机（fetch → cards gate → SQL gate → execute）+ Web 取数面板（CopilotKit v2） |
| M3 | 能查知识 | 用自然语言问 Tahoe 团队知识：代码库、Google Docs、Wiki/FAQ、Jira；Agent 检索并解释 | 已完成（v1）：`KnowledgeAgent`（`--agent knowledge` / Intent `KNOWLEDGE`）；Jira Qdrant 检索；DataHub + 只读 K8s。Drive zip 与 dbt semantic model 可入库；`fetch_related_models` 工具已接；代码库 / Wiki / Drive 检索工具待接 |
| M4 | 能协作 | 复杂任务拆给多个专精 Agent，彼此传递中间结果 | 已完成（进程内）：`IntentOrchestrator` 复合意图 → `execution_plan` → `PlannedAgentChain`；上游输出喂下游；子 Agent 短时会话。跨服务组合见 F16（A2A） |
| M5 | 能诊断 | 描述数据异常，Agent 跑质量检查、推根因、出报告 | 未开始 |
| M6 | 可部署 | 从本地 CLI 变成可对外提供的服务（UI、API、权限、观测） | 进行中（本地）：Next.js + CopilotKit v2 + LangGraph AG-UI 联调（Databot 聊天、Gate、Cards/SQL/Results 面板）；对外 API、权限、生产部署与观测待做 |

## Features

| ID | Feature | 描述 | 优先级 | 状态 |
|----|---------|------|--------|------|
| F1 | Context Engineering | 动态组装 system prompt、上下文片段、工具描述 | P0 | 已完成：分层 `SystemPromptAssembler` + `UserProfile` 注入 |
| F2 | Structured Output | 结构化输出约束（typed response、JSON schema） | P0 | 已完成：意图 `IntentionResponse` / 计划步骤、画像 refine |
| F3 | Memory | 跨 Session 状态持久化；用户偏好与历史上下文召回 | P0 | 已完成：checkpointer 会话 + `FileProfileStore` / `refine_user_profile` |
| F4 | Memory Compression | 长对话自动压缩/摘要，保留关键事实，控制 context 窗口 | P0 | 已完成：三层压缩流水线 + `compact_context` |
| F5 | Planning | 任务规划与分解，Plan-and-Execute | P1 | 已完成：Intent 有序 `execution_plan` + AgentChain 执行 |
| F6 | Human-in-the-Loop | 关键节点 interrupt，等待用户确认或补充 | P1 | 已完成：Intent 低置信澄清 interrupt + CLI resume；Databot v2 cards/SQL 人工门（AG-UI v2 interrupt + CopilotKit Gate / Artifact 面板、卡片勾选与 SQL 编辑） |
| F7 | Reflective Reasoning | 输出前自我审查与修正（一致性检查、retry） | P1 | 未开始 |
| F8 | Parallel Tool Use | 并行工具调用与结果聚合 | P1 | 未开始 |
| F9 | Eval Loop | 评测集回归、Prompt/Agent 行为持续迭代 | P2 | 已完成（v1）：`observability` 用例 JSON + Observer 打分（工具序/轮次/答案）+ `python -m observability` |
| F10 | Monitoring | Token 用量、Cache 命中率、工具调用延迟与错误率 | P2 | 未开始 |
| F11 | Semantic Cache | 语义相似的请求命中缓存，避免重复推理 | P2 | 未开始 |
| F12 | Model Routing | 按任务复杂度/成本动态选择模型 | P2 | 未开始 |
| F13 | Procedural Memory | 从成功交互中提炼可复用的工具调用序列与工作流 | P3 | 未开始 |
| F14 | Error Handling | LLM/工具失败分类、重试与降级；友好报错与可恢复中断 | P1 | 已完成：TOOL ERROR、瞬时重试、Hive↔Trino 防振荡、CLI 友好报错 |
| F15 | RAG | 本地 Qdrant 向量库；Jira / Google Drive 等知识入库与语义检索，供 Knowledge Agent 使用 | P1 | 已完成（Jira + dbt 主路径）：Docker Qdrant、ingest CLI（Jira CSV / Drive zip / dbt semantic model）、`fetch_related_jira_tickets` 与 `fetch_related_models`（Databot 卡片候选）。Drive / Wiki 检索工具与 RAG 评测待接 |
| F16 | A2A 多 Agent 组合 | 基于 [Agent-to-Agent（A2A）](https://google.github.io/A2A/) 协议，跨进程/跨服务编排多个专精 Agent 协作解决复杂问题；标准化任务委派、artifact 传递、状态流式回传与 Agent Card 发现 | P1 | 未开始：当前 M4 为进程内 `AgentChain`；目标将 Databot / Knowledge / 未来诊断等以 A2A endpoint 暴露，由编排层通过 A2A task 组合 |
| F17 | Databot 运行时 | 把 Databot 收成可嵌入的 specialist：分层图、进程内职责对象、节点以操作 Agent 的方式推进；HITL 分级且默认关闭；取数回合以 summary 结束并清空工作状态 | P1 | 未开始 — 见下文 **F17 Databot 运行时** |

GitHub issues:

| ID | Issue |
|----|--------|
| F1 | [#15](https://github.com/jixiedev/tpilot/issues/15) Dynamic per-agent system prompt assembly with user profile injection |
| F2 | [#16](https://github.com/jixiedev/tpilot/issues/16) Schema-validated intent detection, execution plans, and profile refinement |
| F3 | [#12](https://github.com/jixiedev/tpilot/issues/12) SQLite-backed LangGraph checkpoints and file-backed user profiles |
| F4 | [#13](https://github.com/jixiedev/tpilot/issues/13) Three-layer conversation compression with tool result offload to disk |
| F5 | [#21](https://github.com/jixiedev/tpilot/issues/21) Multi-step intent orchestration with ephemeral specialist agent chains |
| F6 | [#20](https://github.com/jixiedev/tpilot/issues/20) AG-UI human gates for intent clarification and Databot card and SQL approval |
| F7 | [#22](https://github.com/jixiedev/tpilot/issues/22) Pre-delivery self-check and retry against tool evidence before final reply |
| F8 | [#23](https://github.com/jixiedev/tpilot/issues/23) Safe parallel tool execution within a ReAct turn and stage subgraphs |
| F9 | [#24](https://github.com/jixiedev/tpilot/issues/24) Observability eval harness with JSON cases, Observer traces, and CLI scorers |
| F10 | [#25](https://github.com/jixiedev/tpilot/issues/25) Production metrics for LLM tokens, tool latency, cache hits, and error rates |
| F11 | [#26](https://github.com/jixiedev/tpilot/issues/26) Embedding-based semantic request cache with version-aware invalidation |
| F12 | [#27](https://github.com/jixiedev/tpilot/issues/27) Configurable LLM tier selection by task complexity and cost budget |
| F13 | [#28](https://github.com/jixiedev/tpilot/issues/28) Learn and suggest proven multi-tool workflows from successful agent turns |
| F14 | [#14](https://github.com/jixiedev/tpilot/issues/14) Structured tool errors, transient retries, and Hive–Trino fallback guardrails |
| F15 | [#17](https://github.com/jixiedev/tpilot/issues/17) Qdrant RAG ingest, hybrid retrieval, and search tools for specialists |
| F16 | [#29](https://github.com/jixiedev/tpilot/issues/29) Cross-service specialist orchestration via the Agent-to-Agent (A2A) protocol |
| F17 | [#18](https://github.com/jixiedev/tpilot/issues/18) Layered Databot graph · [#19](https://github.com/jixiedev/tpilot/issues/19) In-process Databot state |
| M5 | [#30](https://github.com/jixiedev/tpilot/issues/30) Data diagnostic specialist for anomaly checks and root-cause reports |
| M6 | [#31](https://github.com/jixiedev/tpilot/issues/31) Production deploy with public API, auth, multi-tenant ops, and full intent web UI |

---

## 后续优化可能

里程碑/特性已标「已完成」的，表示主路径可用；下列为可继续加深的方向（不阻塞当前里程碑关闭）。

### 里程碑相关

| 关联 | 可能优化 |
|------|----------|
| M2 | 独立取数评测集；SQL gate Request changes 重写闭环；聊天面向用户的 status 文案（非内心独白）；chart gate / Superset 出图；详见 [DATABOT_V2_PROGRESS.md](DATABOT_V2_PROGRESS.md) 与 [CHAT_OPTIMIZATION.md](CHAT_OPTIMIZATION.md) |
| M2 | Databot 运行时重构（F17）：分层图、可嵌入 Plan 等宿主、回合摘要后清空工作状态；详见 **F17 Databot 运行时** |
| M3 | Drive / Wiki / 代码检索工具与 Knowledge prompt；Intent 复合链路用真实知识库联调；详见 [rag/README.md](../rag/README.md) |
| M4 | 计划确认 HITL；比纯文本更结构化的 handoff payload |
| M4 | A2A 跨服务编排（F16）：专精 Agent 以 A2A endpoint + Agent Card 暴露；Intent / 编排层用 A2A task + artifact 组合 databot、knowledge、未来 diagnostic；远程鉴权、超时与降级 |
| M5 | 仍按未开始推进（诊断 Agent） |
| M6 | 生产部署、鉴权、多租户、观测（F10）；checkpoint / thread 管理；Intent 全链路 Web UI（当前以 Databot 专精 UI 为主） |

### 特性相关

| 关联 | 可能优化 |
|------|----------|
| F1 | 工具描述按回合/意图动态裁剪与组装 |
| F2 | 对外用户回复的 typed / JSON schema |
| F3 | 跨会话语义召回（不止画像与 checkpointer） |
| F5 | 通用 Plan 节点（非仅 Intent 编排）；计划修订与重规划；与 F16 A2A 组合时的跨 Agent 任务分解 |
| F6 | 通用确认门（写操作、高成本工具、发布计划前确认）；chart gate Web UI；Databot profile sidecar 并入 `UserProfile` |
| F7–F8、F10–F13 | F7/F8/F10–F13 仍按未开始推进（反思、并行工具、监控、语义缓存、选模、程序性记忆）；F9 评测见下文 **F9 Eval Loop** |
| F16 | Agent Card 注册与发现；A2A task / artifact 映射到现有 handoff 结构；与 M6 服务化部署对齐（鉴权、观测、多租户） |
| F17 | 见下文 **F17 Databot 运行时** |
| F14 | 失败观测指标；更完整的集成测试覆盖 |
| F15 | Google Drive / Wiki 检索工具；增量更新与去重；检索质量评测；多 collection 路由 |

### F9 Eval Loop（v1 → 后续）

**已交付（v1）** — 仓库内 JSON 用例、`Observer` 轨迹、`python -m observability`：

| 用例类型 | 打分维度 |
|----------|----------|
| ReAct（`ToolCallCase`） | 工具顺序（子序列）、ReAct 轮次预算、JSON 答案字段（shape 写在 case `query`；`answer` 为空则跳过） |
| Intent（`IntentRouterCase`） | 路由 status、意图标签、专精 Agent 顺序（`execute_plan=False`） |

**优点** — 简单、可 git 管理、无 SaaS 依赖；贴合 ReAct + Intent；确定性 scorer 可单测；不只验最终文本，还看工具/路由过程。

**局限** — 依赖 live LLM 与外部服务（Qdrant/MCP），CI 易 flake；JSON 字段精确匹配，同义改写会失败；未校验 tool 参数；三维等权；query 与 answer 重复维护；少 multi-turn / clarify；无 trace 归档与实验对比；评测强制 JSON 可能与线上真实 prompt 不一致。

**主流做法** — 数据集行 → 执行（live / mock / 回放）→ **多种 scorer**（规则 + 可选 LLM judge + 环境结果）→ 报告与门禁；LangSmith / Langfuse / Braintrust 等持久化 trace 并对比实验。常见 CI：L0 scorer 单测 → L1 mock LLM/工具 → L2 smoke live → L3 夜间 integration → L4 抽样 LLM judge。

**分阶段规划**

| 阶段 | 重点 |
|------|------|
| **1 — 稳定 CI** | fast（mock 路由 + scorer 单测）/ slow（live）；加权或 hard gate；tool 参数校验；用例 tags（`smoke` / `integration`） |
| **2 — 更强确定性评测** | 可选 JSON Schema；shape 与期望值单一来源；multi-turn clarify  fixture；golden trace 回放 |
| **3 — Trace 与实验**（配合 F10） | 持久化 Observer；run id + git sha；同数据集跨版本 diff |
| **4 — 语义 / RAG 评测**（配合 F15） | 抽样 LLM judge；Jira 语料 faithfulness / recall；eval 与生产 prompt 分离 |
| **5 — 产品化评测**（配合 M6） | M2/M3 专用数据集；线上 trace 抽样；服务侧 eval API |

**近期** — case `tags` + CLI 过滤；CI 内 mock-LLM intent 用例；各 group 环境依赖说明；case 内 scorer 权重；`Observer` 单次 run trace JSON 导出试验。

### F17 Databot 运行时

把 Databot 从「一张扁平 state 上的强耦合状态机」收成可嵌入的 specialist。取数主路径（找表、写 SQL、执行、给出答复）保留；变的是图的层次、状态放在哪里、以及人工确认是否默认打断宿主。

**现状**

- 外层图把找表、两道人工闸门、写 SQL、执行、追问分类、知识追问铺在同一层。路由表互相点名 node，`stage` 和边绑在一起，加一条路径就要改多处路由。
- `DatabotState` 是扁平字段集合。节点以返回 JSON patch 的方式改状态。读代码时看到的是「函数交出一份 dict」，而不是「这一步对 Agent 做了什么」。
- Cards / SQL 人工闸门写在主路径上。Plan 等宿主把 Databot 当一步调用时，interrupt 会冒到宿主对话里。
- 一轮取数结束后，pipeline 字段还留在 state 里。下一条用户消息先做一次 follow-up 分类（知识追问或重新查数），再决定走知识子图还是整条流水线。多一次模型调用，图也更绕。

**方向**

F17 拆成两块，分别做、分别验收。交界处只有一条约定：图负责回合怎么走完（摘要之后结束）；state 负责摘要写入对话后清空本回合工作对象。

### 图

| 点 | 做法 |
|----|------|
| 分层 | 外层只编排一个取数回合：准备 → 取数 → 摘要并结束。选表、写 SQL、执行放在内层。内层路由只看见本层的下一步，不引用外层的全部 node。 |
| HITL 分级，默认关闭 | 人工确认是可配置级别，默认 disable，不写进主路径的必经边。嵌入 Plan agent 时，Databot 作为普通步骤跑完。需要审表、审 SQL 或两者都审时，由调用方打开对应级别。平台级确认能力仍归 F6。 |
| 回合在摘要处结束 | 取数回合的终点是一份 summary，写入对话后图结束。下一条用户消息是新回合。上下文靠这份 summary，以及既有的对话压缩（F4）。 |

这一块去掉 follow-up 意图分类，以及「接着上一轮结果追问」的图路径。澄清或改口径都作为新回合，以上一轮 summary 为上下文。

### Agent state

| 点 | 做法 |
|----|------|
| 节点操作 Agent | 业务节点对 Agent 调用操作来推进回合，不以「返回一份 state JSON」为接口。LangGraph 仍要求节点向运行时提交 state update：这份差异收在适配层，checkpoint 与图引擎保持兼容。 |
| 进程内职责对象 | Agent 内部按职责拆对象（例如卡片、SQL、执行结果、本回合摘要），替代一整张扁平 dict。对象留在进程中。Checkpoint 只保留恢复暂停所需的最小快照，不把每个中间结构都做成 graph state 的字段。 |
| 摘要之后清空 | summary 写入对话后，清空本回合工作对象。下一回合从空的工作状态开始。 |

这一块不替换 LangGraph。节点对引擎仍然交出它能 checkpoint 的更新；转换留在适配层。

**关联**：M2 取数主路径的结构；嵌入 F5 Plan / M4 进程内编排时，Databot 默认不抢 HITL。图的重构用「节点通过操作推进」这条接口，state 先把对象和适配层立住。

---

*最后更新：2026-10-30*
