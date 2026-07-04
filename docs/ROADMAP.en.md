# TahoePilot Project Roadmap

> [中文](ROADMAP.md) | English

An AI Agent platform for data teams: chatbot, intelligent data retrieval, data diagnosis, development assistance, and data analysis.

**Current version**: 0.1.0  
**Tech stack**: Python 3.11+ · LangGraph · LangChain · OpenAI · Hive HMS · Trino · MCP

---

## Milestones

| ID | Milestone | Description | Status |
|----|-----------|-------------|--------|
| M0 | Conversational | Multi-turn chat in the CLI; call Hive/Trino/MCP tools to get results | In progress: Hive/Trino/MCP tools ready, graph skeleton in place, LLM and CLI pending |
| M1 | Resumable | Conversation state persists; pick up where you left off; long-context management | Not started |
| M2 | Data retrieval | Describe data needs in natural language; Agent finds tables, writes SQL, returns results | Not started |
| M3 | Collaborative | Complex tasks split across specialized agents that pass intermediate results | Not started |
| M4 | Diagnostic | Describe data anomalies; Agent runs quality checks, reasons about root cause, produces reports | Not started |
| M5 | Deployable | Move from local CLI to an outward-facing service (UI, API, auth, observability) | Not started |

## Features

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| F1 | Memory | Session persistence, context management; user preferences and frequent tables across sessions | Not started |
| F2 | Multi-Agent | Router dispatch, Supervisor orchestration, Handoff | Not started |
| F3 | Human-in-the-Loop | User confirmation for high-risk operations | Not started |
| F4 | Data Diagnosis | Quality checks, root-cause reasoning, diagnostic reports | Not started |
| F5 | Lineage Awareness | Table lineage / upstream pipeline for investigation | Not started |
| F6 | Code Generation & Review | SQL / pipeline generation and review | Not started |
| F7 | Data Analysis | Trend analysis, visualization suggestions, notebook export | Not started |
| F8 | Web UI & API | Browser chat, REST/SSE API | Not started |
| F9 | Auth & RBAC | Authentication, catalog/schema-level permissions | Not started |

---

*Last updated: 2026-07-04*
