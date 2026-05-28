# HEADLINE EXTRACTION PROMPT

You are extracting headlines from proven copywriting sources for a swipe file library.

## SOURCE MATERIAL
{{SOURCE_CONTENT}}

## EXTRACTION RULES

1. ONLY extract headlines that:
   - Have documented results (conversion, sales, response rate)
   - Come from Tier 0-3 copywriters
   - Demonstrate clear mechanism (curiosity, benefit, specificity)

2. For each headline, capture:
   - The exact headline text
   - Source (author, work, year)
   - Context (what it was selling)
   - Results if known
   - Why it works (technique breakdown)

3. YAML OUTPUT FORMAT (strict):
```yaml
- id: "hl_{{SLUG}}_001"
  text: "Exact headline text here"
  source:
    author: "Gary Halbert"
    work: "The Gary Halbert Letter"
    year: 1983
  context: "Selling coat of arms prints via direct mail"
  results: "600 million pieces mailed"
  technique:
    primary: "curiosity"
    secondary: ["specificity", "exclusivity"]
  awareness_level: "unaware"
  sophistication_stage: 1
  score: 5
  tags: ["direct_mail", "personalization", "family"]
  notes: "One of the most mailed pieces in history"
```

## QUALITY SCORING
- 5 stars: Documented $1M+ results OR legendary status
- 4 stars: From Tier 0-1 copywriter + clear winning mechanism
- 3 stars: From Tier 2-3 copywriter + solid structure
- 2 stars: Verified source + good technique
- 1 star: Needs validation or improvement

## OUTPUT
Extract ALL qualifying headlines. Output ONLY valid YAML array.
