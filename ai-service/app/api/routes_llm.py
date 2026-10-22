from fastapi import APIRouter, Depends, HTTPException
from app.core.security import verify_internal_key
from app.llm.groq_provider import groq_provider
from app.llm.prompts import EXPLAIN_SYSTEM, build_explanation_prompt
from app.schemas.llm_schema import ExplainRequest, ExplainResponse
from app.config import settings
import traceback

router = APIRouter()

@router.post("/explain-eligibility", response_model=ExplainResponse)
async def explain_eligibility(
    payload: ExplainRequest,
    _: bool = Depends(verify_internal_key),
):
    try:
        print(f"\n=== AI Request for {payload.scheme.schemeId} ===")
        print(f"Status: {payload.status}, Score: {payload.score}")
        print(f"Model: {settings.groq_model}")
        print(f"API Key starts with: {settings.groq_api_key[:10]}...")

        prompt = build_explanation_prompt(
            scheme=payload.scheme.model_dump(),
            status=payload.status,
            score=payload.score,
            matched=[m.model_dump() for m in payload.matched],
            unmatched=[m.model_dump() for m in payload.unmatched],
            missing=[m.model_dump() for m in payload.missing],
        )

        explanation = await groq_provider.generate(
            prompt=prompt,
            system=EXPLAIN_SYSTEM,
            temperature=0.3,
        )

        print(f"✅ Generated explanation ({len(explanation)} chars)\n")

        return ExplainResponse(explanation=explanation, model=settings.groq_model)

    except Exception as e:
        print(f"\n❌ LLM ERROR: {type(e).__name__}: {str(e)}")
        traceback.print_exc()
        print()
        raise HTTPException(status_code=500, detail=f"LLM error: {type(e).__name__}: {str(e)}")