from groq import AsyncGroq
from app.config import settings
from app.llm.provider import LLMProvider

class GroqProvider(LLMProvider):
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.groq_api_key)
        self.model = settings.groq_model

    async def generate(self, prompt: str, system: str = "", temperature: float = 0.3) -> str:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=1024,
        )
        return response.choices[0].message.content.strip()

# Singleton
groq_provider = GroqProvider()