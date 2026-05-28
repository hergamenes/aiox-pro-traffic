# CopySearch Methodology Research
# Deep Research for copysearch.md Task Documentation

---

## Research Metadata

```yaml
research_id: copysearch-methodology
version: 1.0.0
date: 2026-01-23
researcher: Ralph Autonomous Agent
task_target: tasks/copysearch.md
status: TASK ALREADY COMPLETE - This research documents existing methodology
current_task_lines: 921
minimum_lines: 600
assessment: EXCEEDS REQUIREMENTS

primary_methodology: David Ogilvy Research Engineering
secondary_sources:
  - Gary Halbert - Swipe File methodology
  - Eugene Schwartz - Market research
  - Claude Hopkins - Scientific Advertising testing
  - CopyHackers - Modern swipe file practices
```

---

## Executive Summary

The `copysearch.md` task already exists as a **gold standard** implementation at 921 lines, well exceeding the 600-line minimum requirement. This research document serves to:

1. Document the theoretical foundations of the existing methodology
2. Provide supplementary research on swipe file best practices
3. Ensure continuity with Copy Framework v2.0 standards

**Assessment:** The existing task is comprehensive and does not require rewriting. This research provides background documentation for the methodology already implemented.

---

## Part 1: The Ogilvy Research Engineering Foundation

### 1.1 David Ogilvy's Research Philosophy

David Ogilvy built Ogilvy & Mather into one of the world's largest advertising agencies on the foundation of rigorous research. His approach revolutionized advertising by treating it as a science rather than an art.

**Core Ogilvy Research Principles:**

1. **"The discipline of knowledge over the anarchy of ignorance"**
   - Research precedes all creative work
   - Facts trump opinions
   - Evidence-based decisions only

2. **"Become the best-informed person on the subject"**
   - For Rolls-Royce, Ogilvy spent 3 weeks reading about the car
   - The famous headline came from technical documentation
   - Deep product knowledge yields breakthrough creative

3. **"Use their language, the language in which they think"**
   - Consumer language research is non-negotiable
   - Exact quotes, not paraphrases
   - Words that resonate vs. words that repel

4. **"We sell, or else"**
   - Research must connect to sales results
   - Direct response testing validates research
   - Behavioral evidence > stated preferences

### 1.2 The Ogilvy Research Stack (5 Layers)

The existing `copysearch.md` implements Ogilvy's complete research methodology:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ LAYER 5: MEASUREMENT & TESTING                                          │
│ "The most important word in the vocabulary of advertising is TEST."     │
├─────────────────────────────────────────────────────────────────────────┤
│ LAYER 4: BRAND & POSITIONING                                            │
│ "How should you position your product?"                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ LAYER 3: MARKET & COMPETITION                                           │
│ "Find out all you can about competitors, then keep quiet about them."   │
├─────────────────────────────────────────────────────────────────────────┤
│ LAYER 2: CONSUMER & VOICE OF CUSTOMER                                   │
│ "Use their language, the language in which they think."                 │
├─────────────────────────────────────────────────────────────────────────┤
│ LAYER 1: PRODUCT & ENGINEERING                                          │
│ "Become the best-informed person on the account."                       │
└─────────────────────────────────────────────────────────────────────────┘
```

Each layer has specific outputs, quality gates, and validation criteria implemented in the task.

### 1.3 The Evidence Hierarchy

Ogilvy's distinction between reliable and unreliable evidence:

```yaml
evidence_hierarchy:

  tier_gold:
    label: "GOLD - Use for primary claims"
    types:
      - Direct response results
      - Sales data
      - Verified technical documentation
    validation: "Sales/response tracking, source verification"
    copy_usage: "Headlines, primary claims"

  tier_silver:
    label: "SILVER - Use for supporting claims"
    types:
      - Expert interviews
      - Systematic competitive analysis
      - Diagnostic metrics
    validation: "Cross-reference"
    copy_usage: "Supporting claims"

  tier_bronze:
    label: "BRONZE - Use with qualifiers only"
    types:
      - Consumer stated preferences
      - Focus groups
    validation: "Behavioral cross-check required"
    copy_usage: "Hypothesis only"

  tier_reject:
    label: "REJECT - Never use"
    types:
      - Creative awards
      - Unverified claims
      - Intuition
    validation: "N/A"
    copy_usage: "NEVER"
```

**Ogilvy Quote:** "We have been unable to establish any correlation whatever between awards and sales."

---

## Part 2: The Swipe File Methodology

### 2.1 Origins and Purpose

Gary Halbert popularized (and possibly coined) the term "swipe file" in his newsletter. According to his son Bond Halbert, the practice became central to how direct response copywriters learned their craft.

**What is a Swipe File?**
A collection of proven copywriting samples - headlines, sales letters, ads, offers, and promotional materials - compiled for study and inspiration.

**Original Intended Use (Halbert):**
1. Study successful copy to understand WHY it works
2. Hand-copy classics to internalize patterns
3. Use as inspiration, not templates to plagiarize
4. Build intuition for what converts

### 2.2 Gary Halbert's Recommended Study Method

From "The Hands-On Experience" issue of The Gary Halbert Letter:

**Step 1: Build Your Collection**
- Save every piece of copy that makes you want to buy
- Collect from multiple channels (mail, print, TV, radio)
- Focus on copy that has been running for years (proven winners)
- Organize by type (headlines, leads, closes, offers)

**Step 2: Hand-Copy Classics**
Halbert recommended physically writing out successful ads by hand:
- The Admiral Byrd Letter (Hank Burnett)
- The Wall Street Journal "Two Young Men" letter
- Coat of Arms letter (Halbert's own)
- Famous dollar letter

**Why Hand-Copying Works:**
- Forces slow, deliberate reading
- Engages muscle memory
- Reveals structure and rhythm
- Builds unconscious pattern recognition

**Step 3: Analyze, Don't Just Collect**
- Why does this headline work?
- What emotional triggers are used?
- How is the offer structured?
- What objections are handled?
- How is urgency created?

### 2.3 Modern Swipe File Best Practices

From CopyHackers and contemporary sources:

**Categories to Collect:**

```yaml
swipe_file_categories:

  headlines:
    purpose: "Opening hooks that capture attention"
    sources: "Ads, emails, landing pages"
    organization: "By type (how-to, news, question, command)"

  leads:
    purpose: "Opening paragraphs that pull readers in"
    sources: "Sales letters, email sequences"
    organization: "By angle (story, stat, question, bold claim)"

  bullets:
    purpose: "Fascinations that create curiosity"
    sources: "Sales pages, direct mail"
    organization: "By formula (blind, benefit, proof)"

  closes:
    purpose: "CTAs and closing arguments"
    sources: "Landing pages, sales letters"
    organization: "By urgency type"

  offers:
    purpose: "Value stack structures"
    sources: "Funnels, launches"
    organization: "By pricing strategy"

  emails:
    purpose: "Subject lines and sequences"
    sources: "Newsletters, launches"
    organization: "By email type (welcome, nurture, sales)"

  ads:
    purpose: "Paid media creative"
    sources: "Ad libraries, social feeds"
    organization: "By platform and format"
```

**Collection Tools:**

| Tool | Use Case | Notes |
|------|----------|-------|
| Notion | Organized database | Tags, filters, templates |
| Evernote | Quick capture | Web clipper extension |
| Google Drive | File storage | PDFs, screenshots |
| Airtable | Structured data | Better for analysis |
| Physical folder | Classic approach | Halbert's original method |

### 2.4 Swipe File Anti-Patterns

**What NOT to Do:**

1. **Don't Copy-Paste**
   - Swipe for structure, not sentences
   - Plagiarism destroys credibility
   - Adapt principles, not words

2. **Don't Collect Without Analyzing**
   - A folder of 10,000 unanalyzed swipes is useless
   - Quality > quantity
   - Understand WHY it works

3. **Don't Swipe Unproven Copy**
   - Just because it's published doesn't mean it converts
   - Look for longevity (running 4+ weeks = likely winner)
   - Prefer direct response with measurable results

4. **Don't Ignore Context**
   - What worked in 1975 may not work today
   - B2B ≠ B2C
   - Different audiences need different approaches

---

## Part 3: Competitive Research Methodology

### 3.1 Systematic Competitor Analysis

The `copysearch.md` task implements comprehensive competitive intelligence:

**Competitor Identification Framework:**

```yaml
competitive_set_definition:

  direct_competitors:
    definition: "Same category, same audience"
    example: "Competing CRM software"
    priority: "Primary analysis"

  indirect_competitors:
    definition: "Different category, same job-to-be-done"
    example: "Spreadsheets vs CRM"
    priority: "Secondary analysis"

  substitute_solutions:
    definition: "Alternative approaches including 'do nothing'"
    example: "Paper-based tracking"
    priority: "Opportunity identification"
```

### 3.2 Ad Intelligence Sources

**Free Ad Libraries:**

| Platform | URL | Coverage |
|----------|-----|----------|
| Meta Ad Library | facebook.com/ads/library | FB, IG, Messenger |
| Google Ads Transparency | adstransparency.google.com | Search, Display, YouTube |
| LinkedIn Ad Library | linkedin.com/ad-library | LinkedIn |
| TikTok Creative Center | ads.tiktok.com/business/creativecenter | TikTok |

**Paid Tools:**

| Tool | Use Case | Price Range |
|------|----------|-------------|
| SpyFu | Search ads | $39-299/mo |
| SEMrush | Full competitive | $119-449/mo |
| SimilarWeb | Traffic analysis | Enterprise |
| AdBeat | Display ads | $249+/mo |

### 3.3 Positioning Gap Analysis

**Framework for identifying white space:**

```yaml
gap_analysis_categories:

  unclaimed_positions:
    question: "What benefits does no competitor own?"
    analysis: "Map all competitor claims, find gaps"
    opportunity: "Be first to own unclaimed territory"

  under_proven_claims:
    question: "What claims are made without strong proof?"
    analysis: "Audit competitor proof elements"
    opportunity: "Out-prove competitors on same claims"

  audience_gaps:
    question: "What segments do competitors ignore?"
    analysis: "Map audience targeting across competitors"
    opportunity: "Serve underserved segments"

  format_gaps:
    question: "What ad types/channels are underused?"
    analysis: "Audit creative formats and channels"
    opportunity: "Differentiate through format"

  objection_gaps:
    question: "What concerns don't competitors address?"
    analysis: "Review competitor messaging for objection handling"
    opportunity: "Address unaddressed objections"
```

---

## Part 4: Consumer Language Mining

### 4.1 Voice of Customer (VOC) Research

The `copysearch.md` task implements comprehensive VOC mining:

**Source Priority (in order of reliability):**

1. **Customer support tickets** - Behavioral gold (people writing when frustrated or delighted)
2. **Product reviews** - Amazon, G2, Trustpilot
3. **Forum discussions** - Reddit, niche communities
4. **Social media conversations** - Organic only, not prompted
5. **Call/chat transcripts** - If available
6. **Survey open-ends** - Lowest priority (prompted responses)

### 4.2 Language Pattern Extraction

**Categories to Extract:**

```yaml
language_categories:

  pain_language:
    description: "How they describe the problem"
    extraction: "Exact quotes with frequency count"
    usage: "Headlines, leads, empathy building"
    example: '"I was drowning in spreadsheets" (appeared 47x)'

  desire_language:
    description: "How they describe the ideal outcome"
    extraction: "Exact quotes with frequency count"
    usage: "Promise statements, benefits"
    example: '"I just want something that works" (appeared 23x)'

  objection_language:
    description: "Why they hesitate or reject"
    extraction: "Exact quotes with frequency count"
    usage: "Objection handling, risk reversal"
    example: '"I tried X before and it didnt work" (appeared 31x)'

  comparison_language:
    description: "How they compare alternatives"
    extraction: "Exact quotes with frequency count"
    usage: "Competitive positioning"
    example: '"Unlike [competitor], this actually..." (appeared 15x)'

  emotional_language:
    description: "Intense positive/negative expressions"
    extraction: "Exact quotes with frequency count"
    usage: "Emotional hooks, testimonials"
    example: '"This saved my business" (appeared 8x)'
```

### 4.3 The Ogilvy Warning

> "The trouble with market research is that people don't think how they feel, they don't say what they think, and they don't do what they say."
> — David Ogilvy

**Implication:** Always cross-validate stated preferences with behavioral data (purchases, support tickets, retention).

---

## Part 5: Fact Extraction and Anchor Facts

### 5.1 The Anchor Fact Concept

From Ogilvy's Rolls-Royce work:

> "At 60 miles an hour the loudest noise in this new Rolls-Royce comes from the electric clock."

This headline came from deep product research - reading technical documentation until finding a single fact that:
- Was specific (60 mph, electric clock)
- Was surprising (challenges assumptions about noise)
- Was differentiating (no competitor could claim this)
- Was verifiable (from Rolls-Royce technical specs)
- Was relevant (connected to quality/luxury benefit)

### 5.2 Anchor Fact Criteria

All 5 must be true:

```yaml
anchor_fact_criteria:

  specific:
    requirement: "Numbers, measurements, concrete details"
    bad_example: "Very quiet at highway speeds"
    good_example: "At 60 mph, 32 decibels"

  surprising:
    requirement: "Not obvious, challenges assumptions"
    bad_example: "Rolls-Royce is a luxury car"
    good_example: "Loudest noise from electric clock"

  differentiating:
    requirement: "Competitors cannot credibly claim this"
    bad_example: "Comfortable ride"
    good_example: "Only car where clock is loudest at 60mph"

  verifiable:
    requirement: "Source can be cited, claim can be tested"
    bad_example: "Best-in-class quality"
    good_example: "Technical Spec Sheet, Page 47"

  relevant:
    requirement: "Connects to consumer benefit"
    bad_example: "Engine weighs 847 pounds"
    good_example: "Quietness = luxury/peace"
```

### 5.3 Fact Extraction Process

From the existing `copysearch.md` task:

**Extraction Template:**

```
FACT: [specific claim]
SOURCE: [document name]
LOCATION: [page/section/paragraph]
DATE: [publication date]
CONFIDENCE: [HIGH/MEDIUM/LOW]
VERIFICATION: [how to verify independently]
```

**Extraction Rules:**
1. Seek SPECIFIC NUMBERS (not "many" but "147")
2. Seek UNIQUE PROCESSES (how it's made differently)
3. Seek TESTS PERFORMED (proof of quality)
4. Seek MEMORABLE DETAILS (the "French walnut picnic tables" principle)

---

## Part 6: Anti-Hallucination Protocols

### 6.1 The AI Research Challenge

AI agents researching copy can:
- Hallucinate statistics that sound plausible
- Cherry-pick evidence that confirms hypotheses
- Miss contradictory evidence
- Generate "insights" from pattern matching rather than data

### 6.2 Validation Gates (from copysearch.md)

**GATE 1 — SOURCE**
> "Where does this information come from?"
- Each critical insight has traceable source
- Insights without source: DISCARD or FIND source

**GATE 2 — VERIFICATION**
> "Can I verify this independently?"
- Critical insights cross-checked with 2+ sources
- Unverified insights marked as such

**GATE 3 — REPRESENTATIVENESS**
> "Does this represent the whole or is it cherry-picking?"
- Quantitative analysis exists (not just isolated examples)
- Sample is sufficient (not cherry-picking)

**GATE 4 — HUMAN**
> "Has an expert validated this?"
- Critical claims reviewed by human specialist
- If not: DO NOT use in final copy

### 6.3 Red Flags

Stop immediately if any are true:

```yaml
red_flags:

  - flag: "Insight seems too good to be true"
    action: "Investigate source and verification"

  - flag: "No traceable source"
    action: "Find source or discard"

  - flag: "AI 'discovered' something nobody else has seen"
    action: "High skepticism, verify extensively"

  - flag: "Numerical data without clear origin"
    action: "Find original source or discard"

  - flag: "Generalizations without quantitative data"
    action: "Add qualifiers or discard"

  - flag: "Contradicts what the client said"
    action: "Investigate contradiction"

  - flag: "Cannot be verified independently"
    action: "Mark as unverified, use with caution"
```

---

## Part 7: Output Artifacts

### 7.1 Complete Deliverable Set

The `copysearch.md` task produces 8 standardized artifacts:

| # | Artifact | Purpose | Key Components |
|---|----------|---------|----------------|
| 1 | Research Charter | Define scope | Decision, success criteria, accountability |
| 2 | Technical Fact Sheet | Product knowledge | 13+ facts, anchor fact, provenance |
| 3 | Consumer Language Bank | VOC research | 50+ quotes, categorized |
| 4 | Competitive Intelligence Matrix | Market mapping | Gaps, winners, white space |
| 5 | Strategic Brief | Positioning | Promise, proof, audience |
| 6 | Creative Options Document | Headlines | 25+ headlines, rationale |
| 7 | Validated Insights Document | Source audit | All 4 gates, status |
| 8 | Research Accuracy Scorecard | Retrospective | Predictions vs outcomes |

### 7.2 Quality Minimums

```yaml
quality_minimums:

  technical_fact_sheet:
    facts: "13+ verified facts"
    anchor_fact_candidates: "3"
    anchor_fact_selected: "1 passing all 5 criteria"

  consumer_language_bank:
    quotes: "50+ literal quotes"
    categories: "Pain, desire, objection, comparison, emotional"
    jobs_to_be_done: "5+"

  competitive_intelligence:
    competitors: "3+ (direct, indirect, substitute)"
    ads_reviewed: "All active for top 5"
    gaps_identified: "3+ white space opportunities"

  creative_options:
    headlines: "25+ across 8 types"
    top_candidates: "5 selected for testing"
    big_idea_score: "3/5 minimum"
```

---

## Part 8: Current Task Assessment

### 8.1 Existing Task Status

**File:** `squads/copy/tasks/copysearch.md`

**Current State:**
- **Lines:** 921 (exceeds 600 minimum by 53%)
- **Version:** 2.0.0
- **Methodology:** David Ogilvy Research Engineering
- **Phases:** 7 complete phases (0-7)
- **Outputs:** 8 standardized artifacts
- **Quality Gates:** Comprehensive checklists per phase
- **Anti-Hallucination:** Complete protocol

### 8.2 Compliance Check

```yaml
compliance_assessment:

  minimum_lines:
    requirement: 600
    actual: 921
    status: "✅ PASS (+53%)"

  research_foundation:
    requirement: "Based on copywriter methodologies"
    actual: "David Ogilvy primary, Halbert secondary"
    status: "✅ PASS"

  quality_checklists:
    requirement: "Included"
    actual: "7 quality gates with detailed checklists"
    status: "✅ PASS"

  templates:
    requirement: "Output templates included"
    actual: "8 standardized artifact templates"
    status: "✅ PASS"

  validation:
    requirement: "Evidence verification process"
    actual: "4-gate validation + red flags"
    status: "✅ PASS"

  overall_assessment: "EXCEEDS ALL REQUIREMENTS - No rewrite needed"
```

### 8.3 Recommendation

**The existing `copysearch.md` task is a gold standard implementation that:**
1. Already exceeds minimum line requirements (921 vs 600)
2. Implements comprehensive Ogilvy methodology
3. Includes all required quality gates
4. Provides standardized output templates
5. Has anti-hallucination protocols

**Action:** Mark US-044 as PASSED - task already meets v2.0 standards.

---

## Sources and Bibliography

### Primary Sources

```yaml
primary_sources:

  david_ogilvy:
    - "Ogilvy on Advertising" (1983)
    - "Confessions of an Advertising Man" (1963)
    - "The Theory and Practice of Selling the Aga Cooker" (1935)
    - "How to Create Advertising That Sells" (1972 internal memo)

  gary_halbert:
    - "The Boron Letters"
    - "The Gary Halbert Letter" (newsletters)
    - "How to Become a World Class Copywriter in 30 Days"

  modern_sources:
    - CopyHackers - "What Is a Swipe File?"
    - Copyblogger - "5 Tips on Effective Use of Copywriting Swipe Files"
    - Swiped.co - Classic swipe file archive
```

### Research Statistics

```yaml
research_findings:

  - finding: "Hand-copying ads builds unconscious pattern recognition"
    source: "Gary Halbert, The Boron Letters"

  - finding: "Ads running 4+ weeks are likely performing well"
    source: "Industry standard, competitive intelligence"

  - finding: "Stated preferences don't match actual behavior"
    source: "David Ogilvy, multiple works"

  - finding: "Specific numbers are more persuasive than vague claims"
    source: "David Ogilvy, Sears Roebuck example"
```

---

## Conclusion

The `copysearch.md` task represents a **complete, gold-standard implementation** of copy research methodology based on David Ogilvy's principles. At 921 lines, it significantly exceeds the 600-line minimum and includes:

- Complete 5-layer research stack
- 7 phases with quality gates
- 8 standardized output artifacts
- Anti-hallucination protocols
- Evidence hierarchy and validation

**This research document serves as supplementary documentation rather than a basis for rewriting, as the existing task already meets all Copy Framework v2.0 requirements.**

---

*Research Document: 512 lines*
*Generated: 2026-01-23*
*For: US-044 copysearch.md documentation*
*Assessment: Task already complete, no rewrite needed*
