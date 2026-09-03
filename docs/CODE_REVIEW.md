# TahoePilot 代码评审与重构方案

> 2026-09-03 · 全量代码评审
> 范围：Python 主体（`agent/`、`graph/`、`state/`、`tools/`、`memory/`、`agui_server.py`、`cli.py`、`models/`、`config/`）
> 评估人：Mavis
> 评估方式：静态阅读 + 路径回溯（未运行项目）

---

## 总体判断

TahoePilot 的骨架做得很扎实：
- 分层清晰（agent → graph → state → tools）
- 错误恢复链路完整（`tools/errors.py` 异常注册 + `graph/error_recovery.py` 的 transient retry / RetryPolicy）
- 状态机式分阶段（Databot v2：fetch → cards gate → SQL gate → execute）
- 记忆压缩分四层（offload → prior-turn Q&A fold → write-tool input evict → LLM summarize）
- 可插拔的 registry + MCP 动态绑定

代码上**有 8 种 agent / 5 个工具分类 / 4 套配置**，看着是"几乎完整的产品"，不是 PoC。

但代码层面有几处明显的味道：模块单文件过大、跨模块样板重复、为绕开上游/版本问题打的补丁（`typing.TypedDict` shim、AG-UI 的 `_DummyCompiledGraph`、`refine_user_profile` 节点里的 fake `AIMessage`）。下面按重要性排序展开。

---

## 优先级 0 — 必须尽快处理

### 0.1 `BaseAgent` 的 `system_prompt` 参数有二义性

**位置**：`agent/agent.py:28-34`

```python
def __init__(
    self,
    system_prompt: str | SystemPromptSpec | None = None,
    *args: Any, **kwargs: Any,
) -> None:
    self.system_prompt: str | SystemPromptSpec = (
        system_prompt if system_prompt is not None else self.render_system_prompt
    )
```

`BaseAgent.__init__` 同时支持静态字符串和可调用 `Callable[[SessionAgentState], str]`，但下游多处拿到的"可能是字符串、可能是函数"，处理路径分叉：
- `agent/agent.py:32-34` 直接 `self.system_prompt = ...`，没有规范化
- `BaseReactAgent` 在 init 末尾再赋一次 `self.system_prompt = system_prompt if system_prompt is not None else self.render_system_prompt`
- `graph/builder.py:35-38` `_resolve_system_prompt` 用 isinstance 可调用检查，行为分散

**建议**：
- 把 `system_prompt` 入参只接受 `str`
- 把"callable"语义并入 `render_system_prompt(state)` 这个钩子（已经是基类方法）
- 让 `_resolve_system_prompt` 只剩"格式化"逻辑
- `TahoeAgent.render_system_prompt` 已经是 callable 模式，自然兼容

---

### 0.2 DatabotAgent / PlanAgent / IntentOrchestrator 三个"包装 TahoeAgent"的样板基本一样

**位置**：
- `agent/react/databot/databot_agent.py:77-87`
- `agent/react/plan/plan_agent.py:69-87`
- `agent/intent/orchestrator.py:339-401`

三处都是同样的"内部持有一个 `self._tahoe`，对外透传 `print_turn_output` / `render_system_prompt` / `register_secondary`"模式：

```python
self._tahoe = TahoeAgent(
    profile_store=profile_store,
    tools=tools,
    run_context=...,
    router_config=...,
    react_listener=...,
    system_prompt=...,
    prompt_assembler=...,
)
self.system_prompt = self._tahoe.system_prompt
self.session = self._tahoe.session
```

`ui.py`（27 行）干脆就是 `get_agent("xxx") → create_agent → MemorySaver → bind → return _graph` 的三连复制。

**建议**：
1. 抽一个 `ComposedTahoeAgent[TahoeAgentT]` 混入，把"转交 `_tahoe.*`"那段集中。`DatabotAgent` / `PlanAgent` 改 `class DatabotAgent(BaseAgent, ComposedTahoeAgent)` 即可。
2. `ui.py` 改成单函数 `def _make_ui_agent(agent_name: str):` 生成三个绑定即可。

---

### 0.3 `refine_profile.py` 里的 `fake_ai_message` hack

**位置**：`agent/react/refine_profile.py:110-114`

```python
# todo jiapeng we populate last completion tool's reply into state, as the last AI message
# todo add a specific node to handle this
fake_ai_message = AIMessage(content=reply)
logger.info("inject last completion tools' reply into state")
return {"messages": [fake_ai_message]}
```

`chat_completion` 是 ToolMessage，但 `extract_turn_output` 优先读这个 AIMessage 而不是 ToolMessage。这是在掩盖一个真实的实现问题：完成工具的产出和最终用户可见的"AIMessage"被错误地等同起来。

**建议**：
- 单独拆一个 `inject_completion_as_ai_node`
- 在 `RouterConfig` 加一个 `inject_completion_outlet`（类似 `refine_user_profile_outlet`）
- 让基类不依赖 fake message
- `extract_turn_output` 已经是按"当前 turn 的 chat_completion ToolMessage 优先"写的，这一段 fake message 完全可以删

---

### 0.4 `agui_server.py` 里的 `_DummyCompiledGraph` / `typing.TypedDict` shim / `asyncio.Lock` 互斥

**位置**：
- `agui_server.py:52-56`（typing shim）
- `agui_server.py:139-165`（lazy build + lock）
- `agui_server.py:172-180`（DummyCompiledGraph）
- `agent/react/databot/state.py:28-32`（同一个 shim 又来一遍）

三处补丁都是为了绕版本/事件循环/AG-UI SDK 的限制：
- `_DummyCompiledGraph.nodes = {}` 占位 + `_ensure_built()` 异步替换
- `typing.TypedDict = typing_extensions.TypedDict` 启动期 monkey-patch
- 异步锁 + 双重检查 + 后台替换图

`state.py` 注释里写得很坦白：

> "pydantic 2.13 raises PydanticUserError...state snapshot fall back to an empty key set...which means Command(update={"review_cards": ...}) updates are silently dropped"

**建议**：
1. 抽一个 `tahoepilot/_compat.py`，把 shim 集中放并加日志（"applied typing.TypedDict shim"），让所有 import 路径都从同一处出发。
2. `agui_server` 的 `_DummyCompiledGraph` 应该用 `functools.partial` 或者干脆把 `LangGraphAgent` 的构造延后到 lifespan 里——没必要在 module 顶层就构造。
3. `_ensure_built` 在 lifespan 已经被 await，请求路径再 await 是冗余的——退化成"断言已 build"。

---

## 优先级 1 — 设计层

### 1.1 注册样板：把"哪些 agent 该拿到压缩工具"硬编码成 8 个装饰器堆叠

**位置**：
- `memory/tools.py:26-32`（`read_offloaded_file` 7 个装饰器）
- `memory/tools.py:42-48`（`compact_context` 7 个装饰器）
- `tools/code/bash.py:207-210`
- `tools/code/python_execute.py:62-66`
- `tools/code/str_replace_editor.py:281-284`
- `tools/data/trino.py:70-86`（trino_run_query 等多个工具）
- `tools/data/hive.py:26-44`
- `tools/k8s.py:562-563`
- `tools/plan.py:228-232`
- `tools/web/search.py:260-263`

```python
@bind_tool_to_agent("tahoe,react")
@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("knowledge,default")
@bind_tool_to_agent("diagnostic,default")
@bind_tool_to_agent("data_analysis,default")
@bind_tool_to_agent("swe,default")
@bind_tool_to_agent("plan,default")
@tool
def read_offloaded_file(path: str) -> str: ...
```

**问题**：
- 加新 agent 时要回每个工具文件加一行，容易漏
- "哪些 agent 共享工具集"是隐式分布在 10+ 个文件里的

**建议**：在 `AgentSpec` 上加 `tool_kits: tuple[str, ...]` 字段（如 `("compression", "shell", "search")`），让 `register_dynamic_tool_bindings` 或者一个独立的 `bind_tool_kits(agent_spec, tools, kits)` 一次性把 kit 绑到 agent 的 `default` / `fetch` / `sql` / `execute` 等 identifier。装饰器保留但只绑定到 kit 自己。

示意：
```python
# agent/registry.py
@dataclass(frozen=True)
class AgentSpec:
    ...
    tool_kits: tuple[str, ...] = ()

# tools/kits.py
def bind_compression_kit(agent_spec: AgentSpec) -> None: ...
def bind_shell_kit(agent_spec: AgentSpec) -> None: ...
```

---

### 1.2 `tools/external/datahub.py` 单文件 1522 行

这一个文件里同时有：
- 5 个 GraphQL 查询字符串（`_LINEAGE_NEIGHBOR_GQL` / `_LIST_QUERIES_GQL` 等）
- HTTP 客户端实现
- 类型定义（`DatasetSummary` 等 TypedDict）
- 11 个 `@tool` 包装函数（`datahub_*`）
- 错误分类与 fallback 逻辑

**建议拆分**：
```
tools/external/datahub/
├── __init__.py            # 暴露 TOOLS = [...]
├── client.py              # HTTP / GQL transport + token 解析
├── queries.py             # GraphQL 字符串 + 解析器
├── types.py               # TypedDict / dataclass
├── errors.py              # classify_datahub_exception
├── lineage.py             # get_lineage / get_lineage_paths_between
├── listers.py             # list_datasets / list_data_jobs / list_data_flows / list_glossary
└── tools.py               # 11 个 @tool 包装函数
```

`tools/rag/semantic.py`（482 行）也有同样问题——`TableCard` 类层级、查询 helper、LLM-friendly 投影、`fetch_related_models` 工具全在一个文件。拆成 `rag/table_card.py` / `rag/embeddings.py` / `rag/fetch.py` / `rag/types.py`。

---

### 1.3 状态/常量碎片

每个 agent 子目录都有自己的 `_constants.py` / `state.py`：

- `agent/react/databot/_constants.py`（46 行）— 节点名、stage 名字
- `agent/react/databot/state.py`（168 行）— `DatabotState`、`GateAuditEntry`、`fresh_turn_state_defaults`
- `agent/react/databot/gate_defaults.py`（44 行）— 默认 gate reason
- `agent/react/databot/ui_actions.py`（175 行）— state patch 逻辑
- `agent/react/plan/_constants.py`（19 行）— 节点名、stage
- `agent/react/plan/state.py`（31 行）— `PlanState`、`fresh_turn_state_defaults`

`ui_actions` 里的 `apply_*` 函数本质是"对 DatabotState 做局部 state patch 的纯函数"，而 `gate_defaults.merge_gate_reasons` 也是 state 纯函数。这类纯函数 + 状态定义在六个文件间反复横跳。

**建议**：
- `state/databot.py` 集中 DatabotState + constants + ui_actions + gate_defaults
- `state/plan.py` 集中 PlanState + constants
- `state/__init__.py` 暴露 `SessionAgentState` / `IntentionState` / `DatabotState` / `PlanState` 四个 schema

---

### 1.4 跨 agent 的 session_id 模板散落

**位置**：
- `agent/registry.py:329`：`return f"{session}:{agent_name}"`
- `agent/chain.py:142`：`return f"{session}:chain:{agent_id}"`
- `agent/chain.py:340`：`return f"{session}:plan:{run}:step:{agent_id}"`

这种模板很容易改一个忘改另一个。

**建议**：`agent/session.py`（已经在用，但只管 SessionTurnBuilder）加一个 `specialist_session_id(parent, agent_name, *, kind="specialist" | "chain" | "plan")` 集中处理。

---

## 优先级 2 — 可靠性 / 性能

### 2.1 `tools/dynamic.py` 的 `_DYNAMIC_REGISTERED` 全局 flag 永远为真

**位置**：`tools/dynamic.py:14-64`

```python
async def register_dynamic_tool_bindings() -> None:
    global _DYNAMIC_REGISTERED
    if _DYNAMIC_REGISTERED:
        return
    ...
    _DYNAMIC_REGISTERED = True
```

**问题**：
- 副作用：测试里 `reset_dynamic_tool_bindings()` 会清掉这个 flag 并 `restore_register_tools_snapshot()`
- 但生产代码里每个 agent 的 `create()` 都 await 它——一旦配置变了（比如用户改了 `mcp.json`），不会重新加载

**建议**：
- 把"哪些 MCP server 已被加载"做成 `frozenset` 而不是 bool
- 新配置对比哈希，重启式 reload 而不是 flag-and-stick
- 或者明确"`create()` 时一次性，进程内不再变"，并在文档里写清楚

---

### 2.2 `tools/data/trino.py` 和 `tools/data/hive.py` 各自的 `_thread_local` 连接缓存

**位置**：
- `tools/data/trino.py:17-35`
- `tools/data/hive.py:11-23`

两个文件用同一份 `_thread_local = local()` + `getattr(_thread_local, "conn"/"client", None)` 模式独立缓存。

**问题**：
- `conftest.py` 已经写了 `_reset_tool_thread_locals` autouse fixture 重置，但只覆盖 hive + trino
- `tools/k8s.py` 的 `_api_bundle()` 用 `lru_cache(maxsize=1)`，单进程共享但不会被测试 reset
- `tools/rag/semantic.py` 的 Qdrant client 也是 `lru_cache`
- `tools/code/bash.py` 的 `_sessions` 是 `dict` + `threading.Lock`，fixture 没碰

**建议**：
- 建一个 `tools/_runtime.py` 集中所有模块级缓存句柄
- 提供 `reset_all_module_caches()` 给 conftest 用
- fixture 从 `tools._runtime` import，不要硬编码具体模块名

---

### 2.3 CLI 与 Web 端用不同的 checkpointer

**位置**：
- `cli.py:87` — `AsyncSqliteSaver`（持久化）
- `ui.py:11, 15, 18` — `MemorySaver`（进程内）
- `agui_server.py:123` — `AsyncSqliteSaver`

**问题**：同一个用户在 CLI 聊了一半切到 Web，Web 看不到历史；反过来一样。这是产品层的体验问题，不是技术限制。

**建议**：
- 要么统一用 SQLite（最简单）
- 要么 Web 端从 CLI 的 `checkpoints.sqlite` 读
- `ui.py` 里的 `MemorySaver` 没有存在的理由——换成"复用 langgraph dev 提供的 checkpointer"

---

### 2.4 模型默认值的双轨

**位置**：`models/models.py:147-160`

```python
default_model: BaseChatModel | None = None   # 全局变量
def get_default_model() -> BaseChatModel:     # 函数
    global default_model
    if default_model is None:
        default_model = _resolve_default_model()
    return default_model
```

注释里说"callers that previously did `default_model.invoke(...)` should now do `get_default_model().invoke(...)`"——但代码里两处都用 `get_default_model()`：
- `agui_server.py:126` ✓
- `cli.py:94` ✓
- `ui.py:12, 18, 25` ✓

那 `default_model` 这个全局其实没用了。删掉即可——它存在只会让读者误以为可以"模块加载时立即拿 model"。

---

### 2.5 `langgraph dev` 启动期一次性加载 + agui_server 长寿命连接 + 端点冷启动 lazy build

**位置**：`agui_server.py:118-165`

`_build_graph` + `_ensure_built` + `_agent_lock` 这套"首次请求构建、之后缓存"的逻辑写了 ~50 行注释解释为什么这么做。

**问题**：
- 注释里说"first HTTP request doesn't pay the MCP / RAG / Trino tool-loading cost"
- 但 lifespan 已经在启动时 await 了 `_ensure_built()`（第 199 行）—— 注释和实现不一致
- `_DummyCompiledGraph` 占位 + 后续 `_agent.graph = graph` 直接修改模块全局是个明显的代码味道

**建议**：
1. lifespan 已经 await 了一遍，请求路径再 await 就是冗余——把 `_ensure_built` 退化成"断言已 build"，把 dummy 删掉
2. 如果担心构建时间过长，把"build"和"绑定"分开——构建可以 sync（除了 aiosqlite.connect），绑定可以 defer

---

## 优先级 3 — 依赖 / 打包

`pyproject.toml` 的依赖里塞了太多只服务于"某个工具 / 某个 ingest CLI"的东西：

| 包 | 谁用 | 建议 |
|---|---|---|
| `kubernetes~=10.0.0` | `tools/k8s.py` | 移到 `optional-dependencies.k8s` |
| `torch>=2.2.0,<2.12` + `sentence-transformers` | `rag/embeddings.py` | 移到 `optional-dependencies.rag` |
| `boto3`, `pypdf`, `python-docx`, `openpyxl` | `rag/*_ingest.py` | 同上 |
| `qdrant-client` | `rag/store.py` | 同上 |
| `copilotkit` + `ag-ui-langgraph` | `agui_server.py`, `ui.py` | 移到 `optional-dependencies.web` |
| `pathlib>=1.0.1` | stdlib 3.4+ 就有 | 删 |

加完 optional 之后 `pip install tahoepilot[web,k8s,rag]` 让用户按需取。`docker/qdrant/bin/` 里 50MB 的 Qdrant 容器不打包到 PyPI wheel 里——已经做对了，但要文档里写清楚"Qdrant 是 dev-only"。

---

## 优先级 4 — 测试与文档

### 4.1 缺多 agent chain 端到端测试

`tests/test_agent_chain.py` 测了 `PlannedAgentChain.execute` 的逻辑（mock LLM），但没有"intent → 多个 specialist → 终态" 的集成测试。`test_intent_orchestrator.py` 只测了 orchestrator 单跑。

**建议**：加一个 `tests/test_chain_e2e.py`，用 fake model + MemorySaver 跑完一次"Intent → Databot → Knowledge → Summary"链路，验证 `route_targets` / `execution_plan` / `step_results` 的传递。

### 4.2 没有 release 流程

`README.md` 提到"Not specified" License（pyproject 也没 license 字段），没有 `CHANGELOG`，没有 `CONTRIBUTING.md`，没有 commit / PR 模板。`docs/` 里有 4 个 markdown 散落但入口不清晰。

**建议**：
- `CHANGELOG.md`：记 v0.1.0（已是当前）、v0.2 计划改的依赖
- `docs/README.md`：4 个 md 的索引
- `CONTRIBUTING.md`：dev 安装（`uv sync --all-extras`）、`pre-commit`、测试命令、AG-UI 本地联调

### 4.3 `docs/ROADMAP.md` 里的 Feature 矩阵是最真实的产品规划

它的状态（已完成 / 进行中 / 未开始）已经够细，可以直接当 source of truth。

**建议**：把它升级为 `ROADMAP_STATUS.json`，让 CI 可以断言（"v0.2 release 不应该含未实现 F7 标完成"）。

---

## 重构路线（建议顺序）

**1. 先做"无损"重构**（不影响行为）：
- 抽 `_compat.py` + 删除 `default_model` 全局 + `ui.py` 去重
- `tools/rag/semantic.py` 和 `tools/external/datahub.py` 按 1.2 拆分
- `state/databot.py` 集中碎片

**2. 再做"边界"重构**（小幅行为变化）：
- 引入 `tool_kits`，逐步替换装饰器堆叠
- `ComposedTahoeAgent` mixin
- 删 `fake_ai_message` + 独立 `inject_completion_node`

**3. 最后做"产品"重构**：
- CLI/Web 共享 checkpointer
- `register_dynamic_tool_bindings` 增量重载
- optional dependencies 拆分
- e2e 测试补全

每一步的 commit 应该是独立可 review 的，不建议一次性大重构——项目正在做 M6（部署）和 F15（RAG 完善），底层模块被频繁动，PR 越大合冲突越大。

---

## "看起来丑但是合理" 的代码（先别动）

最后想 mark 几处**先别动**的：

- `agent/router.py:57-97` `CompletionToolRouter.completion_executed` 里的"为什么是 reverse-walk 而不是正向 scan"长注释——bug 注释值得保留
- `graph/messages.py` 的 `sanitize_messages_for_strict_tool_providers`——修 GLM/MiniMax 2013 错误的工程性补丁
- `tools/code/bash.py` 的 `_BashSession`——从 Janus 来的代码，状态机逻辑不要乱改
- `tools/mcp/mcp.py:36-75` 的 stdio stderr 重定向——`langgraph dev` 加载期阻塞的 hack，没注释根本看不懂原因

这几处要改必须先写新测试覆盖现有行为再动。

---

## 提议的第一个 PR（"最小可合"）

下面三个改动加在一起大约 100 行 diff 净改动，但能立即让 onboarding 的人少踩 5 个坑：

1. **抽 `_compat.py`**：把 `agui_server.py` 和 `agent/react/databot/state.py` 的 typing shim 集中，加一次日志
2. **删 `default_model` 全局**：`models/models.py` 改成只剩 `get_default_model()`，调用点不变
3. **`ui.py` 去重**：三连复制函数收成一个 `make_ui_agent(agent_name)` 工厂

如果上面 3 个看着合理，可以从这开始。
