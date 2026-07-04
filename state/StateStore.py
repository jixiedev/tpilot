from langgraph.graph import MessagesState


class StateStore:
    def __init__(self, max_sessions=200):
        self.session_states = {}
        self.max_sessions = max_sessions

    def retrieval_state(self, session: str) -> MessagesState:
