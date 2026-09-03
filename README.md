# TahoePilot

面向数据团队的 AI Agent 平台：多轮 CLI 对话，连接 Hive、Trino 及可选 MCP 工具。基于 LangGraph / LangChain 构建。

**版本** 0.1.0 · **Python** 3.11+

## 能做什么

- **多轮对话** — CLI REPL，会话历史持久化（`--session`）
- **多 Agent** — 数据检索、知识问答、诊断、分析、开发等，用 `--agent` 切换
- **意图路由** — `intent` Agent 自动识别问题并分派给对应专家
- **数据工具** — Hive 元数据、Trino 只读 SQL、DataHub / Airflow 等 MCP 工具
- **可恢复** — SQLite checkpoint，重启后接着聊

## 快速开始

### 安装

```bash
uv sync          # 推荐
# 或
pip install -e .
```

可选扩展（按需安装）：

| Extra | 用途 |
|-------|------|
| `web` | CopilotKit Web UI（`agui_server.py`） |
| `k8s` | Kubernetes 只读工具 |
| `rag` | Qdrant 向量检索、Knowledge Agent |

```bash
pip install 'tahoepilot[web,k8s,rag]'
```

### 配置

1. **LLM** — 设置 API Key（模型定义见 `models/models.toml`）：

   ```bash
   export GLM_API_KEY="your-key"
   ```

2. **数据连接** — 编辑 `config/tools.toml`，配置 Hive HMS 和 Trino。

3. **MCP（可选）** — 复制 `tools/mcp/mcp.json.example` 为 `tools/mcp/mcp.json` 并填写服务地址。缺失或连接失败时自动降级，仅使用内置工具。

### 运行

```bash
tahoepilot
# 或
python main.py

# 指定 Agent
python main.py --agent databot

# 固定会话（跨重启续聊）
python main.py -s alice

# 调试模式（显示工具调用）
python main.py -v
```

在 `You>` 提示符下输入问题，输入 `quit` 退出。

## Agent 一览

| Agent | 说明 |
|-------|------|
| `intent` | 意图识别 + 自动路由到专家（**默认**） |
| `databot` | 数据检索：术语表 → 元数据/血缘 → SQL → 结果 |
| `knowledge` | 团队知识：代码、文档、Jira、DataHub |
| `diagnostic` | 生产诊断：K8s、S3、Airflow 等 |
| `data_analysis` | 探索性数据分析（SQL、Python、图表） |
| `swe` | 软件工程：编辑文件、Shell、脚本 |
| `plan` | 任务分解，编排多个专家 Agent |

## 示例问题

- 列出某个 Hive 库下的表
- 查一张表的 schema
- 用 Trino 跑 SQL 并总结结果
- 某个指标在术语表里怎么定义的？

## 项目结构

```
agent/
├── registry.py          # Agent 注册表、意图路由
├── agent.py, turn.py, chain.py, session.py, router.py, …  # 核心基础设施
├── react.py, refine_profile.py  # ReAct 框架（BaseReactAgent）
├── runtime/             # 团队共享：prompt、chat_completion、TahoeRuntimeHelper
├── specialists/         # 专家 agent（knowledge、swe、data_analysis、diagnostic、databot）
├── plan/                # Plan agent（编排 specialist）
└── intent/              # 意图编排入口（默认 CLI agent）
```

## 更多文档

- [路线图（中文）](docs/ROADMAP.md) · [Roadmap (English)](docs/ROADMAP.en.md)
- [优化记录](docs/CHAT_OPTIMIZATION.md)
- [RAG 数据导入](rag/README.md)
- [前端](frontend/README.md)

## 技术栈

Python 3.11+ · LangGraph · LangChain · Hive HMS · Trino · MCP · Qdrant
