class Observer:
    def on_llm_request(self, llm_request, **kwargs):
        pass

    def on_llm_respond(self, llm_response, **kwargs):
        pass

    def on_tool_invode(self, tool_name, tool_params, *args, **kwargs):
        pass

    def on_tool_completion(self, tool_name, tool_result, *args, **kwargs):
        pass