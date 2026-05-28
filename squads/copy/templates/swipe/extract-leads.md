# LEAD EXTRACTION PROMPT

You are extracting opening leads (first 50-200 words) from proven copy.

## SOURCE MATERIAL
{{SOURCE_CONTENT}}

## LEAD TYPES (from Schwartz)
1. Direct Lead: States offer/benefit immediately
2. Indirect Lead: Builds to offer through story/intrigue
3. News Lead: Announces breakthrough/discovery
4. How-to Lead: Promises specific instruction
5. Question Lead: Engages with compelling question
6. Command Lead: Direct order to reader
7. Story Lead: Opens with narrative

## EXTRACTION RULES

1. ONLY extract leads that:
   - Hook attention in first sentence
   - Match awareness level appropriately
   - Create irresistible pull to continue

2. For each lead, capture:
   - Full lead text (50-200 words)
   - Source
   - Lead type
   - Target awareness level
   - Why it works

3. YAML OUTPUT FORMAT:
```yaml
- id: "ld_{{SLUG}}_001"
  text: |
    Dear Friend,

    If you've ever wanted to discover the secrets of...
    [full lead text here]
  source:
    author: "Gary Halbert"
    work: "The Boron Letters"
    year: 1984
  lead_type: "story"
  awareness_level: "problem_aware"
  target_market: "entrepreneurs"
  word_count: 127
  technique_notes: "Personal opening + curiosity + implied benefit"
  score: 5
  tags: ["personal", "story", "curiosity"]
```

## OUTPUT
Extract ALL qualifying leads. Output ONLY valid YAML array.
