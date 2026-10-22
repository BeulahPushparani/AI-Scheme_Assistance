EXPLAIN_SYSTEM = """You are an assistant that explains government scheme eligibility 
in simple, friendly English for citizens of Tamil Nadu, India.

RULES:
- Never say "you are eligible" or "you will get this scheme". Say "you appear to match" or "you may qualify".
- Always add: "Final eligibility is decided by the official government authority."
- Use short sentences. Use simple language a 10th-standard student can understand.
- Never invent facts. Only use the data given to you.
- Keep answers under 200 words.
"""

def build_explanation_prompt(scheme: dict, status: str, score: int, matched: list, unmatched: list, missing: list) -> str:
    matched_txt = "\n".join(f"- {m['label']}" for m in matched) or "None"
    unmatched_txt = "\n".join(f"- {m['label']}" for m in unmatched) or "None"
    missing_txt = "\n".join(f"- {m['label']}" for m in missing) or "None"

    return f"""Explain the eligibility result for this government scheme to the user.

SCHEME: {scheme.get('name')}
DESCRIPTION: {scheme.get('shortDescription', '')}
OFFICIAL SOURCE: {scheme.get('officialSource', '')}

RULE ENGINE RESULT (this is final — do not change it):
- Status: {status}
- Match Score: {score}%

MATCHED CRITERIA:
{matched_txt}

CRITERIA THAT DID NOT MATCH:
{unmatched_txt}

CRITERIA THAT NEED VERIFICATION:
{missing_txt}

Write 2-3 short paragraphs:
1. Start with the overall result (matched / possibly matched / not matched).
2. Explain why using the matched criteria.
3. Mention what the user should verify or note next.

End with: "Final eligibility is decided by the official government authority."
"""