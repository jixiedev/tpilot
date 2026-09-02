"""Plan agent graph node and stage identifiers."""

from __future__ import annotations

STAGE_CREATE = "create"
STAGE_EXECUTE = "execute"
STAGE_ADJUST = "adjust"
STAGE_DONE = "done"

VALID_STAGES = frozenset({STAGE_CREATE, STAGE_EXECUTE, STAGE_ADJUST, STAGE_DONE})

NODE_INJECT_SYSTEM_PROMPT = "inject_system_prompt"
NODE_CREATE_PLAN = "create_plan"
NODE_SUB_AGENT_ROUND = "sub_agent_round"
NODE_ADJUST_PLAN = "adjust_plan"
NODE_SUMMARY = "summary"

DEFAULT_MAX_SUBAGENT_ROUNDS = 8
DEFAULT_STAGE_MAX_TOOL_CALLS = 6
