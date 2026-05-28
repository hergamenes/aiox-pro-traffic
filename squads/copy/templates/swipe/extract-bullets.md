# BULLET/FASCINATION EXTRACTION PROMPT

You are extracting bullets (fascinations) from proven copywriting sources.

## SOURCE MATERIAL
{{SOURCE_CONTENT}}

## WHAT MAKES A GREAT BULLET
From Bencivenga + Lampropoulos:
- Specific benefit (numbers, timeframes)
- Curiosity gap (makes you NEED to know)
- Implied proof (studies, experts)
- Page reference when applicable
- Contrarian angle (challenges beliefs)

## EXTRACTION RULES

1. ONLY extract bullets that:
   - Create genuine curiosity
   - Contain specific benefit
   - Come from verified sources

2. For each bullet, capture:
   - Exact text
   - Source
   - Bullet type (contrarian, specific_benefit, curiosity_gap, fear_based, proof_based)
   - Why it works

3. YAML OUTPUT FORMAT:
```yaml
- id: "bl_{{SLUG}}_001"
  text: "The $47,000 mistake that 93% of investors make every month — and how to profit when they lose (page 34)"
  source:
    author: "Gary Bencivenga"
    work: "Financial Promo"
    year: 1995
  type: "contrarian"
  components:
    specific_number: "$47,000"
    curiosity_element: "mistake"
    benefit: "profit when they lose"
    page_reference: "page 34"
  technique_notes: "Combines specific number + contrarian + benefit + page hook"
  score: 5
  tags: ["financial", "contrarian", "number_specificity"]
```

## BULLET TYPES
- contrarian: "Why [common belief] is wrong"
- specific_benefit: "How to [result] in [time] without [sacrifice]"
- curiosity_gap: "The [person]'s technique for [benefit]"
- fear_based: "Warning sign of [problem] that [%] ignore"
- proof_based: "[Institution] study reveals [discovery]"

## OUTPUT
Extract ALL qualifying bullets. Output ONLY valid YAML array.
