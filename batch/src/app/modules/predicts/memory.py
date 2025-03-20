from typing import List
from langchain_core.chat_history import BaseChatMessageHistory, BaseMessage
from langchain_core.messages import HumanMessage, AIMessage

class SaveSwitchableChatMessageHistory(BaseChatMessageHistory):
    messages: List[BaseMessage] = []
    _is_save_memory: bool = False
 
    def save_memory_mode(self):
        self._is_save_memory = True

    def disable_save_memory_mode(self):
        self._is_save_memory = False
    
    async def aget_messages(self) -> List[BaseMessage]:
        return self.messages
    
    def add_message(self, message: BaseMessage):
        if self._is_save_memory:
            self.messages.append(message)
    
    async def aadd_messages(self, messages: List[BaseMessage]):
        self.add_messages(messages)
    
    def clear(self) -> None:
        self.messages = []
        super().clear()

    async def aclear(self) -> None:
        self.clear()