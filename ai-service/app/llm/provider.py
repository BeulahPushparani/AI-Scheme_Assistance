from abc import ABC, abstractmethod

class LLMProvider(ABC):
    """Abstract base so we can swap Groq for OpenAI/Anthropic later."""

    @abstractmethod
    async def generate(self, prompt: str, system: str = "", temperature: float = 0.3) -> str:
        ...