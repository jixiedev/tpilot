from __future__ import annotations

from pathlib import Path

from agent.prompt import SystemPromptAssembler
from config.agent_config import (
    AgentConfig,
    DatabotAgentConfig,
    LeadAgentConfig,
    ReactAgentConfig,
    agent_config_path,
)
from memory.config import DEFAULT_WRITE_TOOLS, CompressionConfig


def _config(name: str) -> AgentConfig:
    return AgentConfig(agent_config_path(name))


def _prompt(name: str):
    spec = _config(name).system_prompt
    assert spec is not None
    return spec


def _assembler(name: str) -> SystemPromptAssembler:
    return SystemPromptAssembler(_config(name))


def test_base_layout_has_core_sections() -> None:
    spec = _prompt("base")
    assert spec.layout == ("role", "general_rules", "session_layout")
    text = _assembler("base").build()
    assert "Role:" in text
    assert "General rules:" in text
    assert "Session message layout:" in text
    assert "Output:" not in text
    assert "User profile:" not in text


def test_tahoe_layout_includes_output_extension() -> None:
    spec = _prompt("tahoe")
    assert spec.layout == ("role", "business_context", "general_rules", "output", "session_layout")
    text = _assembler("tahoe").build()
    assert "Output:" in text
    assert text.find("General rules:") < text.find("Output:")
    assert text.find("Output:") < text.find("Session message layout:")


def test_databot_layout_lists_extension_sections() -> None:
    spec = _prompt("databot")
    assert spec.layout == (
        "role",
        "business_context",
        "general_rules",
        "chat_style",
        "data_prohibitions",
        "data_required_practices",
        "data_answer_requirements",
        "data_retrieval_practices",
        "output",
        "session_layout",
    )
    text = _assembler("databot").build()
    assert "Data prohibitions:" in text
    assert "Data retrieval practices:" in text
    assert "Write TO the user in plain language" in text
    assert "1. Tables used" in text


def test_child_spec_appends_general_rules() -> None:
    base_text = _prompt("base").section("general_rules").text
    swe_text = _prompt("swe").section("general_rules").text
    assert len(swe_text) > len(base_text)
    text = _assembler("swe").build()
    assert "str_replace_editor" in text


def test_agent_file_holds_identity_and_system_prompt() -> None:
    cfg = _config("databot")
    assert cfg.name == "databot"
    # Databot is a front agent (own page); the lead delegates data work to warehouse.
    assert cfg.front and cfg.delegate_when == ""
    assert _config("warehouse").delegate_when.startswith("data retrieval")
    assert not _config("warehouse").front
    assert cfg.accepted_mcp["default"] == ("*",)
    assert cfg.system_prompt is not None
    assert cfg.system_prompt.layout[0] == "role"

    lead = _config("lead")
    assert lead.front
    assert lead.description.startswith("Front agent")
    assert lead.system_prompt is not None
    assert lead.delegate_when == ""


def test_agent_run_context_merges_extends() -> None:
    databot = DatabotAgentConfig(agent_config_path("databot"))
    assert databot.run_context.get("max_tool_calls") == 10
    assert isinstance(databot.run_context.get("react"), dict)
    assert "fetch" in databot.run_context["react"]
    lead = LeadAgentConfig(agent_config_path("lead"))
    assert lead.run_context.get("max_tool_calls") == 12
    assert lead.run_context.get("max_delegations") == 6
    assert lead.run_context.get("next_step", "").strip()


def test_compression_inherits_base_and_keeps_code_paths() -> None:
    base = _config("base").compression
    defaults = CompressionConfig()
    assert base.enabled is True
    assert base.context_window == defaults.context_window
    assert base.tool_result_offload_threshold == defaults.tool_result_offload_threshold
    assert base.tool_input_offload_threshold == defaults.tool_input_offload_threshold
    assert base.fill_trigger == defaults.fill_trigger
    assert base.recent_messages_keep == defaults.recent_messages_keep
    assert base.preview_lines == defaults.preview_lines
    assert base.prior_turns_qa_only is True
    assert base.write_tools == DEFAULT_WRITE_TOOLS
    assert base.never_offload_tools == frozenset()
    assert base.offload_dir == defaults.offload_dir
    assert base.turn_boundary_marker == defaults.turn_boundary_marker
    assert _config("knowledge").compression == base
    from dataclasses import replace

    # The lead keeps specialist results in full (never offloads `delegate`).
    assert _config("lead").compression == replace(base, never_offload_tools=frozenset({"delegate"}))


def test_compression_extends_overrides_named_fields(tmp_path: Path) -> None:
    (tmp_path / "base.toml").write_text(
        """
name = "base"
[compression]
enabled = true
context_window = 1000
fill_trigger = 0.5
write_tools = ["write_file"]
offload_dir = "/tmp/ignored"
""",
        encoding="utf-8",
    )
    child = tmp_path / "child.toml"
    child.write_text(
        """
name = "child"
[compression]
extends = "base"
enabled = false
never_offload_tools = ["keep_me"]
""",
        encoding="utf-8",
    )
    compression = AgentConfig(child).compression
    assert compression.enabled is False
    assert compression.context_window == 1000
    assert compression.fill_trigger == 0.5
    assert compression.write_tools == frozenset({"write_file"})
    assert compression.never_offload_tools == frozenset({"keep_me"})
    assert compression.offload_dir == CompressionConfig().offload_dir


def test_registered_agents_use_typed_config() -> None:
    from agent.catalog import AgentCatalog

    assert isinstance(AgentCatalog.config("databot"), DatabotAgentConfig)
    assert isinstance(AgentCatalog.config("knowledge"), ReactAgentConfig)
    assert isinstance(AgentCatalog.config("lead"), LeadAgentConfig)
