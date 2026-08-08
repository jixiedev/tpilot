from __future__ import annotations

from pathlib import Path

from agent.databot.prompt import (
    DATA_RETRIEVAL_SYSTEM_PROMPT,
    NEXT_STEP_PROMPT as DATABOT_NEXT_STEP_PROMPT,
    SYSTEM_PROMPT as DATABOT_SYSTEM_PROMPT,
    DatabotSystemPrompt,
    DataRetrievalSystemPrompt,
)
from agent.tahoe.prompt import (
    NEXT_STEP_PROMPT,
    SYSTEM_PROMPT as TAHOE_SYSTEM_PROMPT,
    TahoeSystemPrompt,
)
from agent.prompt import SystemPromptAssembler
from memory.profile import UserProfile


def test_base_assembler_has_core_sections() -> None:
    text = SystemPromptAssembler().build()
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
    text = SystemPromptAssembler(user_profile=profile).build()
    assert "User profile:" in text
    assert "User id: alice" in text
    assert "Role: growth analyst" in text
    assert "Allowed tables: hive.ads.gmv_d" in text
    assert "Forbidden columns: phone" in text
    assert "Favorite metrics: gmv, pay_uv" in text
    assert text.find("User profile:") < text.find("General rules:")


def test_build_user_profile_override() -> None:
    base = TahoeSystemPrompt(user_profile=UserProfile(user_id="old"))
    text = base.build(user_profile=UserProfile(user_id="new"))
    assert "User id: new" in text
    assert "User id: old" not in text


def test_tahoe_base_has_no_data_domain_sections() -> None:
    text = TahoeSystemPrompt().build()
    assert text == TAHOE_SYSTEM_PROMPT
    assert "TahoePilot" in text
    assert "chat_completion" in text
    assert "Output:" in text
    assert "Session message layout:" in text
    assert "Data prohibitions:" not in text
    assert "Data required practices:" not in text
    assert "Data retrieval practices:" not in text
    assert "entity_type = GLOSSARY_TERM" not in text
    assert "Glossary-first" not in NEXT_STEP_PROMPT
    assert "LLM>" in NEXT_STEP_PROMPT


def test_databot_owns_data_and_retrieval_sections() -> None:
    text = DatabotSystemPrompt().build()
    assert text == DATABOT_SYSTEM_PROMPT
    assert text == DATA_RETRIEVAL_SYSTEM_PROMPT
    assert DataRetrievalSystemPrompt is DatabotSystemPrompt
    assert "Data prohibitions:" in text
    assert "Data required practices:" in text
    assert "Data answer requirements:" in text
    assert "Data retrieval practices:" in text
    assert "candidate tables" in text
    assert "Databot" in text
    assert "glossary terms" in text
    assert "entity_type = GLOSSARY_TERM" in text
    assert len(text) > len(TAHOE_SYSTEM_PROMPT)
    assert "Retrieval pipeline" in DATABOT_NEXT_STEP_PROMPT
    assert "Glossary-first" in DATABOT_NEXT_STEP_PROMPT


def test_subclass_can_append_extra_section() -> None:
    class CustomRetrieval(DatabotSystemPrompt):
        def extra_notes(self) -> list[str]:
            return ["Always prefer partition pruning."]

        def extension_blocks(self) -> list[tuple[str, str]]:
            return [
                *super().extension_blocks(),
                ("Custom notes", self._bullets(self.extra_notes())),
            ]

    text = CustomRetrieval().build()
    assert "Custom notes:" in text
    assert "partition pruning" in text
    assert "Data retrieval practices:" in text
    assert text.rfind("Session message layout:") > text.rfind("Custom notes:")


def test_render_databot_system_prompt_uses_profile_store(tmp_path: Path) -> None:
    from agent.databot.databot_agent import DatabotAgent
    from memory.profile_store import FileProfileStore

    store = FileProfileStore(tmp_path)
    store.save("bob", UserProfile(user_id="bob", role="analyst", timezone="UTC"))
    agent = DatabotAgent(profile_store=store, tools=[])

    text = agent.render_system_prompt({"user_id": "bob"})
    assert "User id: bob" in text
    assert "Role: analyst" in text
    assert "Data retrieval practices:" in text
    assert "Databot" in text


def test_render_tahoe_system_prompt_uses_profile_store(tmp_path: Path) -> None:
    from agent.tahoe.tahoe_agent import TahoeAgent
    from memory.profile_store import FileProfileStore

    store = FileProfileStore(tmp_path)
    store.save("bob", UserProfile(user_id="bob", role="SRE", timezone="UTC"))
    agent = TahoeAgent(profile_store=store, tools=[])

    text = agent.render_system_prompt({"user_id": "bob"})
    assert "User id: bob" in text
    assert "Role: SRE" in text
    assert "Timezone: UTC" in text
    assert "Data prohibitions:" not in text
    assert "Output:" in text
