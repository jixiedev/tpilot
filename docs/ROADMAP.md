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
| M6 | 可部署 | 从本地 CLI 变成可对外提供的服务（UI、API、权限、观测） | 进行中（本地）：Next.js + CopilotKit v2 + LangGraph AG-UI 联调（Databot 聊天、Gate、Cards/SQL/Results 面板；Plan 聊天、任务树、嵌套 specialist 门弹窗）；对外 API、权限、生产部署与观测待做 |

## Features

| ID | Feature | 描述 | 优先级 | 状态 |
|----|---------|------|--------|------|
| F1 | Context Engineering | 动态组装 system prompt、上下文片段、工具描述 | P0 | 已完成：分层 `SystemPromptAssembler` + `UserProfile` 注入 |
| F2 | Structured Output | 结构化输出约束（typed response、JSON schema） | P0 | 已完成：意图 `IntentionResponse` / 计划步骤、画像 refine |
| F3 | Memory | 跨 Session 状态持久化；用户偏好与历史上下文召回 | P0 | 已完成：checkpointer 会话 + `FileProfileStore` / `refine_user_profile` |
| F4 | Memory Compression | 长对话自动压缩/摘要，保留关键事实，控制 context 窗口 | P0 | 已完成：三层压缩流水线 + `compact_context` |
| F5 | Planning | 任务规划与分解，Plan-and-Execute | P1 | 已完成：Intent 有序 `execution_plan` + AgentChain 执行 |
| F6 | Human-in-the-Loop | 关键节点 interrupt，等待用户确认或补充 | P1 | 已完成：Intent 低置信澄清 interrupt + CLI resume；Databot v2 cards/SQL 人工门（AG-UI v2 interrupt + CopilotKit Gate / Artifact 面板、卡片勾选与 SQL 编辑）；Plan 嵌套 specialist 门（父图 interrupt + `/plan` 弹窗选择） |
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

---

## 后续优化可能

里程碑/特性已标「已完成」的，表示主路径可用；下列为可继续加深的方向（不阻塞当前里程碑关闭）。

### 里程碑相关

| 关联 | 可能优化 |
|------|----------|
| M2 | 独立取数评测集；SQL gate Request changes 重写闭环；聊天面向用户的 status 文案（非内心独白）；chart gate / Superset 出图；详见 [DATABOT_V2_PROGRESS.md](DATABOT_V2_PROGRESS.md) 与 [CHAT_OPTIMIZATION.md](CHAT_OPTIMIZATION.md) |
| M3 | Drive / Wiki / 代码检索工具与 Knowledge prompt；Intent 复合链路用真实知识库联调；详见 [rag/README.md](../rag/README.md) |
| M4 | 计划确认 HITL；比纯文本更结构化的 handoff payload |
| M4 | A2A 跨服务编排（F16）：专精 Agent 以 A2A endpoint + Agent Card 暴露；Intent / 编排层用 A2A task + artifact 组合 databot、knowledge、未来 diagnostic；远程鉴权、超时与降级 |
| M5 | 仍按未开始推进（诊断 Agent） |
| M6 | 生产部署、鉴权、多租户、观测（F10）；checkpoint / thread 管理；Intent 全链路 Web UI（当前以 Databot 专精 UI 为主）；Plan 页弹窗目前是决策面（无 Cards 勾选 / SQL 编辑器） |

### 特性相关

| 关联 | 可能优化 |
|------|----------|
| F1 | 工具描述按回合/意图动态裁剪与组装 |
| F2 | 对外用户回复的 typed / JSON schema |
| F3 | 跨会话语义召回（不止画像与 checkpointer） |
| F5 | 通用 Plan 节点（非仅 Intent 编排）；计划修订与重规划；与 F16 A2A 组合时的跨 Agent 任务分解 |
| F6 | 通用确认门（写操作、高成本工具、发布计划前确认）；chart gate Web UI；Databot profile sidecar 并入 `UserProfile`；Plan 弹窗目前仅为决策，不包含 Cards 勾选 / SQL 编辑 |
| F7–F8、F10–F13 | F7/F8/F10–F13 仍按未开始推进（反思、并行工具、监控、语义缓存、选模、程序性记忆）；F9 评测见下文 **F9 Eval Loop** |
| F16 | Agent Card 注册与发现；A2A task / artifact 映射到现有 handoff 结构；与 M6 服务化部署对齐（鉴权、观测、多租户） |
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

---

*最后更新：2026-09-01*
