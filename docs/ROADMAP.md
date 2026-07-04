# TahoePilot 项目路线图

> 中文 | [English](ROADMAP.en.md)

面向数据团队的 AI Agent 平台：Chatbot、智能取数、数据诊断、开发辅助、数据分析。

**当前版本**：0.1.0  
**技术栈**：Python 3.11+ · LangGraph · LangChain · OpenAI · Hive HMS · Trino · MCP

---

## Milestones

| ID | Milestone | 描述 | 状态 |
|----|-----------|------|------|
| M0 | 可对话 | CLI 里与 Agent 多轮对话，调用 Hive/Trino/MCP 工具拿到结果 | 进行中：Hive/Trino/MCP 工具已就绪，Graph 骨架在列，LLM 与 CLI 待接入 |
| M1 | 可恢复 | 对话状态持久化，关掉再开能接着聊；长对话有上下文管理 | 未开始 |
| M2 | 能取数 | 用自然语言描述数据需求，Agent 找表、写 SQL、返回查询结果 | 未开始 |
| M3 | 能协作 | 复杂任务拆给多个专精 Agent，彼此传递中间结果 | 未开始 |
| M4 | 能诊断 | 描述数据异常，Agent 跑质量检查、推根因、出报告 | 未开始 |
| M5 | 可部署 | 从本地 CLI 变成可对外提供的服务（UI、API、权限、观测） | 未开始 |

## Features

| ID | Feature | 描述 | 状态 |
|----|---------|------|------|
| F1 | Memory | 会话持久化、上下文管理；跨 Session 的用户偏好与常用表 | 未开始 |
| F2 | Multi-Agent | Router 分发、Supervisor 编排、Handoff | 未开始 |
| F3 | Human-in-the-Loop | 高风险操作需用户确认 | 未开始 |
| F4 | Data Diagnosis | 质量检查、根因推理、诊断报告 | 未开始 |
| F5 | Lineage Awareness | 表血缘 / 上游 Pipeline 辅助定位 | 未开始 |
| F6 | Code Generation & Review | SQL / Pipeline 生成与审查 | 未开始 |
| F7 | Data Analysis | 趋势分析、可视化建议、Notebook 导出 | 未开始 |
| F8 | Web UI & API | 浏览器 Chat、REST/SSE API | 未开始 |
| F9 | Auth & RBAC | 用户认证、catalog/schema 级权限 | 未开始 |

---

*最后更新：2026-07-04*
