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
| M2 | 能取数 | 用自然语言描述数据需求，Agent 找表、写 SQL、返回查询结果 | 已完成：glossary-first → 元数据/血缘 → 只读 SQL；`DatabotAgent` / 取数 prompt 契约 |
| M3 | 能查知识 | 用自然语言问 Tahoe 团队知识：代码库、Google Docs、Wiki/FAQ、Jira；Agent 检索并解释 | 进行中：`KnowledgeAgent` + Jira 检索工具；Qdrant RAG 入库（Jira CSV / Google Drive zip）已通；代码库与 Wiki 仍开放 |
| M4 | 能协作 | 复杂任务拆给多个专精 Agent，彼此传递中间结果 | 已完成：`IntentOrchestrator` 复合意图 → `execution_plan` → `PlannedAgentChain`；上游输出喂下游；子 Agent 短时会话 |
| M5 | 能诊断 | 描述数据异常，Agent 跑质量检查、推根因、出报告 | 未开始 |
| M6 | 可部署 | 从本地 CLI 变成可对外提供的服务（UI、API、权限、观测） | 未开始 |

## Features

| ID | Feature | 描述 | 优先级 | 状态 |
|----|---------|------|--------|------|
| F1 | Context Engineering | 动态组装 system prompt、上下文片段、工具描述 | P0 | 已完成：分层 `SystemPromptAssembler` + `UserProfile` 注入 |
| F2 | Structured Output | 结构化输出约束（typed response、JSON schema） | P0 | 已完成：意图 `IntentionResponse` / 计划步骤、画像 refine |
| F3 | Memory | 跨 Session 状态持久化；用户偏好与历史上下文召回 | P0 | 已完成：checkpointer 会话 + `FileProfileStore` / `refine_user_profile` |
| F4 | Memory Compression | 长对话自动压缩/摘要，保留关键事实，控制 context 窗口 | P0 | 已完成：三层压缩流水线 + `compact_context` |
| F5 | Planning | 任务规划与分解，Plan-and-Execute | P1 | 已完成：Intent 有序 `execution_plan` + AgentChain 执行 |
| F6 | Human-in-the-Loop | 关键节点 interrupt，等待用户确认或补充 | P1 | 已完成：Intent 低置信澄清 interrupt + CLI resume |
| F7 | Reflective Reasoning | 输出前自我审查与修正（一致性检查、retry） | P1 | 未开始 |
| F8 | Parallel Tool Use | 并行工具调用与结果聚合 | P1 | 未开始 |
| F9 | Eval Loop | 评测集回归、Prompt/Agent 行为持续迭代 | P2 | 未开始 |
| F10 | Monitoring | Token 用量、Cache 命中率、工具调用延迟与错误率 | P2 | 未开始 |
| F11 | Semantic Cache | 语义相似的请求命中缓存，避免重复推理 | P2 | 未开始 |
| F12 | Model Routing | 按任务复杂度/成本动态选择模型 | P2 | 未开始 |
| F13 | Procedural Memory | 从成功交互中提炼可复用的工具调用序列与工作流 | P3 | 未开始 |
| F14 | Error Handling | LLM/工具失败分类、重试与降级；友好报错与可恢复中断 | P1 | 已完成：TOOL ERROR、瞬时重试、Hive↔Trino 防振荡、CLI 友好报错 |
| F15 | RAG | 本地 Qdrant 向量库；Jira / Google Drive 等知识入库与语义检索，供 Knowledge Agent 使用 | P1 | 进行中：Docker Qdrant、ingest CLI（Jira CSV / Drive zip）、Jira 检索工具；Drive/Wiki 检索工具与评测仍开放 |

---

## 后续优化可能

里程碑/特性已标「已完成」的，表示主路径可用；下列为可继续加深的方向（不阻塞当前里程碑关闭）。

### 里程碑相关

| 关联 | 可能优化 |
|------|----------|
| M2 | 独立取数评测集；更强的表选择 / SQL 纠错闭环；本轮绑定 DataHub glossary（名称/URN）：写入 state `related_glossary_term` 作程序锚点（门禁、引用校验、AgentChain handoff），并显式注入 messages/system（模型默认读不到纯 state），避免只靠 state 指望注意力 |
| M3 | 补齐 Drive/Wiki/代码检索工具与 Knowledge prompt；与 Intent 复合链路联调；详见 [rag/README.md](../rag/README.md) |
| M4 | Knowledge 产品化后的真实复合链路联调；计划确认 HITL；比纯文本更结构化的 handoff payload |
| M5 / M6 | 仍按未开始推进（诊断 Agent；服务化 UI/API/权限/观测） |

### 特性相关

| 关联 | 可能优化 |
|------|----------|
| F1 | 工具描述按回合/意图动态裁剪与组装 |
| F2 | 对外用户回复的 typed / JSON schema |
| F3 | 跨会话语义召回（不止画像与 checkpointer） |
| F5 | 通用 Plan 节点（非仅 Intent 编排）；计划修订与重规划 |
| F6 | 通用确认门（写操作、高成本工具、发布计划前确认） |
| F7–F13 | 仍按未开始推进（反思、并行工具、评测、监控、语义缓存、选模、程序性记忆） |
| F14 | 失败观测指标；更完整的集成测试覆盖 |
| F15 | Google Drive / Wiki 检索工具；增量更新与去重；检索质量评测；多 collection 路由 |

---

*最后更新：2026-08-10*
