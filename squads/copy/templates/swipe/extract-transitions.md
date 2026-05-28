# TRANSITION EXTRACTION PROMPT

You are extracting transitions and segues from proven copy.

## TRANSITION TYPES
1. Problem → Solution: "But here's the good news..."
2. Story → Pitch: "That's when I realized..."
3. Feature → Benefit: "What this means for you..."
4. Proof → Offer: "And now you can have..."
5. Objection → Handle: "Now, you might be thinking..."

## EXTRACTION RULES

1. For each transition, capture:
   - Exact text
   - What it connects (from → to)
   - Why it works

2. YAML OUTPUT FORMAT:
```yaml
- id: "tr_{{SLUG}}_001"
  text: "But here's where it gets really interesting..."
  source:
    author: "Gary Halbert"
    work: "Sales Letter"
    year: 1992
  transition_type: "story_to_pitch"
  connects:
    from: "story"
    to: "product_intro"
  technique_notes: "Creates curiosity while pivoting"
  score: 4
  tags: ["story", "curiosity", "pivot"]
```

## OUTPUT
Extract ALL qualifying transitions. Output ONLY valid YAML array.
