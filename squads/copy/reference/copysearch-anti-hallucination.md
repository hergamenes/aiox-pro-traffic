# CopySearch Appendix A: Anti-Hallucination Protocols

## Metadata
```yaml
appendix_id: copysearch-anti-hallucination
version: 1.0.0
applies_to: tasks/copysearch.md
purpose: Prevent AI hallucination and cherry-picking in research
```

---

## Core Principle

> **"AI systems have no stake in accuracy—unlike human researchers whose reputations depend on being right. This fundamental difference requires deliberate countermeasures."**

---

## RED FLAG STATEMENTS (Require Immediate Verification)

The following types of statements MUST be verified before use:

### 1. Statistics Without Explicit Source
- ❌ "Studies show that 73% of consumers..."
- ✅ "According to the 2023 Pew Research study (p. 47), 73% of consumers..."

### 2. Quotes Attributed to Individuals
- ❌ "As Steve Jobs once said, 'Innovation distinguishes...'"
- ✅ "Steve Jobs said in his 2005 Stanford commencement speech: 'Innovation distinguishes...'"

### 3. "Studies Show..." Without Citation
- ❌ "Research indicates that long-form copy outperforms..."
- ✅ "Ogilvy's analysis of 1,200 mail-order campaigns showed that long-form copy outperformed short copy by 40% (Ogilvy on Advertising, p. 89)"

### 4. Superlatives
- ❌ "The best," "the first," "the only," "the most"
- ✅ Verify with independent source or remove

### 5. Specific Percentages or Numbers
- ❌ "Sales increased by 247%"
- ✅ "Sales increased by 247% (Source: Company Q3 2025 earnings report)"

### 6. Historical Claims or Dates
- ❌ "This technique was invented in 1952"
- ✅ Verify with primary historical source

### 7. Competitor Comparisons
- ❌ "Unlike Competitor X, our product..."
- ✅ Verify competitor claim is accurate and current

---

## VERIFICATION METHODS

### Method 1: Cross-Reference
**Standard:** Find same fact in 2+ independent sources

```
Claim: "[claim]"
Source 1: [name] — [URL/reference] — [date]
Source 2: [name] — [URL/reference] — [date]
Agreement: [Yes/No/Partial]
```

### Method 2: Source Check
**Standard:** Verify source actually exists and says what's claimed

- [ ] Source URL/reference is accessible
- [ ] Quote appears in claimed location (page, timestamp)
- [ ] Context of quote matches how it's being used
- [ ] Publication date is as claimed

### Method 3: Recency Check
**Standard:** Confirm information is current

- [ ] Data is from last 12 months (or appropriate timeframe)
- [ ] No superseding information exists
- [ ] Market conditions haven't invalidated the claim

### Method 4: Authority Check
**Standard:** Is source credible for this claim type?

| Claim Type | Acceptable Sources | Unacceptable Sources |
|------------|-------------------|---------------------|
| Product specs | Manufacturer docs, independent tests | Marketing materials, press releases |
| Market data | Industry reports, SEC filings | Blog posts, social media |
| Consumer sentiment | Verified reviews, support tickets | Anonymous forums |
| Competitor claims | Competitor's official sources | Second-hand reports |

### Method 5: Conflict Check
**Standard:** Does source have incentive to mislead?

- [ ] Source has no financial interest in the claim
- [ ] Source is not affiliated with interested party
- [ ] Source has track record of accuracy

---

## CONFIDENCE SCORING

### HIGH (90%+)
**Criteria:**
- Multiple independent sources
- Direct verification possible
- Primary source accessible
- No conflicting information

**Action:** Can use in headlines and primary claims

### MEDIUM (70-89%)
**Criteria:**
- Single credible source
- Consistent with other evidence
- Source is authoritative
- Minor gaps in verification

**Action:** Can use in supporting claims, note source

### LOW (50-69%)
**Criteria:**
- Single source
- Cannot independently verify
- Source credibility uncertain
- Some inconsistencies

**Action:** Flag for human review, use with qualifiers only

### UNACCEPTABLE (<50%)
**Criteria:**
- Speculation or inference
- No source available
- Source not credible
- Conflicting information

**Action:** DISCARD — do not use

---

## REQUIRED DISCLOSURES

When confidence is below HIGH, include appropriate disclosure:

### For MEDIUM confidence:
- "Source not independently verified"
- "Based on [source name] report"

### For LOW confidence:
- "Based on manufacturer claims only"
- "Confidence: LOW — requires human verification"
- "Unable to locate primary source"

### For claims that cannot be verified:
- "Anecdotal evidence suggests..."
- "Some users report..."
- "This claim could not be independently verified"

---

## PRE-AI RESEARCH PROTOCOL

Before using AI for any research analysis:

### 1. Define Specific Questions
```
Research Question: [specific, measurable question]
Required Evidence Type: [GOLD/SILVER/BRONZE]
Acceptable Sources: [list]
Unacceptable Sources: [list]
```

### 2. Identify High-Stakes Claims
- [ ] List claims that will require GOLD-tier evidence
- [ ] List claims where errors could cause legal/reputational damage
- [ ] Assign human reviewer for each high-stakes claim

### 3. Establish Confidence Thresholds
```
Auto-accept threshold: 70%+ confidence
Human review threshold: 50-69% confidence
Auto-reject threshold: <50% confidence
```

### 4. Specify Source Quality Criteria
- Primary sources: [definition for this project]
- Secondary sources: [definition for this project]
- Rejected sources: [list]

---

## DURING-AI RESEARCH PROTOCOL

### 1. Multiple Model Cross-Validation
When possible, run the same query through 2+ AI models:
- Model A result: [claim + source]
- Model B result: [claim + source]
- Agreement level: [agree/partial/disagree]
- Action if disagree: [verify independently]

### 2. Citation Requirement
**Rule:** No claim without source

❌ "Consumers prefer long-form content"
✅ "Consumers prefer long-form content (Source: [study name], [date], p. [X])"

### 3. Provenance Tracking
For every claim, track:
- Source document/URL
- Page/section/timestamp
- Date accessed
- Confidence level
- Verification status

### 4. Speculative Language Flagging
Flag these phrases for human review:
- "may," "might," "could"
- "reportedly," "allegedly"
- "some experts believe"
- "it is possible that"
- "evidence suggests"

### 5. Document Uncertainty
When AI expresses uncertainty, document it:
```
Claim: [claim]
AI Confidence: [stated confidence]
Stated Limitations: [what AI said it doesn't know]
Human Action Required: [Y/N]
```

---

## POST-AI RESEARCH PROTOCOL

### 1. Human Review of High-Stakes Claims
- [ ] All GOLD-tier claims reviewed by human expert
- [ ] All numerical data verified against primary source
- [ ] All quotes verified in original context
- [ ] All competitor claims verified as current

### 2. Cross-Check Numbers
AI systems frequently fabricate statistics. For every number:
- [ ] Located in primary source
- [ ] Matches exactly (not rounded or modified)
- [ ] Context matches how it's being used
- [ ] Date of data is appropriate

### 3. Verify Quotes Exist
For every quote attributed to a person:
- [ ] Quote appears in claimed source
- [ ] Quote is complete (not truncated misleadingly)
- [ ] Context matches intended use
- [ ] Person actually said this (not paraphrased)

### 4. Test Critical Assumptions
Where possible, validate with experiments:
- [ ] A/B test assumptions about consumer behavior
- [ ] Survey actual customers about claimed preferences
- [ ] Test competitive claims independently

### 5. Document Limitations
```
RESEARCH LIMITATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claims not verified: [list]
Sources not accessible: [list]
Data gaps: [list]
Assumptions made: [list]
Recommended additional research: [list]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ACCOUNTABILITY MECHANISMS

### 1. Named Human Responsibility
Every research output must have:
- Primary researcher name
- Human reviewer name
- Date of review
- Signature/approval

**Rule:** The AI is never accountable. A human is always responsible.

### 2. Audit Trail
Maintain documentation linking:
- Every AI-assisted finding → its verification process
- Every claim → its source
- Every source → its credibility assessment

### 3. Feedback Loops
After campaign performance:
- [ ] Compare research recommendations to actual results
- [ ] Identify which predictions were accurate
- [ ] Investigate inaccurate predictions
- [ ] Update confidence calibration

### 4. Post-Failure Investigation
When research-based campaigns underperform:
- [ ] Was the research flawed?
- [ ] Was execution flawed?
- [ ] Were external factors responsible?
- [ ] Update protocols based on findings

---

## EMERGENCY STOP TRIGGERS

**STOP ALL WORK if any of these occur:**

1. ❌ AI produces claim that contradicts known facts
2. ❌ AI fabricates a source that doesn't exist
3. ❌ AI claims are suspiciously convenient for the desired conclusion
4. ❌ Multiple verification methods produce conflicting results
5. ❌ Human reviewer expresses doubt about any critical claim

**Action:** Pause, investigate, and resolve before proceeding.

---

## OGILVY'S WARNING

> **"The trouble with market research is that people don't think how they feel, they don't say what they think, and they don't do what they say."**
> — David Ogilvy

This applies doubly to AI research. AI systems:
- Don't "think" — they pattern-match
- Don't "know" — they predict
- Don't "verify" — they generate

**The human must provide the discipline that AI lacks.**

---

*Appendix A for: tasks/copysearch.md*
*Based on: docs/research/david-ogilvy-research-engineering-meta-framework.md*
