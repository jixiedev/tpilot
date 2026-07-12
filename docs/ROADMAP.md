# TahoePilot 项目路线图

> 中文 | [English](ROADMAP.en.md)

面向数据团队的 AI Agent 平台：Chatbot、智能取数、数据诊断、开发辅助、数据分析。

**当前版本**：0.1.0  
**技术栈**：Python 3.11+ · LangGraph · LangChain · OpenAI · Hive HMS · Trino · MCP

---

## Milestones

| ID | Milestone | 描述 | 状态 |
|----|-----------|------|------|
| M0 | 可对话 | CLI 里与 Agent 多轮对话，调用 Hive/Trino/MCP 工具拿到结果 | 已完成：通用 ReAct Graph + `--agent` 插件化；默认 `chatbot`；详见 [CHAT_OPTIMIZATION.md](CHAT_OPTIMIZATION.md) |
| M1 | 可恢复 | 对话状态持久化，关掉再开能接着聊；长对话有上下文管理 | 进行中：LangGraph `AsyncSqliteSaver` + `--session` 可跨进程恢复；三层上下文压缩（F4）已接入 chatbot graph |

| M2 | 能取数 | 用自然语言描述数据需求，Agent 找表、写 SQL、返回查询结果 | 未开始 |
| M3 | 能协作 | 复杂任务拆给多个专精 Agent，彼此传递中间结果 | 未开始 |
| M4 | 能诊断 | 描述数据异常，Agent 跑质量检查、推根因、出报告 | 未开始 |
| M5 | 可部署 | 从本地 CLI 变成可对外提供的服务（UI、API、权限、观测） | 未开始 |

## Features

| ID | Feature | 描述 | 优先级 | 状态 |
|----|---------|------|--------|------|
| F1 | Context Engineering | 动态组装 system prompt、上下文片段、工具描述 | P0 | 未开始 |
| F2 | Structured Output | 结构化输出约束（typed response、JSON schema） | P0 | 未开始 |
| F3 | Memory | 跨 Session 状态持久化；用户偏好与历史上下文召回 | P0 | 进行中：`--session` + SQLite checkpointer 已持久化对话；偏好/跨会话召回未做 |
| F4 | Memory Compression | 长对话自动压缩/摘要，保留关键事实，控制 context 窗口 | P0 | 进行中：三层流水线（工具结果卸载 / 写入参数驱逐 / LLM 摘要）+ `compact_context`；跨会话偏好召回仍属 F3 |

| F5 | Planning | 任务规划与分解，Plan-and-Execute | P1 | 未开始 |
| F6 | Human-in-the-Loop | 关键节点 interrupt，等待用户确认或补充 | P1 | 未开始 |
| F7 | Reflective Reasoning | 输出前自我审查与修正（一致性检查、retry） | P1 | 未开始 |
| F8 | Parallel Tool Use | 并行工具调用与结果聚合 | P1 | 未开始 |
| F9 | Eval Loop | 评测集回归、Prompt/Agent 行为持续迭代 | P2 | 未开始 |
| F10 | Monitoring | Token 用量、Cache 命中率、工具调用延迟与错误率 | P2 | 未开始 |
| F11 | Semantic Cache | 语义相似的请求命中缓存，避免重复推理 | P2 | 未开始 |
| F12 | Model Routing | 按任务复杂度/成本动态选择模型 | P2 | 未开始 |
| F13 | Procedural Memory | 从成功交互中提炼可复用的工具调用序列与工作流 | P3 | 未开始 |
| F14 | Error Handling | LLM/工具调用失败分类、重试与降级；Graph 与 CLI 层友好报错；可恢复中断，避免整轮静默失败 | P1 | 未开始 |

---

*最后更新：2026-07-12*
