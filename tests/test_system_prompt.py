from __future__ import annotations

from pathlib import Path

from agent.specialists.databot.databot_agent import DatabotSystemPrompt
from agent.runtime import (
    NEXT_STEP_PROMPT,
    SYSTEM_PROMPT as TAHOE_SYSTEM_PROMPT,
    TahoeSystemPrompt,
)
from agent.prompt import SystemPromptAssembler
from config.agent_config import AgentConfig, DatabotAgentConfig, agent_config_path
from memory.profile import UserProfile


def _assembler(name: str) -> SystemPromptAssembler:
    return SystemPromptAssembler(AgentConfig(agent_config_path(name)))


def test_base_assembler_has_core_sections() -> None:
    text = _assembler("base").build()
    assert "Role:" in text
    assert "General rules:" in text
    assert "Session message layout:" in text
    assert "Data prohibitions:" not in text
    assert "User profile:" not in text


def test_assembler_includes_user_profile_section() -> None:
    profile = UserProfile(
        user_id="alice",
        role="growth analyst",
        department="growth",
        region="CN",
        allowed_tables=["hive.ads.gmv_d"],
        forbidden_columns=["phone"],
        language="zh-CN",
        timezone="Asia/Shanghai",
        default_time_granularity="day",
        preferred_currency="CNY",
        favorite_metrics=["gmv", "pay_uv"],
        favorite_dimensions=["channel"],
    )
    text = _assembler("base").build(profile)
    assert "User profile:" in text
    assert "User id: alice" in text
    assert "Role: growth analyst" in text
    assert "Allowed tables: hive.ads.gmv_d" in text
    assert "Forbidden columns: phone" in text
    assert "Favorite metrics: gmv, pay_uv" in text
    assert text.find("User profile:") < text.find("General rules:")


def test_build_user_profile_is_per_request() -> None:
    assembler = TahoeSystemPrompt()
    text = assembler.build(UserProfile(user_id="new"))
    assert "User id: new" in text
    assert "User profile:" in text
    assert assembler.build().find("User id:") == -1


def test_tahoe_base_has_no_data_domain_sections() -> None:
    text = TahoeSystemPrompt().build()
    assert text == TAHOE_SYSTEM_PROMPT
    assert "TahoePilot" in text
    assert "Output:" in text
    assert "web_search" in text
    assert "str_replace_editor" in text
    assert "Session message layout:" in text
    assert "Data prohibitions:" not in text
    assert "Data required practices:" not in text
    assert "Data retrieval practices:" not in text
    assert "entity_type = GLOSSARY_TERM" not in text
    assert "Glossary-first" not in NEXT_STEP_PROMPT
    assert "LLM>" in NEXT_STEP_PROMPT


def test_databot_owns_data_and_retrieval_sections() -> None:
    assembler = DatabotSystemPrompt()
    text = assembler.build()
    assert text == assembler.build()
    assert "Data prohibitions:" in text
    assert "Data required practices:" in text
    assert "Data answer requirements:" in text
    assert "Data retrieval practices:" in text
    assert "candidate tables" in text
    assert "Databot" in text
    assert "glossary terms" in text
    assert "entity_type = GLOSSARY_TERM" in text
    assert len(text) > len(TAHOE_SYSTEM_PROMPT)
    fetch_next = (DatabotAgentConfig(agent_config_path("databot")).run_context.get("react") or {})["fetch"]["next_step"]
    assert "commit_cards" in fetch_next
    assert "history_cards" in fetch_next


def _prompt(name: str):
    spec = AgentConfig(agent_config_path(name)).system_prompt
    assert spec is not None
    return spec


def test_databot_layout_lists_extension_sections() -> None:
    spec = _prompt("databot")
    assert spec.layout == (
        "role",
        "general_rules",
        "chat_style",
        "data_prohibitions",
        "data_required_practices",
        "data_answer_requirements",
        "data_retrieval_practices",
        "output",
        "session_layout",
    )
    assembled = _assembler("databot").config.system_prompt
    assert assembled is not None
    assert assembled.layout == spec.layout


def test_databot_chat_style_forbids_tool_narration() -> None:
    section = _prompt("databot").section("chat_style")
    assert "trino_explain" in section.text
    assert "I've validated the SQL" in section.text


def test_render_databot_system_prompt_uses_profile_store(tmp_path: Path) -> None:
    from memory.profile_store import FileProfileStore

    store = FileProfileStore(tmp_path)
    store.save("bob", UserProfile(user_id="bob", role="analyst", timezone="UTC"))
    profile = store.load("bob")
    text = DatabotSystemPrompt().build(profile)
    assert "User id: bob" in text
    assert "Role: analyst" in text
    assert "Data retrieval practices:" in text
    assert "Databot" in text


def test_render_tahoe_system_prompt_uses_profile_store(tmp_path: Path) -> None:
    from memory.profile_store import FileProfileStore

    store = FileProfileStore(tmp_path)
    store.save("bob", UserProfile(user_id="bob", role="SRE", timezone="UTC"))
    profile = store.load("bob")
    text = TahoeSystemPrompt().build(profile)
    assert "User id: bob" in text
    assert "Role: SRE" in text
    assert "Timezone: UTC" in text
    assert "Data prohibitions:" not in text
    assert "Output:" in text
