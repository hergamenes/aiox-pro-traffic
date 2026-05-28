# CPL Evaluation Execution Checklist

> **Purpose**: Garantir que toda avaliação de CPL use a infraestrutura completa do PLF
> **Framework**: Product Launch Formula (Jeff Walker)
> **Version**: 1.0
> **Created**: 2026-02-01

---

## BEFORE Starting Evaluation

### 1. Load Production Aid COMPLETELY

**CRITICAL: Carregar o Production Aid completo ANTES de avaliar.**

| CPL # | Production Aid File | Lines |
|-------|---------------------|-------|
| 1 | `checklists/plf/plc1-complete-production-aid.md` | ~590 |
| 2 | `checklists/plf/plc2-complete-production-aid.md` | ~827 |
| 3 | `checklists/plf/plc3-complete-production-aid.md` | ~943 |
| 4 | `checklists/plf/sales-video-complete-production-aid.md` | ~1126 |

- [ ] Li o Production Aid COMPLETO para este CPL number
- [ ] Identifiquei as 10 seções principais
- [ ] Extraí os critérios específicos de avaliação

### 2. Load Launch Context

- [ ] Nome do produto
- [ ] Nome do criador/expert
- [ ] Avatar/público-alvo
- [ ] Contexto do lançamento (se disponível)

### 3. Prepare Transcript

- [ ] Arquivo de transcrição disponível
- [ ] Estratégia de chunking definida (500 linhas / 50 overlap)

---

## DURING Beat Analysis (Phase 2)

### Expected Beats for Each CPL

**CPL1 (The Opportunity):**
1. Opening (30-90 segundos)
2. Show the Opportunity (2-4 min)
3. Position Yourself (2-3 min)
4. Teach (3-5 min)
5. Raise Objections (1-3 min)
6. Foreshadow CPL2 (30-60 sec)
7. Call to Action (30-60 sec)

**CPL2 (The Transformation):**
1. Opening + Recap CPL1
2. Case Studies (transformations)
3. Teaching (deeper)
4. Objection Handling
5. Foreshadow CPL3
6. CTA

**CPL3 (The Ownership):**
1. Recap Journey
2. Ownership Vision
3. Day-in-the-Life
4. Final Teaching
5. Bridge to Offer
6. Product Preview
7. Scarcity Setup
8. CTA + Close

**For EACH beat, document:**
- [ ] Start line number
- [ ] End line number
- [ ] Evidence quote (citação direta)
- [ ] Copy framework used (Strategy A, B, or C)
- [ ] Score (1-5)
- [ ] Gaps identified

---

## DURING Rubric Scoring (Phase 3)

### 10 Dimensions with Weights (PLC1)

| # | Dimension | Weight | Critical? |
|---|-----------|--------|-----------|
| 1 | Empathy | 1.0 | No |
| 2 | Opportunity clarity | 1.2 | **Yes** |
| 3 | Positioning | 1.0 | No |
| 4 | Teaching value | 1.2 | **Yes** |
| 5 | Objection handling | 0.8 | No |
| 6 | Anticipation | 1.0 | **Yes** |
| 7 | CTA | 0.8 | No |
| 8 | Zero pitch | 1.5 | **Yes** |
| 9 | Emotional arc | 1.0 | No |
| 10 | Rewatchability | 0.5 | No |

**For EACH dimension:**
- [ ] Read definition of 1 (Weak), 3 (Solid), 5 (Exceptional) from Production Aid
- [ ] Find evidence in transcript
- [ ] Assign score (1-5, no decimals)
- [ ] Document justification with quote
- [ ] Identify gap to next level

### Score Calculation

```
weighted_score = Σ(dimension_score × weight) / Σ(weights)
overall_score = weighted_score × 2  # Convert to 0-10 scale
```

---

## DURING Mistake Detection (Phase 4)

### Top 15 Mistakes (Ranked by Damage)

**Critical (#1-5): Damage Multiplier 3x**

| # | Mistake | Detection Pattern |
|---|---------|-------------------|
| 1 | Opening with credentials instead of empathy | First 30 sec mentions "I am...", titles, without pain acknowledgment |
| 2 | Teaching too little | No actionable content, just teasers |
| 3 | Selling or hinting at product | ANY mention of product, price, offer, or "buy" |
| 4 | Abstract transformation | "Better life", "success" without specifics |
| 5 | Skipping empathy layer in positioning | Credentials without "I was where you are" |

**Significant (#6-10): Damage Multiplier 2x**

| # | Mistake | Detection Pattern |
|---|---------|-------------------|
| 6 | No foreshadow of CPL2 | No mention of "next video" or tease |
| 7 | No call to action for comments | No engagement request at end |
| 8 | Ignoring objections | No "you might be thinking..." language |
| 9 | Trying to cover everything | CPL too long, no strategic restraint |
| 10 | Over-produced, under-authentic | Scripted feel, no personality |

**Minor (#11-15): Damage Multiplier 1x**

| # | Mistake | Detection Pattern |
|---|---------|-------------------|
| 11 | Teaching theory instead of actionable | Concepts without "do this today" |
| 12 | Making transformation unachievable | Story too extraordinary |
| 13 | Too long on positioning | >20% of total time on "who I am" |
| 14 | Flat emotional pacing | Same energy throughout |
| 15 | Ending weakly | Abrupt or low-energy close |

**For EACH mistake:**
- [ ] Check presence in transcript
- [ ] Classify: DETECTED / AVOIDED / UNCLEAR
- [ ] Document evidence (quote + line number)
- [ ] Apply damage multiplier

### Damage Score Calculation

```
total_damage = Σ(detected_mistakes × damage_multiplier)
penalty = total_damage / max_possible_damage
```

---

## DURING Trigger Analysis (Phase 5)

### 9 Triggers by Beat

| Beat | Expected Triggers |
|------|-------------------|
| Opening | Likability, Trust |
| Opportunity | Hope, Desire |
| Positioning | Authority, Likability, Trust |
| Teaching | Authority, Reciprocity |
| Objections | Trust, Likability |
| Foreshadow | Anticipation |
| CTA | Community, Commitment |

### Primary Triggers for CPL1

| Trigger | Critical? | Expected Intensity |
|---------|-----------|-------------------|
| Authority | Yes | 4-5 |
| Reciprocity | Yes | 4-5 |
| Anticipation | Yes | 4-5 |
| Likability | Yes | 3-4 |
| Trust | No | 3-4 |

**For EACH trigger:**
- [ ] Verify activation (Yes/No/Partial)
- [ ] Document mechanism used
- [ ] Rate intensity (1-5)
- [ ] Note evidence quote

---

## FOR Report Generation (Phase 6)

### Use Template

- [ ] Using `templates/plf/cpl-evaluation-report-tmpl.md`
- [ ] All handlebars variables populated

### Score Formula (MUST USE)

```yaml
# Score composition:
beat_score = average(beat_scores) × 2  # 0-10 scale
rubric_score = weighted_rubric_score   # 0-10 scale
trigger_score = (activated_triggers / expected_triggers) × 10

# Final calculation:
base_score = (beat_score × 0.3) + (rubric_score × 0.4) + (trigger_score × 0.3)
final_score = base_score - mistake_penalty

# Clamp to 0-10
overall_score = max(0, min(10, final_score))
```

### Status Thresholds

| Score | Status |
|-------|--------|
| >= 8.5 | LAUNCH WINNING |
| >= 7.0 | PASS |
| >= 5.0 | NEEDS WORK |
| < 5.0 | FAIL |

### Required Report Sections

- [ ] Executive Summary with scores
- [ ] Beat-by-Beat Analysis with evidence
- [ ] Rubric Scores with justification
- [ ] Mistakes Detected with damage
- [ ] Trigger Analysis with intensity
- [ ] Prioritized Recommendations
- [ ] Rewrite Suggestions (for beats < 3)

---

## VETO Conditions (Stop Evaluation)

### Fatal (Auto-FAIL)
- [ ] Product/offer mentioned in CPL 1, 2, or 3
- [ ] No teaching content in CPL that requires it

### Critical (Flag + Require Attention)
- [ ] Any rubric dimension scores 1
- [ ] Top 5 mistake detected
- [ ] Anticipation trigger missing in CPL 1 or 2

### Warning (Document + Continue)
- [ ] Overall score < 7.0
- [ ] More than 5 mistakes detected
- [ ] More than 2 beats absent

---

## Post-Evaluation Verification

- [ ] 6+ beats identified with evidence (citações)
- [ ] 10 dimensions pontuadas with justification
- [ ] All 15 mistakes checked
- [ ] 9 triggers mapped by beat
- [ ] Score calculated with formula (not estimated)
- [ ] Report follows template structure

---

## Quick Reference: Files to Load

```yaml
# For CPL 1 evaluation:
production_aid: "squads/copy/checklists/plf/plc1-complete-production-aid.md"
rubric_template: "squads/copy/templates/plf/rubric-scores-tmpl.yaml"
beat_template: "squads/copy/templates/plf/beat-analysis-tmpl.yaml"
report_template: "squads/copy/templates/plf/cpl-evaluation-report-tmpl.md"
workflow: "squads/copy/workflows/wf-evaluate-cpl.yaml"

# Chunking for large transcripts:
chunk_size: 500
overlap: 50
```

---

*Checklist Version: 1.0*
*Created: 2026-02-01*
*Framework: Product Launch Formula - CPL Evaluation*
*Purpose: Ensure complete infrastructure usage*
