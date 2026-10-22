from typing import List, Dict

def _short(text: str, limit: int = 120) -> str:
    t = (text or "").strip().replace("\n", " ")
    return t[:limit] + ("..." if len(t) > limit else "")

def chunk_scheme(scheme: dict) -> List[Dict]:
    """
    Convert a scheme document into multiple chunks, each focused on one section.
    Returns list of { id, text, metadata }.
    """
    sid = scheme.get("schemeId", "UNKNOWN")
    name = scheme.get("name", "")
    source = scheme.get("officialSource", "") or scheme.get("officialLink", "")
    category = scheme.get("category", "")

    base_meta = {
        "schemeId": sid,
        "schemeName": name,
        "category": category,
        "officialSource": source,
    }

    chunks = []

    # Chunk 1 — Overview
    overview_parts = [f"Scheme: {name}"]
    if scheme.get("shortDescription"):
        overview_parts.append(scheme["shortDescription"])
    if scheme.get("description"):
        overview_parts.append(scheme["description"])
    chunks.append({
        "id": f"{sid}::overview",
        "text": "\n".join(overview_parts),
        "metadata": {**base_meta, "section": "overview"},
    })

    # Chunk 2 — Benefits
    if scheme.get("benefits"):
        text = f"Benefits of {name}:\n" + "\n".join(f"- {b}" for b in scheme["benefits"])
        chunks.append({
            "id": f"{sid}::benefits",
            "text": text,
            "metadata": {**base_meta, "section": "benefits"},
        })

    # Chunk 3 — Eligibility
    elig_parts = [f"Eligibility for {name}:"]
    if scheme.get("eligibilityText"):
        elig_parts.append(scheme["eligibilityText"])
    if scheme.get("targetBeneficiaries"):
        elig_parts.append("Target beneficiaries: " + ", ".join(scheme["targetBeneficiaries"]))
    chunks.append({
        "id": f"{sid}::eligibility",
        "text": "\n".join(elig_parts),
        "metadata": {**base_meta, "section": "eligibility"},
    })

    # Chunk 4 — Required Documents
    if scheme.get("requiredDocuments"):
        text = f"Documents required for {name}:\n" + "\n".join(f"- {d}" for d in scheme["requiredDocuments"])
        chunks.append({
            "id": f"{sid}::documents",
            "text": text,
            "metadata": {**base_meta, "section": "documents"},
        })

    # Chunk 5 — How to Apply
    if scheme.get("applicationSteps"):
        lines = [f"How to apply for {name}:"]
        for i, step in enumerate(scheme["applicationSteps"], 1):
            lines.append(f"{i}. {step}")
        if scheme.get("officialLink"):
            lines.append(f"Official application link: {scheme['officialLink']}")
        chunks.append({
            "id": f"{sid}::apply",
            "text": "\n".join(lines),
            "metadata": {**base_meta, "section": "how_to_apply"},
        })

    return chunks