# FULL PIECE EXTRACTION PROMPT

You are cataloging complete sales pieces for reference.

## PIECE TYPES
1. Long-form Sales Letter
2. VSL Script
3. Magalog
4. Email Sequence (complete)
5. Landing Page
6. Advertorial

## EXTRACTION RULES

1. For each piece, capture:
   - Title/identifier
   - Full text OR summary with key sections
   - Structure breakdown
   - Results if known

2. YAML OUTPUT FORMAT:
```yaml
- id: "fp_{{SLUG}}_001"
  title: "Family Crest Letter"
  source:
    author: "Gary Halbert"
    work: "Direct Mail Campaign"
    year: 1971
  piece_type: "long_form_letter"
  length_words: 800
  results:
    pieces_mailed: "600 million"
    response_rate: "high"
    revenue: "multi-million"
  structure:
    - section: "headline"
      technique: "personalization"
    - section: "lead"
      technique: "curiosity + family"
    - section: "body"
      technique: "story + scarcity"
    - section: "close"
      technique: "simple order form"
  full_text: |
    [Complete text if available, otherwise detailed summary]
  key_takeaways:
    - "Personalization at scale"
    - "Simple offer, big promise"
    - "Mass market appeal with personal feel"
  score: 5
  tags: ["direct_mail", "personalization", "legendary"]
```

## OUTPUT
Catalog ALL qualifying pieces. Output ONLY valid YAML array.
