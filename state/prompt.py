from langgraph.graph import MessagesState


class PromptLayout:
    @staticmethod
    def assemble(history_state: MessagesState, raw_system_prompt) -> MessagesState:
        pass