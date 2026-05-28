# EMAIL EXTRACTION PROMPT

You are extracting email templates from proven email copywriters.

## SOURCE MATERIAL
{{SOURCE_CONTENT}}

## EMAIL TYPES
1. Infotainment (Ben Settle style): Story + lesson + pitch
2. Soap Opera Sequence (Chaperon): Multi-email story arc with open loops
3. Launch Email: Part of product launch sequence
4. Broadcast: Regular list email
5. Abandoned Cart: Recovery email
6. Welcome: New subscriber onboarding

## EXTRACTION RULES

1. For each email, capture:
   - Subject line
   - Full body text
   - CTA
   - Position in sequence (if applicable)
   - Email type

2. YAML OUTPUT FORMAT:
```yaml
- id: "em_{{SLUG}}_001"
  subject: "The weird thing that happened at the grocery store..."
  body: |
    [Full email body here]
  cta:
    text: "Click here to learn more"
    position: "end"
  source:
    author: "Ben Settle"
    work: "Email Players"
    year: 2018
  email_type: "infotainment"
  sequence_position: null  # or 1-5 for sequences
  word_count: 342
  technique_notes: "Story hook + personality + soft pitch"
  score: 4
  tags: ["infotainment", "story", "daily_email"]
```

## OUTPUT
Extract ALL qualifying emails. Output ONLY valid YAML array.
