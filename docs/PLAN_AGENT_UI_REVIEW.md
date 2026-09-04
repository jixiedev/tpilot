# Plan Agent Web UI — Architecture & Code Review

梳理 plan agent 在浏览器、CopilotKit、AG-UI、langgraph dev、LangGraph 之间的端到端交互,
并对当前前端可用性 / 代码质量 / 可扩展性问题做一次集中 review。

**日期** 2026-09-07 · **范围** `/plan` 页面 + `agent/plan/*` 后端 + `agui_server.py` 接入层
**对应 commit** working tree (2026-09-07)
**关联文档** [`FRONTEND_AGENTS_UI.md`](FRONTEND_AGENTS_UI.md)(架构与事件流参考)

---

## 目录

1. [端到端交互链路](#1-端到端交互链路)
2. [主要 UI Bug(为什么"几乎不可用")](#2-主要-ui-bug为什么几乎不可用)
3. [代码质量 / 可扩展性问题](#3-代码质量--可扩展性问题)
4. [建议的修复优先级](#4-建议的修复优先级)
5. [一句话总结](#5-一句话总结)

---

## 1. 端到端交互链路

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Browser  (Next.js 客户端,React 19)                                            │
│                                                                              │
│  /plan 路由                                                                   │
│   └─ <PlanPage>                                                               │
│        ├─ <CopilotChatConfigurationProvider agentId="plan">                  │
│        │     └─ <CopilotChat messageView={PlanMessageView} …>                 │
│        │            └─ <PlanMessageView>                                      │
│        │                 ├─ <DatabotAssistantMessage>  ← 跨页复用(databot)   │
│        │                 └─ <PlanGateChatBanner>                              │
│        ├─ <PlanToolRenderers>                                                 │
│        │     useRenderTool({ name: "create_plan" / "planning" /              │
│        │                      "invoke_agent" })                              │
│        ├─ <PlanTaskTree>            ← 右侧工作面板                           │
│        ├─ <PlanInterruptDialog>     ← useInterrupt({ renderInChat:false })   │
│        └─ <AgentDebugPanel>         ← debug 开关                              │
│                                                                              │
│  所有 hooks 都基于 <Providers> 里硬编码的:                                    │
│     <CopilotKit runtimeUrl="/api/copilotkit" agent="databot"                  │
│                 useSingleEndpoint={false}>                                    │
│                                                                              │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │  HTTP/SSE
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  Next.js  Route Handlers  (frontend/app/api)                                  │
│                                                                              │
│  /api/copilotkit/[...path]/route.ts  ← CopilotKit Runtime v2                  │
│     new CopilotRuntime({                                                     │
│       agents: {                                                               │
│         databot: new HttpAgent({ url: "...:8000/agui/databot" }),             │
│         plan:    new HttpAgent({ url: "...:8000/agui/plan" }),                │
│       },                                                                      │
│       runner: new InMemoryAgentRunner(),                                     │
│     })                                                                        │
│     createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit" })     │
│                                                                              │
│  /api/databot/actions/route.ts  ← REST 旁路,只 databot 用                      │
│     proxy → http://localhost:8000/agui/actions                                 │
│                                                                              │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │  HTTP/SSE
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  langgraph dev  (单个进程)                                                     │
│  langgraph.json  →  http.app = ./agui_server.py:app                            │
│                                                                              │
│  agui_server.py  (FastAPI, lifespan + 启动时编译图)                            │
│   ├─ AGUI_AGENTS = { "databot": …, "plan": … }                                │
│   ├─ _agents[name] = LangGraphAgent(                                           │
│   │       name, graph=_DummyCompiledGraph(),                                  │
│   │       description,                                                        │
│   │       emit_interrupt_outcome=True,        ← v2 必需                       │
│   │       enable_legacy_on_interrupt_event=False,                              │
│   │   )                                                                       │
│   ├─ _compiled_graphs[name] ← 懒加载,首次请求时构建,写回 _agents[name].graph  │
│   ├─ _checkpoint_conns ← 进程级 aiosqlite 长连接,每个 agent 一份              │
│   │                                                                             │
│   ├─ POST /agui/databot  ┐                                                    │
│   │   POST /agui/plan    ┤  _make_agui_handler(name)                            │
│   │                      │   ├─ request_agent = _agents[name].clone()          │
│   │                      │   ├─ async for event in request_agent.run(input):  │
│   │                      │   │     yield EventEncoder.encode(event)            │
│   │                      │   └─ 兜底:无 terminal 事件时发 RUN_ERROR            │
│   │                      │                                                    │
│   ├─ POST /agui/actions   ← databot 直写 checkpoint                            │
│   │   graph.aget_state / aupdate_state / aget_state                           │
│   │                                                                             │
│   └─ graph = build_*_graph  (CompiledStateGraph)                              │
│                                                                              │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  LangGraph 状态机                                                              │
│                                                                              │
│  Plan 图 (PlanState extends SessionAgentState, agent/plan/graph.py):           │
│                                                                              │
│    START                                                                      │
│      └─ inject_system_prompt  (make_plan_entry_node)                          │
│           └─ create_plan  subgraph  (build_create_plan_subgraph)              │
│                │   唯一允许工具: create_plan                                   │
│                │   state_exit_keys=("plan_id",)                                │
│                ▼                                                              │
│         _route_after_create ──── plan_id 空 → summary → END                  │
│                │ plan_id 存在                                                  │
│                ▼                                                              │
│          increment_subagent_round  (subagent_rounds += 1)                     │
│                └─ sub_agent_round  subgraph                                    │
│                     工具: planning + invoke_agent(→specialist)                 │
│                ▼                                                              │
│          prep_adjust (stage="adjust")                                         │
│                └─ adjust_plan  subgraph                                        │
│                     工具: planning  (mark_step / update)                       │
│                ▼                                                              │
│         _route_after_adjust ── adjust_had_tool_calls & 轮数 < 8 →             │
│                                 increment_subagent_round                      │
│                              否则 → summary → END                              │
│                                                                              │
│    关键事实:                                                                   │
│    • PlanState 写回 state 的字段由 create_plan / planning / invoke_agent       │
│      通过 LangChain Command(update=…) 写入;                                   │
│    • 图表只暴露 PLAN_STATE_KEYS(plan_id, stage, user_question,                  │
│      subagent_rounds, step_results, plan_snapshot) 给 AG-UI;                  │
│    • 嵌套 specialist 由 stage_tools.SpecialistRunner.run 走                     │
│      agent/plan/nested_hitl.run_specialist_bubbling_interrupts                 │
│        - 拿 child thread id  = specialist_session_id(parent, name)            │
│        - parent 取自 state.get("session_name")                                │
│        - child 子图用同一个 SQLite checkpointer(共享 db)                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

事件流向(展开 [`FRONTEND_AGENTS_UI.md`](FRONTEND_AGENTS_UI.md) Fig.14):

```
LangGraph 中断/事件
   → ag_ui_langgraph.LangGraphAgent 转换
   → agui_server.EventEncoder 编码成 SSE
   → Next.js /api/copilotkit 不解码直接转发
   → @ag-ui/client HttpAgent 解析
   → AbstractAgent 实例化/原地更新 messages, state, pendingInterrupts
   → React 通过:
        CopilotChat (v2 头 chat 面板)
        useAgent({ agentId }) 读 agent.state / messages
        useInterrupt({ agentId, renderInChat:false }) 读 RUN_FINISHED.outcome.interrupts
        useRenderTool(name)  匹配 TOOL_CALL_* 渲染
   → 用户决策 → useInterrupt.resolve(payload) / 表单 submit
   → @ag-ui/client.runAgent({ resume })
   → 同样 SSE 回到 agui_server
   → LangGraphAgent.run(resume) → Command(resume=…) → 子图继续
```

---

## 2. 主要 UI Bug(为什么"几乎不可用")

按严重度排序。这些是从代码读出来的"几乎确定有问题",建议跑通以下三个场景验证:

* 计划运行到一半刷新页面 → 看 task tree 状态 / interrupt dialog 是否能恢复
* 两个浏览器 tab 同时跑 plan agent → 看是否串数据
* plan 执行中点 STOP → 看 banner / dialog / state 是否错乱

### 🔴 Bug-1:Plan nested specialist 的 checkpoint thread 是全局共享的(致命)

**位置:** `agent/plan/stage_tools.py:218`、`agent/plan/plan_agent.py:86-102`、`agent/plan/nested_hitl.py:41-133`、`agent/plan/stage_tools.py:124-149`

`invoke_agent` 工具读 `state.get("session_name")` 当 parent,然后调 `specialist_session_id(parent, name)`,默认产出 `{parent}:{name}`。

**问题:** 在 CLI 路径下,`SessionTurnBuilder.prepare_turn_input` 会把 `session_name` 写进 state。但 AG-UI 路径(`agui_server.py:_make_agui_handler → request_agent.run(input_data)`)里,**不会经过 `PlanAgent.prepare_turn_input`**。`ag_ui_langgraph` 启动时只用 `input_data.messages`,state 里的 `session_name` 一直是 `""`。

结果:

* 任何用户、任何 AG-UI thread id,经过 plan agent 的嵌套 specialist checkpoint thread 都会变成 `:databot` / `:swe` / `:knowledge` …
* **两个用户串数据**;**刷新页面后 nested interrupt 解不出来**,因为 child graph 不知道新 thread id 是哪个
* 还会被 `_applied_by_session`(process-local dict)坑到,跨请求的状态串扰

**修法路径(任选一种,推荐 ①):**

1. 在 `agui_server.py:_make_agui_handler` 里把 `thread_id` 注入 state,例如首次请求前 `aupdate_state` 把 `session_name=input_data.thread_id` 写进去
2. 让 `SpecialistRunner` 直接接 `agent_name` + `parent_session: str = ""` 显式参数,改从 `LangGraphAgent.config["configurable"]["thread_id"]` 取
3. PlanAgent 暴露一个 `attach_thread(plan_agent, thread_id)` 钩子,AG-UI 入口在 `clone()` 之后调用

### 🔴 Bug-2:`pendingInterrupts` 的来源不一致(导致 banner / dialog 行为分叉)

**位置:** `PlanGateChatBanner.tsx:18-23`、`PlanInterruptDialog.tsx:96-104`、`usePlanStopDismissal.ts:9-19`

CopilotKit v2 把 interrupt 走 `RUN_FINISHED.outcome.interrupts`(标准通道),由 `useInterrupt` 消费;而 `agent.pendingInterrupts` 这个字段在 v2 里是另外维护的缓存。banner 直接读 `pendingInterrupts`,dialog 走 `useInterrupt`,**两条数据通路**。

实际症状:

* banner 出现时,`isRunning=false` 才显示 — 但在 `RUN_FINISHED` 与 `pendingInterrupts` 字段被清之间有竞态,经常"banner 闪一下就没了"
* 嵌套 HITL replay 的 `plan-nested-hitl-replay` 既要被 dialog 跳过(`isPlanReplayInterrupt`)又要被 banner 跳过,目前 banner 没看 id,只看 `parseGateInterruptMessage(message)?.gate`,所以 "replay" 阶段 banner 也可能误显示

**修法:** banner 改用 `useInterrupt` 的 `interrupts` 数组(同一个数据源),删掉 `pendingInterrupts` 的副本;`usePlanStopDismissal` 的 `pendingInterrupts = []` 那一段也得改成 abort 后调一次 `useInterrupt` 的 cancel 或清理函数。

### 🔴 Bug-3:`usePlanStopDismissal` 直接 monkey-patch `AbstractAgent.abortRun`

**位置:** `usePlanStopDismissal.ts:9-19`

```ts
const original = agent.abortRun.bind(agent);
agent.abortRun = () => {
  agent.pendingInterrupts = [];   // 直接赋值
  abortListeners.get(agent)?.forEach((notify) => notify());
  original();
};
```

问题:

* `pendingInterrupts` 在 v2 是 `readonly` 字段(看 `frontend/node_modules/@ag-ui/client/dist/index.d.ts:493`),TS 不抱怨只是因为组件 cast 成 unknown
* WeakSet 保证了同一个 agent 只 patch 一次,但只要两个不同 Plan session 用了同一份 agent 引用,后挂的 listener 会同时收到所有 session 的 abort 通知
* `onRunFailed: () => { agent.pendingInterrupts = []; ... }` — 失败时同样置空,但 `setState` 不会触发 React 重渲染,UI 端的状态可能仍然是上一帧的"有 gate"

**修法:** 改用一个 React state 跟踪最近一次 abort/fail,在 `useInterrupt` 的 `render` 里读取并 return `<></>`,而不是改 agent 字段。

### 🔴 Bug-4:`enabled: () => !stopDismissed` 误用 useInterrupt 谓词

**位置:** `PlanInterruptDialog.tsx:100-107`

`useInterrupt` 的 `enabled` 是 `(event) => boolean`,**用来过滤哪些 interrupt 触发 render**;Plan 这里给的是 `() => !stopDismissed`,完全无视 `event`,且每次 render 都返回新的箭头函数 → useEffect 依赖不稳,加上 `usePlanStopDismissal` 里的 `setDismissed` 一变,`useInterrupt` 内部可能重新订阅/重连 SSE。

实际症状:点 stop 后,如果你刚好处在"未决定 gate"的中间状态,SSE 重新订阅会让 dialog 闪一下或漏掉 resume。

**修法:** 改成 `enabled: (event) => !stopDismissedRef.current`,配合一个 ref;或者更彻底,把 stop 状态当作 `useInterrupt` 的 `render` 内部 early-return,不用 enabled 字段。

### 🔴 Bug-5:`PlanTaskTree.stepResultFor` 用启发式把 result 配到 step

**位置:** `PlanTaskTree.tsx:66-86`

```ts
const ownerResults = results.filter((r) => r.agent === owner);
const earlier = results.slice(0, results.indexOf(ownerResults[0]))
                   .filter(r => r.agent === owner).length;
return ownerResults[earlier] ?? ownerResults[ownerResults.length - 1];
```

注释自己写了 "v1 heuristic; once the agent emits explicit step ↔ result linkage we can switch"。问题:

* 同一 owner 多次 invoke_agent 但有失败重试时,配错 step
* 当 `mark_step` 跳过或 `update` 改顺序时,`earlier` 计数会漂
* `[]` 上 `indexOf(undefined)` 是 `-1`,不崩但行为是"最后一个 result"

**修法:** `invoke_agent` 工具的 Command.update 里把 `step_index` 一并存到 `step_results[i]`,PlanState 加一个 `step_links: dict[int, int]` 字段。

### 🔴 Bug-6:`langgraph.json` 没有 plan

**位置:** `langgraph.json:3-7`

```json
"graphs": {
  "databot": "./ui.py:databot_ui_agent",
  "knowledge": "./ui.py:knowledge_ui_agent",
  "intent": "./ui.py:intent_ui_agent"
}
```

`plan` 不在 langgraph dev 的 graph registry,但 `agui_server.py:AGUI_AGENTS` 里有它,且 `ui.py` 也没有 `plan_ui_agent` 工厂。这只是说"目前用 `http.app` 走私 plan,不会触发 LangGraph Dev 的 graph 列表和 Studio 集成",短期不影响功能,但加新 agent 时容易踩坑(已经在 agui_server 注册了但忘了这里)。

### 🔴 Bug-7:Plan 工具在 databot 工具注册表里也注册了 + 进程内 plan 字典

**位置:** `tools/plan.py:286-289`、`tools/plan.py:133`

```python
@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("knowledge,default")
@bind_tool_to_agent("data_analysis,default")
@bind_tool_to_agent("swe,default")
@tool(description=DESCRIPTION)
def planning(...)

# 同一个文件里:
_plans: dict[str, Plan] = {}   # 进程级 dict,没有持久化
```

`planning` 工具被注册到了几乎所有 specialist 的 default scope,且 `_plans` 是**进程级 dict**。后果:

* 一个用户在 databot 里创建了 plan,另一个用户的 databot 会看到 plan list 里这一项
* `langgraph dev` 重启 → 全部 plan 状态丢失,但 `state.plan_snapshot` 还在 checkpoint 里,再次 `invoke_agent` 就会 `run_planning("get", plan_id=...)` 报 "No plan"
* `agent/plan/stage_tools.py:80` 的 `_plan_snapshot` 错误信息会渗透到 summary 节点

**修法:** 给 plan 加 SQLite 持久化,或者把 plan_id 改成"agent thread scoped"(跟 Bug-1 一起)。

### 🔴 Bug-8:`Providers` 硬编码 `agent="databot"`

**位置:** `frontend/app/providers.tsx:7`

```tsx
<CopilotKit runtimeUrl="/api/copilotkit" agent="databot" useSingleEndpoint={false}>
```

虽然 plan 页面用 `CopilotChatConfigurationProvider agentId="plan"` 覆盖了 chat 的 agentId,但 `<CopilotKit>` 上的 `agent="databot"` 还是全局默认值。任何"在 chat 之外的代码"(比如未来加的 useAgent 缺 agentId)会默认走 databot。

**修法:** 把 `agent` 改为不传,或者在多 agent 模式下用一个明确的 default mapping。

### 🟡 Bug-9:plan 页面的 New chat 在 `!isReady` 时只重挂载不清状态

**位置:** `PlanNewChatButton.tsx:21-28`、`planClientReset.ts:17-29`

`busy = isReady && agent.isRunning`,若 `!isReady` 则 `busy=false`,按钮可点。点完:

* `config?.startNewThread()` 跑
* `if (isReady) resetPlanAgentView(agent)` — 没 ready 时跳过
* `resetSessionUi()` — bump sessionKey,触发子树 remount

新挂载的 `<PlanTaskTree>` 调 `useAgent({ agentId: "plan" })`,新 agent 的 state 是 backend 真实状态(可能上一轮的 plan_snapshot 还在)。但因为 resetSessionUi 在前,某些 ref 还在旧 agent 上,可能拿到混合态。

**修法:** `disabled={!isReady || busy}`,或者在 `!isReady` 时不响应。

### 🟡 Bug-10:step→result 永远不更新"完成"状态

`PlanTaskTree` 只在 `snapshot.steps[].status` 里看 `mark_step` 是否真的把状态设成 `completed`。但 Plan 的 LLM 经常忘记调 `mark_step`,UI 永远显示 ○ in-progress/pending。结合 Bug-5,user 看到一个"全部 pending, 实际全做完"的诡异界面。

**修法:** 在 `invoke_agent` 成功返回时,自动在 Command.update 里加 `planning` mark_step(把当前 step 标 completed + 下一步 in_progress),省掉 LLM 这一步。

---

## 3. 代码质量 / 可扩展性问题

按"改起来成本低 / 影响面大"排序。

### A. 跨页耦合严重

* `PlanMessageView` 用 `DatabotAssistantMessage`,`PlanTaskTree` 用 `GateDecision.HumanGate/ChartGate`,Plan 页用 `databot-debug-toggle` 的 CSS class
* `useAgentRefresh` 是 databot 写的,plan 直接复用 — 这本身还好,但 `usePlanStopDismissal` 又复写了 `AbstractAgent` 实例,任何 `useAgent({ agentId: "plan" })` 都会触发这个 patcher

**修法:** 把通用基础设施(过滤、refresh、stop-dismissal)拆到 `app/agent-ui/` 目录;agent-specific 组件各自归位。

### B. agentId 在 4 个地方硬编码同步

* `frontend/app/api/copilotkit/[...path]/route.ts:33-53`(HttpAgent 列表)
* `agui_server.py:91-94`(AGUI_AGENTS 字典)
* `langgraph.json:3-7`(graphs)
* `agent/registry.py:148-156`(AGENTS 字典,只管 CLI)

加新 agent 必须改 4 处,容易漏。文档 `FRONTEND_AGENTS_UI.md:573-595` 已经画了 checklist,说明这事已经发生过多次。

**修法:** 在 `agent/registry.py` 上挂 metadata `web_enabled: bool` + `web_description`,`agui_server.py` 和 `route.ts` 都从 `registry.AGENTS.items()` 生成,只剩 `langgraph.json` 保留(因为它是 langgraph dev 自己的 schema)。

### C. Plan state contract 写两份但不强制对齐

* Python: `agent/plan/ui_state.py:PLAN_STATE_KEYS`
* TS: `frontend/app/components/planTypes.ts:PlanAgentState`
* 两者都靠 reviewer 肉眼看对齐。`PLAN_STATE_KEYS` 目前甚至没在 `agui_server` 里 filter state(只 log 一下,见 `agui_server.py:349-360`),真要 enforce 还得加 JSON schema 或 mypy/pyright runtime assertion

**修法:** 用 pydantic 生成 OpenAPI → openapi-typescript-codegen → 跑出 `planTypes.ts`,或者用 ts-to-py / py-to-ts 的双向工具。

### D. `PlanToolRenderers` 注册是 page-level 副作用

每次 mount/unmount 会重新注册/反注册 tool render。`useDefaultRenderTool` + `useRenderTool` 的注册是 **全局副作用**,如果你在 databot 页切到 plan 页、plan 页又 back 到 databot,理论上会 leak 旧的 registration(取决于 v2 hook 内部 cleanup 行为)。即使不 leak,这也违反了"hook 必须在稳定组件里"的原则。

**修法:** 把 `useRenderTool` 调用提到一个全局挂载的 `<CopilotToolRegistry />` 组件,所有 agent 的 renderers 在那里集中注册,顶层 layout mount 一次。

### E. CSS hard-coded owner 配色

`plan.css:412-416`:

```css
.plan-step-owner--databot { … }
.plan-step-owner--knowledge { … }
.plan-step-owner--swe { … }
.plan-step-owner--diagnostic { … }
.plan-step-owner--data_analysis { … }
```

加新 specialist 必须同时改 TS (`planTypes.ts:PlanStepResult` 没强约束,实际是 free text)、改 CSS、可能还要改 `DELEGATABLE_AGENTS` 提示词。

**修法:** 用 CSS 自定义属性 `--owner-${name}: <color>`,运行时根据 `step.text.match(/^\[(.*?)\]/)[1]` 设置 `style={{ "--owner-color": OWNER_COLORS[name] }}`,colormap 用 d3-scale-chromatic 或一张小表。

### F. PlanSessionContext / DatabotSessionContext / resetSessionUi 模式

两个独立的 Context 几乎是 copy-paste,只在 reset 时调不同的 client reset 函数。可以合并成一个 `<SessionUiProvider reset={(agent) => resetXxxAgentView(agent)}>`。

### G. `agui_server.py:525` 死代码

```python
add_langgraph_fastapi_endpoint_unused_marker = None
```

这是早期实现的残留,删掉。

### H. `stage_tools.py` 每次都 cast `runtime.state` 强类型

```python
full_state = runtime.state if runtime is not None else {}
session = str(full_state.get("session_name") or "").strip()
```

没有类型保护,且 `state.get("session_name")` 永远拿不到值(见 Bug-1)。

### I. `useAgent({ agentId: "plan" })` 的 `isReady` 不可靠

`agent.isReady` 在第一次 SSE 之前都是 false。`useAgentRefresh` 在 `!isReady` 时直接 return(没有 subscribe),所以 `useEffect` 的 cleanup 不跑。等到 isReady 变成 true,`agent` 引用可能是新的,旧的 ref 不 unsub 就 leak。在页面快速 New chat 多次时(每次都 resetSessionUi → remount → 重新 useAgent),会有一堆 dangling subscriber。

**修法:** 改用 `useSyncExternalStore` 包装 `agent.subscribe`,React 18+ 能正确处理 unmount。

### J. 测试空缺

`frontend/tests/` 是空目录,plan 页面没单测。Plan 后端有 `tests/` 但覆盖 `stage_tools` / `nested_hitl` 的不多。`PlanInterruptDialog` / `PlanTaskTree` 的 step-result 启发式特别需要 snapshot 测试。

### K. 缺 Loading / Error 状态

* `PlanTaskTree` 在 `!snapshot` 时只显示空状态,但 isReady=false 期间也是同一个 — 用户分不清"还没建 plan"和"agent 还没连上"
* `PlanInterruptDialog` 在 SSE 断流(STOP 后)的"重连尝试中"没有指示

### L. Plan 的 Command 链没 type safety

```python
return Command(update={
    "plan_id": key,
    "stage": STAGE_EXECUTE,
    "plan_snapshot": snapshot_for(key),
    "messages": [_ok_tool_message(tool_call_id, text)],
})
```

5 个键,其中 `messages` 是 `ToolMessage`,`plan_snapshot` 是 dict,`stage` 是 str — TS 端 `PlanAgentState` 完全对不上(TS 那边的 `plan_snapshot` 是 nullable 的,Python 这里不传就是 None)。两边靠心电感应同步。

### M. `PlanNewChatButton` 的 disabled 态没视觉反馈

`title` 属性写了提示,但 `disabled` 时按钮颜色没明显变灰(`plan.css:107-128` 那个 `opacity: 0.45` 仅在 :disabled 时生效)— 跟 databot 的 `DatabotNewChatButton` 行为完全一致,但 databot 的还在工作,plan 的因为 Bug-9 时常"看起来能点但点了没反应"。

### N. `planClientReset` 的 PRESERVED key 列表不健壮

```ts
const PRESERVED_AGENT_STATE_KEYS = ["tools", "copilotkit"] as const;
```

依赖 AG-UI client 内部用的字段名,客户端升级可能改名。databot 那份也是同样的硬编码,迟早出 bug。

**修法:** 从 `agent` 实例上枚举所有可枚举 state key,删掉自己注入的 keys,而不是正向保留两份。

### O. Plan 摘要节点 `summary` 的兜底质量差

`agent/plan/graph.py:85-116`:

```python
if not text and payload["step_results"]:
    last = payload["step_results"][-1]
    text = str(last.get("output") or "").strip()
if not text:
    text = "Plan turn finished but no summary was produced."
```

没有 step_result 时直接给占位,user 看到的就是"Plan turn finished but no summary was produced",且这条消息会进 checkpoint,污染下一轮。

**修法:** summary 失败要 raise 出来让 graph 走 error recovery,而不是塞占位文本进 `messages`。

### P. `agui_server.py` 没有请求体大小 / 限流

`POST /agui/plan` 接收 `RunAgentInput`,前端不限制 message 长度,后端没有 max body size 配置,一个长 prompt 就能让 SSE stream 跑很久。生产部署要注意。

### Q. `enable_legacy_on_interrupt_event=False` 的影响范围

关掉 legacy `on_interrupt` 之后,任何还在用 `useLangGraphInterrupt` 旧 API 的代码会失效。前端只用了 v2 的 `useInterrupt`,但 databot 那边如果有任何组件靠 `on_interrupt` 事件拿到 interrupt,会断。

**验证:** grep `on_interrupt` / `LangGraphInterrupt` 整个前端,确认全清。

### R. `useAgentRefresh` + `usePlanStopDismissal` 双订阅

两个 hook 都 `agent.subscribe(...)`,每个 event 都会 bump 两次 render(虽然 React 会 batch),对于长 run 是个性能负担。

**修法:** 合并成一个 `useAgentReactivity` hook,内部用 single subscription fan-out。

### S. CSS 命名风格不统一

* databot 页面用 BEM: `databot-card-list`, `databot-card-list-title`
* plan 页面用 flat: `plan-step`, `plan-step-detail`, `plan-step-detail-label`
* 同一份 `globals.css` 的 tokens 命名是 `--db-*` (因为先有 databot)

加新 agent 时,token 命名要么继续 `--db-*`(难看),要么新开一套 `--plan-*`,但 globals 里又全用 db 的。**这是个 cross-agent design system 问题**,不是 plan 单独的。

### T. type/state 同步靠"心电感应"的具体清单

* `agent/plan/state.py:PlanState`
* `agent/plan/ui_state.py:PLAN_STATE_KEYS`
* `frontend/app/components/planTypes.ts:PlanAgentState`
* `frontend/app/api/copilotkit/...` 隐式地要求 `tools/plan.py` 的 `get_plan_dict` 返回的 shape 对齐
* `PlanTaskTree.tsx` 又假设 `snapshot.steps[].text` 里含 `[agent_name]` 前缀,这个约定没有任何 backend 类型检查

任何一处 schema 漂移都是运行时 bug。`PlanStepResult` 的 `agent` / `task` / `output` 字段 vs `stage_tools.invoke_agent` 实际写入的 dict 也是手写对齐。

---

## 4. 建议的修复优先级

给接下来三周的工作排个序,按"解决体感"权重排。

| 周次 | 工作 | 解 Bug |
|------|------|--------|
| W1 | **Bug-1 修复**(plan thread scoping) + **Bug-2**(banner/dialog 统一) + **Bug-4**(useInterrupt 谓词) | 解决 80% "几乎不可用" 的体感 |
| W1 | **Bug-3**(取消 stopDismissal 的 monkey patch) + **Bug-7**(plan 持久化) | 解决刷新/重启后丢失状态 |
| W2 | **A+B 拆分**(agent 通用组件 vs 特定组件) + **D**(`<CopilotToolRegistry />`) + **B**(4 处 agentId 同步) | 大幅提高可扩展性 |
| W2 | **E**(CSS owner 配色参数化) + **F**(SessionContext 合并) + **N**(PRESERVED 健壮) | UI 收尾 |
| W3+ | **C**(plan state contract 自动生成) + **J**(snapshot 测试) + **I**(useSyncExternalStore) | 防回归 |
| W3+ | **Bug-5 / Bug-10**(step↔result 显式 linkage) | 体验补完 |

---

## 5. 一句话总结

**后端:** Plan agent 的"按 agent 名解嵌套 HITL + 进程内 plan 字典"是核心不稳因素(Bug-1 + Bug-7),所有"刷新后失效/多人串数据"的体感基本都来自这两个。

**前端:** Plan 页面是"databot 页面改了三处 + 借了几个组件"拼出来的,缺独立的 design system、缺独立的状态同步层、缺 `useSyncExternalStore` 的现代订阅;`usePlanStopDismissal` 这种 monkey-patch 加上 `useInterrupt` 的 predicate 误用,会触发 SSE 重连相关的边缘问题。

最便宜的修复:把 Bug-1 修了之后,99% 的"为什么刷新一下 step 结果就丢了 / 为什么我决定完 gate 之后 plan 不动了"会消失。建议先动手这块。
