from typing import List, Dict
from app.rag import vectorstore
from app.llm.groq_provider import groq_provider
from app.config import settings

RAG_SYSTEM = """You are an assistant that answers questions about Tamil Nadu and Indian government schemes.

STRICT RULES:
- Answer ONLY using the provided CONTEXT.
- If the context does not contain the answer, reply: "I don't have verified information about this. Please check the official government portal."
- Never invent facts, numbers, deadlines, or eligibility rules.
- Always cite which scheme the information comes from.
- Keep answers short and easy to read (under 150 words).
- Use simple English that a 10th-standard student can understand.
"""

def build_rag_prompt(question: str, chunks: List[Dict]) -> str:
    context_blocks = []
    for i, c in enumerate(chunks, 1):
        meta = c["metadata"]
        context_blocks.append(
            f"[Source {i}: {meta.get('schemeName', 'Unknown')} — {meta.get('section', '')}]\n{c['text']}"
        )
    context = "\n\n---\n\n".join(context_blocks)
    return f"""CONTEXT:
{context}

USER QUESTION: {question}

Answer the question using only the CONTEXT above. Mention the scheme names. Keep it short.
"""

async def answer_question(question: str, top_k: int = 4, scheme_filter: str = None) -> Dict:
    # 1. Retrieve relevant chunks
    chunks = vectorstore.query(question, top_k=top_k, scheme_filter=scheme_filter)

    if not chunks:
        return {
            "answer": "I don't have any indexed schemes yet. Please contact the admin to run the RAG ingestion.",
            "sources": [],
        }

    # 2. Build prompt and ask LLM
    prompt = build_rag_prompt(question, chunks)
    answer = await groq_provider.generate(
        prompt=prompt,
        system=RAG_SYSTEM,
        temperature=0.2,
    )

    # 3. Build sources list
    sources = []
    seen = set()
    for c in chunks:
        meta = c["metadata"]
        key = (meta.get("schemeId"), meta.get("section"))
        if key in seen:
            continue
        seen.add(key)
        sources.append({
            "schemeId": meta.get("schemeId", ""),
            "schemeName": meta.get("schemeName", ""),
            "section": meta.get("section", ""),
            "text": c["text"][:400],
            "distance": c.get("distance"),
            "officialSource": meta.get("officialSource", ""),
        })

    return {"answer": answer, "sources": sources}