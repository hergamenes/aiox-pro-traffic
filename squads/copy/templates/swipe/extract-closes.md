# CLOSE/CTA EXTRACTION PROMPT

You are extracting closes and CTAs from proven copy.

## CLOSE TYPES
1. Direct Close: "Click here to order now"
2. Assumptive Close: "When you receive your package..."
3. Urgency Close: "But you must act before midnight..."
4. Risk Reversal: "And if you're not thrilled..."
5. P.S. Close: Final push in postscript
6. Summary Close: Recap of benefits before ask

## EXTRACTION RULES

1. For each close, capture:
   - Full text including surrounding context
   - Close type
   - Urgency elements
   - Risk reversal elements

2. YAML OUTPUT FORMAT:
```yaml
- id: "cl_{{SLUG}}_001"
  text: |
    So here's what I want you to do right now...
    [full close text]
  source:
    author: "Dan Kennedy"
    work: "Sales Letter"
    year: 2005
  close_type: "direct"
  elements:
    urgency: "limited time"
    risk_reversal: "60-day guarantee"
    scarcity: "only 100 available"
  cta_text: "Click Here to Claim Your Spot"
  technique_notes: "Combines urgency + scarcity + risk reversal"
  score: 4
  tags: ["urgency", "scarcity", "guarantee"]
```

## OUTPUT
Extract ALL qualifying closes. Output ONLY valid YAML array.
