from tahoepilot.tools.code.bash import TOOLS as bash_tools, bash
from tahoepilot.tools.code.python_execute import TOOLS as python_tools, python_execute
from tahoepilot.tools.code.str_replace_editor import TOOLS as editor_tools, str_replace_editor

TOOLS = [*bash_tools, *python_tools, *editor_tools]

__all__ = [
    "TOOLS",
    "bash",
    "python_execute",
    "str_replace_editor",
]
