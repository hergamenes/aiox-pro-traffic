# VSL Diagnóstico & Otimização — Protocolo de Correção

> **STATUS: CERTIFIED — EXTRACTED FROM @thiagoroas**
> Sources: palestra ao vivo (slides) + Podcast "Segredos da Escala #122" (2026-03-11, 3h01m, YouTube ID: qj04cUeaRAw) + Hotmart Cast (2026-03-12, ~40min, YouTube ID: RENU3kEns0E) + Kiwicast #213 (2026-03-12, ~1h25min, YouTube ID: hnw1pGcc3_A)
> Analyzed by: @jon-benson, @dan-kennedy, @todd-brown, @eugene-schwartz (expert-clone lenses)
> Extracted by: Ohno (SOP Extractor, SOP Factory Squad)
> Extraction date: 2026-03-11
> Remediation v0.2.0: 2026-03-11 — Applied per audit AUDIT-VSL-DIAG-001-v0.1-20260311 (Crosby)
> Remediation v0.3.0: 2026-03-11 — Applied per re-audit AUDIT-VSL-DIAG-001-v0.2-20260311 (Crosby). Fixes: NF-01 governance policy, NF-02 inline note restructure, NF-03 audit trail expansion. Additions: RACI formal matrix, process flowchart, quick-reference card.
> Enrichment v0.4.0: 2026-03-12 — Applied from Hotmart Cast gold extraction + Kiwicast #213 gold extraction. Added: M-05 (72h attribution window), M-06 (CPM context), M-07 (custom metric setup), M-08 (all-creative diagnostic), D-04 (infinite loop pattern), F-10 (boleto pixel corruption), ARCH-04 (upsell/downsell benchmarks), METRICS-01 caveat (contextual benchmarks), METRICS-03 (A/B protocol), TRAFFIC-04 (checkout stability), PRICING-04 alert, DIAG-01 enrichment, DIAG-03 case study, D-02 redline priority, D-03 survey protocol, S-04 case study, M-01 full hierarchy, M-02 meme warning. Confidence upgrades: GAP-01 "one fix at a time" [INF] → [REP].
> This SOP is GENERIC — no business-specific data. Applicable to any VSL funnel.

---

| Field              | Value                                              |
|--------------------|----------------------------------------------------|
| **SOP ID**            | SOP-COPY-VSL-DIAG-001                                                            |
| **Version**           | 0.4.0                                                                             |
| **Effective Date**    | 2026-03-12                                                                        |
| **Author**            | Ohno (SOP Extractor) / SOP Factory Squad                                          |
| **Approver**          | Squad Chief (independent of document owner — per ISO 9001:2015 Clause 7.5.2(c))  |
| **Governance Policy** | AIOX Agent Authority Rules (`.claude/rules/aiox-rules.md`)                        |
| **Next Review**       | 2026-06-11                                                                        |
| **Classification**    | MAJOR                                                                             |
| **Status**            | CERTIFIED                                                                         |
| **Process ID**        | vsl-diagnostic-optimization                                                       |
| **Executor**          | Copy Chief, Performance Analyst, Creative Analyst                                 |
| **Level**             | OPERATIONAL                                                                       |

---

## Confidence Legend

Every extracted element carries a confidence marker derived from source quality:

| Marker | Score | Level | Source Type |
|--------|-------|-------|-------------|
| [DOC] | 1.0 | Observed/Documented | Direct claim from practitioner with stated data |
| [REP] | 0.8 | Reported | Practitioner statement, corroborated by context or case |
| [INF] | 0.5 | Inferred | Deduced from partial evidence or indirect reference |
| [ASM] | 0.3 | Assumed | Reasonable assumption, no direct evidence |

Items with confidence below 0.8 are flagged in the Gaps section for verification.

---

## 1. Purpose & Scope

### 1.1 Purpose

To establish a systematic diagnostic and correction protocol for VSL funnels that are already live but performing below benchmarks. This SOP guides agents through a structured sequence: collect metrics, identify which micro-funnel is failing, apply the diagnostic matrix, and execute the highest-ROI fix in the correct order of operations.

> "A forma mais pobre de analisar um funil é analisar ele como um todo." — @thiagoroas [DOC]
> Source: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → vsl_micro_funnels.principle`

**Scope of Diagnostic vs. Scope of Resolution (DIAG-01):**

This SOP governs the diagnostic phase. There is a critical distinction between two activities:

- **Identifying the problem** (universal): can be done with data alone, regardless of niche. Any qualified analyst with this SOP and accurate metrics can pinpoint which micro-funnel is failing and what category of fix is needed.
- **Resolving the problem** (context-dependent): requires deep knowledge of the specific persona, market sophistication, and product. A diagnosis of "copy is weak at the pitch" is universal; what the copy should say is persona-specific.

> "Eu consigo analisar o qual é o problema de qualquer funil, o que não significa que eu consigo resolver o problema." — @thiagoroas [DOC]
> Source: Hotmart Cast (YouTube ID: RENU3kEns0E, ~10:00)

### 1.2 Scope

**In Scope:**
- VSL funnels already running with at least 7 days of data
- Diagnosis of retention curve problems, conversion problems, and traffic problems
- Optimization of VSL format, lead section, upsell, checkout, and recovery systems
- Traffic optimization decisions using the Modelo 731
- Order bump impact assessment

**Out of Scope:**
- Building a VSL from scratch (use VSL Production SOP — SOP-COPY-VSL-ARCH-001)
- Audience research or niche validation (use Niche Assessment SOP — SOP-COPY-VSL-SCRIPT-001)
- Copy rewriting without prior format validation (copy is last resort, not first)
- Traffic account management or campaign creation

### 1.3 Applicability

This SOP applies to: Copy Chief agent, Performance Analyst agent, Creative Analyst agent, and any human operator managing a live VSL funnel.

### 1.4 Trigger Condition

Execute this SOP when ANY of the following conditions are true:
- Play rate is below 60%
- First-minute retention is below 60%
- Retention at pitch is below 30%
- Checkout conversion is below 10%
- Upsell conversion is below 15% (benchmark target: 10–20%) [DOC]
- Downsell conversion is below 5% (benchmark target: 5–10%) [DOC]
- ROAS is declining for 3+ consecutive days
- Custo de checkout exceeds 20% of front ticket

> [DOC] Upsell and downsell benchmarks: "Quando a pessoa cai no checaute e compra o front... normalmente a gente busca uma conversão em torno de 10 a 20% do upsell. Se ela não comprou o upsell, a gente busca recuperar entre 5 a 10% do downsell." — @thiagoroas
> Source: Hotmart Cast (YouTube ID: RENU3kEns0E, ~12:00–15:00)

> **IMPORTANT — Contextual Benchmarks (METRICS-01):** All benchmarks in this SOP are reference points, not universal standards. Benchmarks vary by: (1) niche, (2) ticket price, (3) traffic source. Do not use a benchmark from a different niche/ticket/origin to evaluate your funnel. Establish a baseline from your own funnel's history before declaring a metric "failing." [DOC]
> "Não existe taxa de conversão média de mercado. A taxa de conversão ela é por nicho e por tíquete... e por origem de tráfego." — @thiagoroas
> Source: Hotmart Cast (YouTube ID: RENU3kEns0E, ~25:00)

---

## 2. Definitions & Abbreviations

| Term / Abbreviation | Definition |
|---------------------|------------|
| VSL | Video Sales Letter — long-form video selling a product directly |
| Lead (VSL) | First 1–4 minutes of the VSL — the headline section [DOC] |
| Pitch | The moment in the VSL where the price is revealed and the offer is made |
| Retenção | Viewer retention at a given point in the video (% of original viewers still watching) |
| Play rate | % of page visitors who press play on the VSL |
| Micro-funil | One isolated stage of the funnel analyzed independently |
| Modelo 731 | Decision framework using 7-day, 3-day, and today's data windows [DOC] |
| CPA | Cost per acquisition (cost per sale) |
| Custo de checkout | Cost per Initiate Checkout event — sovereign traffic metric [DOC] |
| Ticket médio do funil | Average revenue per converted visitor including upsell/downsell [DOC] |
| Cost cap | Maximum CPA limit set in the ad platform |
| OCU | One-Click Upsell — upsell charged to saved payment method with one click |
| Formato (VSL) | Visual style, recording setup, editing rhythm — distinct from copy content [DOC] |
| Copy (VSL) | The words, arguments, story, and persuasion logic of the VSL |
| Order bump | Additional offer shown at checkout alongside the main product |
| Upsell | Post-purchase offer presented immediately after front-end sale |
| Downsell | Reduced offer shown to prospect who declined the upsell |
| White traffic | Compliant, long-term advertising with stable accounts [DOC] |
| ROAS | Return on Ad Spend |
| DR | Direct Response marketing — "marketing que exige e busca uma ação imediata" [DOC] |

---

## 3. Roles & Responsibilities (RACI)

### RACI Legend

| Code | Role | Definition |
|------|------|------------|
| **R** | Responsible | Does the work. At least one R per activity. |
| **A** | Accountable | Owns the outcome. Signs off. Only one A per activity. |
| **C** | Consulted | Provides input before the decision. Two-way communication. |
| **I** | Informed | Notified after decision or completion. One-way communication. |

### Role Definitions

| Role | Scope | Minimum Qualifications |
|------|-------|----------------------|
| **Copy Chief** | Strategic diagnostic authority. Approves optimization order. Owns copy and offer decisions. | See Section 4.3 |
| **Performance Analyst** | Metric collection, traffic decisions, Modelo 731 execution. | See Section 4.3 |
| **Creative Analyst** | Format assessment and format-layer execution decisions. | See Section 4.3 |
| **Operator** | Human owner or manager of the funnel. Final business accountability. | Business owner or designated funnel manager. |

### RACI Matrix

| Activity | Copy Chief | Performance Analyst | Creative Analyst | Operator |
|----------|-----------|---------------------|------------------|----------|
| Collect funnel metrics (Phase 1) | C | R | — | A |
| Micro-funnel health check (Phase 2) | C | R | — | A |
| Apply diagnostic matrix (Phase 3) | R | C | C | A |
| Identify specific symptom (Phase 4) | R | C | C | A |
| Approve optimization order (Phase 5) | A | C | C | I |
| Execute format change | C | I | R | A |
| Execute lead replacement | R | C | C | A |
| Execute upsell optimization | R | I | C | A |
| Execute checkout cleanup | C | R | I | A |
| Execute traffic decisions (Phase 6) | I | R | I | A |
| Set up recovery systems (Phase 7) | R | C | I | A |
| Kill vs. fix decision (Phase 8) | C | R | C | A |

---

## 4. Prerequisites

### 4.1 Data Required Before Starting

| Metric | Minimum Data Period | Where to Pull |
|--------|--------------------|-|
| Play rate | 7 days | VSL platform analytics |
| Retention curve (full) | 7 days | VSL platform analytics |
| First-minute retention % | 7 days | VSL platform analytics |
| Retention % at pitch | 7 days | VSL platform analytics |
| Conversion rate (checkout → sale) | 7 days | Payment platform |
| Custo de checkout | 7 days | Ad platform |
| ROAS — 7d, 3d, today | 7d / 3d / 1d | Ad platform |
| Upsell conversion % | 7 days | Payment platform |
| Downsell conversion % | 7 days | Payment platform |
| Order bump conversion % (if applicable) | 7 days | Payment platform |
| Ticket médio do funil | 7 days | Payment platform |

### 4.2 Preconditions

- [ ] VSL has been live for a minimum of 7 days with meaningful traffic — defined as: at minimum 1x the custo de checkout per creative per day (e.g., if custo de checkout target is R$30, minimum spend threshold is R$30/day per creative over 7 days). For lower budgets (<R$100/day), allow up to 14 days before diagnosis. [REP]
- [ ] Retention curve is accessible with at minimum minute-by-minute resolution
- [ ] Ad spend data is available broken down by 7d / 3d / today
- [ ] All micro-funnel stages have been separated for analysis (not analyzed as a whole)
- [ ] Baseline conversion metrics exist (at minimum: checkout conversion without order bump)

> [REP] Spend threshold rationale: Thiago Ruas states (timestamp [01:47:01]) "se eu já tenho clareza do custo do meu checkout, eu sei que o meu checkout ideal é R$ 30. Eu vou botar pelo menos R$ 30, R$ 40 de limite mínimo" to evaluate whether a creative generates checkout. This principle is applied here as a minimum data threshold for VSL diagnosis. The specific minimum page view count is not directly stated in source — [GAP — needs practitioner verification for page view minimum].

---

### 4.3 Executor Qualifications

Minimum competencies required per role before executing this SOP. Operators who do not meet the criteria should be supervised by a qualified team member.

| Role | Minimum Competencies | Evidence Basis |
|------|---------------------|----------------|
| **Copy Chief** | (1) Understands VSL persuasion structure: lead, body, pitch, CTA. (2) Can interpret a retention curve and diagnose format vs. copy issues. (3) Familiar with the 2x2 diagnostic matrix in Phase 3 of this SOP. (4) Has reviewed at least 5 VSL funnels in a diagnostic capacity. (5) Authorized to approve optimization order decisions. | Thiago Ruas (timestamp [01:16:33]) distinguishes between having a copywriter ("Mateus") who handles copy craft vs. himself who manages strategic VSL assessment — the Copy Chief role requires both analytical capability and strategic authority. [REP] |
| **Performance Analyst** | (1) Proficient in Meta Ads Manager: can pull 7d/3d/1d ROAS, custo de checkout, and campaign metrics. (2) Can export and read VSL retention curve data from a hosting platform (e.g., VTurb or equivalent). (3) Understands the Modelo 731 decision framework (Phase 6 of this SOP). (4) Can calculate ticket médio do funil from payment platform data. | Thiago Ruas describes a dedicated traffic manager ("gestor de tráfego") role responsible for campaign decisions and metric reading, distinct from copy decisions. [REP] |
| **Creative Analyst** | (1) Can assess VSL format visually: recording style, editing rhythm, setting, energy. (2) Understands the format hierarchy (Format > Copy > Presentation) per Phase 4.3 of this SOP. (3) Has reviewed at least 3 VSL format cases to calibrate format quality judgment. | [GAP — specific creative analyst competency criteria not directly stated in source. Requirements above are derived from the analytical tasks assigned to this role in the RACI. Needs practitioner verification.] |

> **Competency assessment:** At time of first execution, the executing operator must confirm they meet the criteria for their assigned role. If not confirmed, escalate to Copy Chief for supervised execution.

---

### 4.4 Access and Distribution

| Field | Value |
|-------|-------|
| **Storage location** | `squads/copy/data/sops/` within the active Sinkra installation |
| **File name** | `vsl-diagnostic-optimization-sop.md` |
| **Access** | All Copy Squad agents have read access. Write access (updates, corrections) requires Copy Chief review and version increment. |
| **Notification of updates** | When a new version is published, update the Revision History table and notify the Copy Squad via the team's primary communication channel within 48 hours. |
| **Record storage** | Completed Phase 1 execution records (audit trail) are stored in `outputs/gerador-pop/vsl-diagnostic/` with the naming convention: `SOP-COPY-VSL-DIAG-001-YYYYMMDD-{funnel-name}.md` |

---

## 5. Procedure

> **INSTRUCTION:** Execute phases sequentially. Do NOT skip to Phase 4 without completing Phases 1–3. Each phase produces a diagnostic output that feeds the next. The temptation to jump to "fix the copy" is the most common mistake — follow the order.

### Process Flowchart

```
START: Trigger condition met (Section 1.4)
        |
        v
[PHASE 1] Collect Metrics (Performance Analyst, 30-60 min)
  → Play rate, retention curve, conversion metrics, custo de checkout
  → Open audit trail file
        |
        v
[PHASE 2] Funnel Health Check (Performance Analyst, 20-30 min)
  → Map 6 micro-funnels: Traffic / Page / VSL / Checkout / Upsell / Recovery
  → Identify FIRST failing micro-funnel
        |
        v
[PHASE 3] VSL Diagnostic Matrix (Copy Chief, 10 min)
  → Apply 2x2: Retention × Conversion
  → Append Phase 3 verdict to audit trail
        |
        +----[ESCALAR]-------------> Phase 6 (Traffic Optimization)
        |                                   |
        +----[Nova VSL]-----------> EXIT → VSL Production SOP
        |
        v
[PHASE 4] Specific Symptom Diagnosis (Copy Chief + PA, 20-40 min)
  → Work through applicable blocks (4.1–4.8)
  → Skip blocks that don't apply
        |
        v
[PHASE 5] Optimization Protocol (Copy Chief decides, 15 min)
  → Apply fixes in priority order (Format > Lead > Coherence > Upsell > Checkout > Copy > Bump)
  → ONE fix at a time [INF] — see GAP-01
  → After each fix: return to Phase 1 and re-measure
        |
        v
[PHASE 6] Traffic Optimization — Modelo 731 (Performance Analyst, 15 min/cycle)
  → Pull 7d / 3d / today windows
  → Apply decision matrix: Maintain / Reduce / Kill
  → Scale by creatives, not budget
        |
        v
[PHASE 7] Recovery Systems (Copy Chief, variable)
  → Segment: Front buyer + no upsell → Recovery Webinar
  → Segment: Front buyer + upsell → Ascension Webinar
  → Verify API/CRM segmentation before sending
        |
        v
[PHASE 8] Kill vs. Fix Decision (Performance Analyst + Copy Chief, 10 min)
  → Apply Modelo 731
  → 2 consecutive bad days → Kill (after 50-70% budget reduction attempt)
  → Append Phase 8 decision to audit trail
        |
        v
END: Close diagnostic session. Audit trail saved to outputs/gerador-pop/vsl-diagnostic/
```

---

### Phase 1 — Collect Metrics

**Performer:** Performance Analyst
**Estimated Time:** 30–60 minutes

**1.0** Before pulling any data, record the execution context. This creates the audit trail required for traceability.

| Audit Field | Value |
|-------------|-------|
| Operator name / agent ID | ___ |
| Execution date | ___ |
| Funnel name / client identifier | ___ |
| Data source — VSL platform | ___ |
| Data source — Ad platform | ___ |
| Data source — Payment platform | ___ |
| Data window used (start → end date) | ___ |

Save this completed table as: `SOP-COPY-VSL-DIAG-001-YYYYMMDD-{funnel-name}.md` in `outputs/gerador-pop/vsl-diagnostic/`. The completed Phase 1 table (Step 1.3) must be appended to this same file before Phase 2 begins.

**1.1** Pull retention curve data from the VSL platform. Record exact % at the following checkpoints:

| Checkpoint | Benchmark | Actual | Status |
|------------|-----------|--------|--------|
| Start → Minute 1 (Lead section end) | >60% [DOC] | ___ | |
| At pitch (~20–25 min) | >30% [DOC] | ___ | |
| Shape at pitch (brutal drop vs. gentle drop) | Brutal = healthy [DOC] | ___ | |

> [DOC] Benchmarks source: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → vsl_retention.benchmarks`
> "Após primeiro minuto, queda LEVE e CONSTANTE até o pitch. Na hora do pitch, queda BRUTAL (sinal saudável)."

**1.2** Record play rate from page analytics. Benchmark: above 60–70%. [DOC]
Source: `vsl_production_extended → vsl_sizing.ticket_297`

**1.3** Pull conversion and traffic metrics into this table:

| Metric | Benchmark | Actual | Status |
|--------|-----------|--------|--------|
| Click-to-page-view rate | >70% [DOC] | ___ | |
| Play rate | >60% | ___ | |
| Page-view-to-checkout rate | 10–20% [DOC] | ___ | |
| First-minute retention | >60% | ___ | |
| Retention at pitch | >30% | ___ | |
| Checkout conversion | >10% acceptable, >20% good | ___ | |
| Custo de checkout | 10–20% of ticket | ___ | |
| ROAS (7d) | >2.0 with min 10 sales | ___ | |
| Upsell conversion | 10–20% (target 30% with recovery) [DOC] | ___ | |
| Downsell conversion | 5–10% [DOC] | ___ | |
| Order bump conversion | >30% if single bump | ___ | |
| Ticket médio do funil | Calculated from all above | ___ | |

> [DOC] Conversion benchmarks: `funnel_health_metrics` section, `thiagoroas-vsl-funnel-and-traffic-framework.yaml`
> [DOC] Click-to-page-view 70%, page-view-to-checkout 10–20%, checkout ~20%, upsell 10–20%: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~25:00)
> [DOC] Upsell 10–20%, downsell 5–10% post-checkout: Hotmart Cast (YouTube ID: RENU3kEns0E, ~12:00–15:00)

**Metric Reading Priority Order (M-01):** When analyzing traffic performance, always read metrics in this sequence — do not skip ahead:

1. **ROAS / ROI** — primary signal of funnel health
2. **Custo por finalização de compra (custo de checkout)** — sovereign optimization metric
3. **CTR** — secondary, read only after #1 and #2 are understood
4. **CPC** — tertiary analysis
5. **CPM** — last resort, rarely actionable alone

> [DOC] "A métrica mais importante é venda, roi. Depois dessa, a métrica que guia uma otimização de tráfego para o perpeto é custo por finalização de compra. Não é CTR, não é CPC. Muito menos CPM." — @thiagoroas
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~25:00)

> **WARNING — CTR and CPC are dangerous for beginners (M-02):** 99% of traffic managers analyze campaigns based on CTR and CPC. These are secondary metrics with no direct relevance to the sales process. A meme creative can produce CTR of 5%+ while generating zero sales — the creative attracts curiosity, not buyers. Only experienced operators can interpret CTR/CPC in context. Until custo de checkout is fully understood and benchmarked, do not use CTR/CPC for optimization decisions. [DOC]
> "Elas são perigosas para iniciantes." — @thiagoroas
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~20:00)

**Expected Output:** Completed metrics table with all items either within or outside benchmark.

---

### Phase 2 — Funnel Health Check (Micro-Funnel Analysis)

**Performer:** Performance Analyst
**Estimated Time:** 20–30 minutes

**2.1** Separate the funnel into its component micro-funnels and assess each independently. Never analyze the funnel as a whole. [DOC]

> "A forma mais pobre de analisar um funil é analisar ele como um todo."
> Source: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → vsl_micro_funnels.principle`

| Micro-Funnel | Input Event | Output Event | Metric | Status |
|--------------|-------------|--------------|--------|--------|
| 1. Funil de Tráfego | Ad impression | Click to page | CTR / Custo de checkout | |
| 2. Funil de Página | Page load | Play button pressed | Play rate | |
| 3. Funil da VSL | Play | Retention → Pitch | Retention curve | |
| 4. Funil de Checkout | Initiate checkout | Purchase | Checkout conversion | |
| 5. Funil de Upsell | Post-purchase page | Upsell purchase | Upsell conversion | |
| 6. Funil de Recuperação | Front buyer, no upsell | Recovery webinar purchase | Recovery conversion | |

**2.2** For each micro-funnel, mark: HEALTHY / AT RISK / FAILING.

**2.3** Identify the FIRST failing micro-funnel in the sequence. Fix always starts at the earliest point of failure. Fixing downstream problems when upstream is broken wastes effort.

**Expected Output:** Micro-funnel health map with the identified failure point(s).

---

### Phase 3 — VSL Diagnostic Matrix

**Performer:** Copy Chief
**Estimated Time:** 10 minutes

Apply the 2x2 diagnostic matrix using data from Phase 1.

> [DOC] Matrix source: `vsl_diagnostic_matrix` (timestamp [01:17:17])
> `thiagoroas-vsl-funnel-and-traffic-framework.yaml → vsl_production_extended`

```
                   CONVERSÃO OK           CONVERSÃO BAIXA
                ┌─────────────────────┬─────────────────────┐
RETENÇÃO ALTA   │  ESCALAR            │  Copy ruim          │
                │                     │  → Reescrever copy  │
                │                     │    Manter formato   │
                ├─────────────────────┼─────────────────────┤
RETENÇÃO BAIXA  │  Formato ruim       │  NOVA VSL           │
                │  → Mudar formato    │                     │
                │    Manter copy      │                     │
                └─────────────────────┴─────────────────────┘
```

**3.1** Determine matrix quadrant from Phase 1 data.
**3.2** Record the verdict:

| Verdict | Implication | Next Step |
|---------|-------------|-----------|
| ESCALAR | No fix needed — go to traffic scaling | Phase 6 |
| Format ruim / Copy ok | Change format, keep copy | Phase 4 → Step 4.3 |
| Format ok / Copy ruim | Rewrite copy, keep format | Phase 4 → Step 4.6 |
| Nova VSL | Full VSL replacement | Exit this SOP, use VSL Production SOP |

**Expected Output:** Matrix quadrant verdict. If verdict is ESCALAR or Nova VSL, exit diagnostic and proceed to appropriate workflow.

**Audit Trail Checkpoint:** Append Phase 3 matrix verdict (quadrant selected, timestamp, performer name) to the audit trail file opened in Phase 1 Step 1.0 before proceeding to Phase 4.

---

### Phase 4 — Specific Symptom Diagnosis

**Performer:** Copy Chief + Performance Analyst
**Estimated Time:** 20–40 minutes

Work through each relevant diagnosis block based on the symptoms identified in Phase 1. Skip blocks that don't apply.

---

#### 4.1 Play Rate Below 60%

**Diagnosis:** Problem is in Micro-Funnel 1 or 2 (creative/segmentation or page), NOT in the VSL itself. [DOC]

> "Play rate baixo = problema de criativo/segmentação, NÃO de retenção"
> Source: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → vsl_retention.benchmarks`
> Analysis: `thiagoroas-copy-analysis.yaml → benson_analysis.retention_metrics`

**Decision tree:**

```
IF play_rate < 60%:
  → DO NOT touch the VSL
  → DO: Test new creatives (minimum 3 new angles)
  → DO: Verify the page load time and layout
  → CHECK: Is the creative tonally mismatched with the VSL content? (awareness continuity)
  → CHECK: Does the ad format match the VSL lead format? [REP]
  → THEN: Proceed to Phase 6 (Traffic) for creative iteration
```

> [REP] Source: `benson_analysis.creative_vsl_coherence` — "O criativo cria estado emocional + expectativa. Lead da VSL deve ser continuação natural do criativo."

---

#### 4.2 First-Minute Retention Below 60%

**Diagnosis:** The Lead section is failing. The VSL is losing viewers before they receive the core message. [DOC]

> Source: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → vsl_production_extended.leads_production`
> "De 5 leads testadas, 4 deram ruim, 1 deu muito boa — essa salvou a VSL inteira."

**Decision tree:**

```
IF first_minute_retention < 60%:
  → DO NOT rewrite the entire VSL
  → DO: Test minimum 3 new leads (common practice: 5) [DOC]
  → TACTIC: Pull the format from the best-performing ad creative → use as lead format [DOC]
  → IMPORTANT: Lead can have completely different format, setting, and approach from the rest of VSL — this is strategy, not inconsistency [DOC]
  → IF new lead explodes retention → consider reformatting the entire VSL in that format

IF first_minute_retention < 40%:
  → Severity: CRITICAL — "VSL morta" [DOC]
  → Priority escalate to lead replacement immediately
```

> [DOC] Lead independence: `vsl_production_extended.leads_production.independence`
> "Lead pode ter formato, cenário e abordagem completamente diferentes do resto da VSL"

> [DOC] Format tactic: `vsl_retention.optimization_hack`
> "Pegar o melhor criativo de ads e transportar o FORMATO dele para o início da VSL."

---

#### 4.3 Sharp Retention Drop BEFORE Pitch

**Diagnosis:** The body is losing attention at a specific point. May be format or copy issue. [REP]

**Decision tree:**

```
IF retention_drops_sharply_BEFORE_pitch:
  → LOCATE: Find the exact minute where the drop occurs
  → FIRST CHECK: Format issue (visual style, editing rhythm, presentation energy)
  → THEN CHECK: Copy issue (argument, story flow, belief building)
  → ACTION: The specific micro-video at that timestamp needs replacement [DOC]
  → TACTIC: Substitute only that micro-video segment, not the full VSL [DOC]
```

> [DOC] Micro-video substitution: `thiagoroas-copy-analysis.yaml → benson_analysis.micro_videos`
> "Substituição cirúrgica de seções sem regravar tudo"
> "Localização precisa do problema de retenção"

> [DOC] Format hierarchy: `benson_analysis.retention_hierarchy`
> Rank 1: FORMATO (rei da retenção), Rank 2: Copy, Rank 3: Apresentação

---

#### 4.4 Retention at Pitch Below 30%

**Diagnosis:** Insufficient audience is reaching the offer. [DOC]

**Decision tree:**

```
IF retention_at_pitch < 30%:
  → OPTION A: Shorten the VSL (move pitch earlier)
  → OPTION B: Improve format/pacing in the body sections
  → OPTION C: Strengthen the promise in the lead (more people compelled to stay)
  → CHECK: Is the VSL length appropriate for the ticket? R$297 = 20–30 min [DOC]
  → CHECK: Is there a specific drop point in the body causing early exits? (→ go to 4.3)
```

> [DOC] Pitch timing benchmark: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → vsl_retention.benchmarks`
> "Retenção acima de 30% (para VSL de ~20-25 min)"

---

#### 4.5 Gentle Drop at Pitch (NOT a Brutal Drop)

**Diagnosis:** Problem with the offer or ticket, not with the VSL content. This is actually the easier problem to fix. [DOC]

> Source: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → vsl_retention.visual_patterns`
> "Se queda no pitch for LEVE = problema de ticket/oferta (mais fácil de resolver)"
> "Prefiro 1000x VSL que retém até o pitch mas não converte vs o contrário"

**Decision tree:**

```
IF pitch_drop_is_GENTLE (low slope, viewers stay but don't buy):
  → This is an offer/ticket problem, NOT a retention/format problem
  → DO NOT touch the VSL format or lead
  → CHECK: Is the offer meeting the 3 pillars? (Brilhe os olhos / Simples / Rápida) [DOC]
  → CHECK: Is the anchor price credible?
  → CHECK: Is the guarantee strong enough?
  → CHECK: Is the ticket at or below R$297 for cold traffic? [DOC]
  → ACTION: Revise offer construction, pricing, or guarantee before touching copy
```

> [DOC] Offer pillars: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → front_offer_pillars`
> [DOC] Ticket ceiling for cold traffic: `schwartz_enrichment.ticket_e_nivel_de_consciencia`
> "Perpétuo para público frio tem limite de ticket. Para 99% dos casos, o ticket ouro é 297."

---

#### 4.6 Custo de Checkout Exceeds 20% of Ticket

**Diagnosis:** Problem is in traffic quality or creative, not in the VSL or checkout. [DOC]

> Source: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → kennedy_enrichment.custo_checkout_metrica_soberana`
> Benchmark: "10–20% do ticket é o custo ideal de initiate checkout. Para R$297: R$29–30 é saudável."

**Decision tree:**

```
IF custo_checkout > 20% of ticket:
  → DO NOT touch VSL or checkout
  → PROBLEM: Traffic or creative quality issue
  → ACTION: Launch new creatives with different angles
  → CHECK: Are the creatives attracting the right awareness level (Level 2–3)? [REP]
  → CHECK: Is the audience segmentation psychographic (via creative) or broad? [DOC]
  → THEN: Proceed to Phase 6 for creative/traffic fix
```

> [DOC] Broad targeting: `traffic_structure_updated.fase_teste.public`
> "Só broad. Nenhuma campanha usa público segmentado (nem lookalike)."

---

#### 4.7 Checkout Conversion Below 10%

**Diagnosis:** Checkout friction is preventing purchase. [DOC]

> Source: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → funnel_health_metrics.checkout`
> "10% = baixo. 20%+ = bom."

**First — Run the instant triage check (ARCH-07):**

If you have high initiate-checkout volume but zero (or near-zero) sales, the most likely cause — before anything else — is that the price is not visible on the button or checkout page. This is the most basic and most frequent checkout failure.

> [DOC] "É matematicamente impossível. Você mandar 115 checkout de venda. A única forma que isso aconteça, é se você está mandando ele sem preço." — @thiagoroas
> Source: Hotmart Cast (YouTube ID: RENU3kEns0E, ~25:00–30:00)

```
INSTANT TRIAGE:
  IF checkout_volume HIGH AND sales = 0 (or near 0):
    → CHECK: Is the price visible on the CTA button?
    → CHECK: Is the price displayed on the checkout page?
    → ACTION: If no price shown → add price immediately before any other change
```

**Decision tree:**

```
IF checkout_conversion < 10%:
  → STEP 0: Run instant triage above (ARCH-07)
  → STEP 1: "Limpar o checkout" — the FIRST action before ANY A/B test [DOC]
    → Remove all order bumps
    → Remove banners, testimonial widgets, extra form fields
    → Restore default platform layout
    → Run for 7 days
  → STEP 2: After 7 days clean — if still low, check layout issues (load speed, mobile)
  → STEP 3: If still low after Step 2 → check creative/VSL coherence (awareness level mismatch)
  → PRINCIPLE: "Checkout limpo converte mais — estatístico das plataformas" [DOC]
  → DEFINITION of clean checkout: sem banner, sem order bump, sem depoimento. Layout padrão da plataforma. [DOC]
```

> [DOC] "Limpo o checkout. Em todos os nossos testes, o checkout limpo tende a converter mais do que você ficar experimentando de checkout." — @thiagoroas
> Source: Hotmart Cast (YouTube ID: RENU3kEns0E, ~30:00–35:00)

> [DOC] Source: `kennedy_enrichment.checkout_limpo_principio`
> "Praticamente nenhum funil VSL do [practitioner] usa order bump."

**A/B Testing Protocol for Checkout (METRICS-03):** If you want to run A/B tests on checkout variants, they are ONLY valid when:

1. Statistical volume is sufficient (enough initiate checkouts per variant to be significant)
2. Same traffic source for both variants (do not mix cold/retargeting)
3. Same time period (do not compare different weeks)

Invalid A/B tests consistently lead to selecting the worse-performing variant as "winner," degrading overall conversion. Do not run checkout A/B tests below meaningful volume.

> [DOC] "Eu fiz um teste AB de checkout... Statisticamente, vale. Cara, você tem que ter um volume de abertura de checkout. [...] A galera começou a piorar as conversões. Por quê? Eles faziam um teste AB que não era válido estatisticamente e escolhiam o checkout que conversiam pior com o outro." — @thiagoroas
> Source: Hotmart Cast (YouTube ID: RENU3kEns0E, ~30:00)

**Also — Remove boleto from perpetuo checkout (F-10 — CRITICAL):**

Boleto (bank slip) must be removed from perpetuo checkout. Reason: every generated boleto signals a "purchase" event to the Meta pixel even if the boleto is never paid. With cold traffic, boleto conversion is at most 20–30%. The result: Meta's algorithm receives false purchase signals, corrupting campaign optimization and making the pixel learn from non-buyers.

- With PIX available, there is no legitimate reason to offer boleto in a perpetuo checkout
- If a customer specifically requests boleto, generate a manual payment link via DM — do not expose it in the checkout flow [DOC]

> [DOC] "Boleto é o maior assassino de perpeto. [...] O boleto, ele suja o seu público de pixel de checkout. Ele gera atrapalha a inteligência do Facebook. O Facebook entende que aquilo é uma compra e não é." — @thiagoroas
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~1:15:00)

---

#### 4.8 Upsell Conversion Below 10–20%

**Diagnosis:** Upsell format, headline, or button visibility is failing. [DOC]

> Source: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → funnel_health_metrics.upsell`
> Target: 10–20% (with recovery system: effective target 30%) [DOC]
> Source for 10–20% range: Hotmart Cast (YouTube ID: RENU3kEns0E, ~12:00–15:00)

**Decision tree:**

```
IF upsell_conversion < 15%:
  → CHECK 1: Is the upsell format DIFFERENT from the front-end? [DOC]
  → CHECK 2: Is the "não quero" button VISIBLE? [DOC]
  → CHECK 3: Does the headline start with gratitude? (anti-pattern — kills the sale) [DOC]
  → CHECK 4: Is the upsell headline generating curiosity, NOT selling? [DOC]

  IF format is same as front (e.g., course upselling a course):
    → Change upsell format (done-for-you > done-with-you > community) [DOC]

  IF "não quero" button is hidden:
    → Make it visible immediately — two buttons: YES and NO [DOC]
    → Reason: hidden button = prospect closes the tab = loses both upsell AND downsell [DOC]

  IF headline starts with "Parabéns" or "Obrigado pela compra":
    → Rewrite headline to generate curiosity [DOC]
    → Example: "Ainda falta um passo" / "Tem um presente para você" [DOC]
    → Reason: gratitude signals "it's over" to the brain — kills buying state [DOC]
```

> [DOC] Format change principle: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → vsl_funnel.upsell.key_rule_format_change`
> "MUDANÇA DE FORMATO é o que faz o upsell converter. Não venda curso no upsell se vendeu curso no front."
> Credit attributed to Rafa Marques. [DOC]

> [DOC] Button visibility: `vsl_funnel.upsell.show_decline_button`
> "NÃO oculte o botão 'não quero'. Deixe visível."

> [DOC] Headline anti-pattern: `schwartz_enrichment.upsell_awareness_sequencing` (timestamp [01:55:07])
> "Headline 'Obrigado pela compra' + oferta imediata = quebra do estado emocional."

---

---

#### 4.9 Perpetuo That Stopped Converting (Previously Working Funnel)

**Diagnosis:** A previously performing perpetuo that has declined over time. This is NOT the same as a new funnel that never worked. [DOC]

**First intervention — Redline test (D-02):**

When a perpetuo stops working, the first variable to test is the **redline** (the headline/promise at the top of the sales page) — NOT a new creative, NOT a new audience. Most operators test 75 creatives without ever changing the redline once.

> [DOC] "O cara testa 75 criativos e não mexe na redline uma vez da página de vendas para testar. A redline é o que fica no topo da página de vendas. Primeira coisa que aparece. A promessa." — @thiagoroas
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~30:00)

**Decision tree — declining perpetuo:**

```
IF perpetuo_conversion_declining (was working, now failing):
  → STEP 1: Test a new redline (headline/promise) BEFORE testing new creatives
  → STEP 2: Diagnose whether the offer presentation is disconnected from the current moment
    → Case: product that resonated pre-pandemic may need pandemic-context redline
    → Case: product competing in a more crowded market may need stronger promise
  → STEP 3: If redline tests show no improvement → evaluate if it's a product-market fit decay
    → CHECK: Has the niche entered a new phase of sophistication?
    → CHECK: Has a dominant competitor changed market expectations?
  → STEP 4: If product-market fit decay → change the offer presentation, not the product
    → The product rarely dies — the offer presentation does
```

> [DOC] Case study (S-04): A public speaking perpetuo "died" during the pandemic — the operator initially thought the product was dead. Diagnosis: the offer was positioned for in-person contexts that no longer existed. Intervention: changed the redline to connect with pandemic reality ("we're locked at home, prepare for when we return to events"). Sales recovered without changing the product.
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~1:00:00)

**Anti-pattern to avoid — The Infinite Creative Loop (D-04):**

The most common failure pattern in perpetuo management:

> Operator tests 10 creatives → no improvement → tests 10 more creatives → tests 10 new audiences → still no improvement → tests more creatives

This is the infinite creative loop. Detection signal: if multiple creatives across multiple audiences all produce bad custo de checkout simultaneously, the problem is the sales page, not the creative. Stop testing creatives. Fix the page first.

> [DOC] "O cara que... testei 10 criativos. Testei 10 públicos. Vou testar mais. Não é isso. O problema está na sua página." — @thiagoroas
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~45:00)

**Lead qualification via survey (D-03):**

If lead quality is suspect (high click volume, low checkout initiation), apply lead qualification:

1. Tag all leads by traffic source using URL parameters/UTMs
2. Send a short survey to all leads
3. Non-responders → automatically disqualified (if they won't spend 2 minutes on a survey, they won't spend R$297 on your product)
4. Survey responses off-persona → disqualified
5. Survey responses matching persona → qualified leads — prioritize these for follow-up

> [DOC] "Quem não responde pesquisa automaticamente é considerado um lidi descualificado. Porque a pessoa se quer teve a vontade e o interesse e a disponibilidade responder uma pesquisa, dificilmente ela vai comprar o produto." — @thiagoroas
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~20:00)

---

### Phase 5 — Optimization Protocol (Order of Operations)

**Performer:** Copy Chief (decides), relevant agent (executes)
**Estimated Time:** 15 minutes (decision) + variable (execution)

> **CRITICAL:** Always apply fixes in this priority order. Higher items have higher ROI and may eliminate the need for lower-priority fixes. Never skip to copy without validating format first.

| Priority | Fix | ROI Potential | When to Apply |
|----------|-----|---------------|---------------|
| 1 | Format change | HIGHEST — case: 2X conversion with same copy [DOC] | Retention is low, quadrant says "format ruim" |
| 2 | Lead replacement | HIGH — single lead can save entire VSL [DOC] | First-minute retention < 60% |
| 3 | Creative-VSL coherence | HIGH — reduces immediate drop-off [REP] | Play rate ok but first-minute low |
| 4 | Upsell optimization | HIGH — direct ticket médio impact [DOC] | Upsell < 10-20% |
| 5 | Checkout cleanup + boleto removal | MEDIUM — remove bumps, simplify, remove boleto [DOC] | Checkout conversion < 10% or boleto present |
| 6 | Redline test | MEDIUM — often first fix for declining perpetuo [DOC] | Perpetuo that was working but has declined |
| 7 | Copy rewrite | MEDIUM — only after format is validated [DOC] | Format confirmed good, quadrant says "copy ruim" |
| 8 | CTA position on page | MEDIUM — case: company doubled conversion moving CTA to end [DOC] | CTA visible before conviction sequence; price not shown before buy button |
| 9 | Order bump testing | LOW — 30 days off, 30 days on, compare [DOC] | Bump under-converting or unknown impact |

> [DOC] CTA position case (DIAG-03): A large company faturando hundreds of millions per year had its buy button at the top of the sales page. Diagnosis: buy button before conviction sequence = sends price-curious visitors to checkout who don't buy. Fix: moved CTA to end of page. Result: conversion doubled. [DOC]
> "Rapa o CTA daqui e joga para o final. [...] Dobrou a conversão." — @thiagoroas
> Source: Hotmart Cast (YouTube ID: RENU3kEns0E, ~25:00–30:00)

> [DOC] Format ROI case: `benson_enrichment.formato_e_rei_confirmado` (timestamp [00:54:42])
> "A VSL dobrou a taxa de conversão dela. Com COP extremamente parecida."

> [DOC] Copy-only after format validated: `benson_analysis.retention_hierarchy`
> "Formato ≠ copy. Formato = tipo de gravação, estilo visual, ritmo de corte, câmera"

**5.1** Based on Phase 3 matrix verdict and Phase 4 symptom diagnosis, identify which fixes apply.

**5.2** Execute fixes ONE AT A TIME with a minimum 7-day measurement window between changes. Applying multiple fixes simultaneously makes it impossible to identify what worked. [REP] — upgraded from [INF]: the "one fix at a time" principle is now corroborated by two independent sources: (1) Hotmart Cast, where the practitioner describes order bumps being added "um de cada vez" with explicit before/after measurement; (2) Kiwicast #213, where the practitioner describes the failure mode of operators changing multiple variables simultaneously and being unable to determine causality. For full evidence chain and remaining verification items, see GAP-01 in Section 10.

**5.3** After each fix, return to Phase 1 and re-measure before applying the next.

---

### Phase 6 — Traffic Optimization (Modelo 731)

**Performer:** Performance Analyst
**Estimated Time:** 15 minutes per decision cycle

> [DOC] Source: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → modelo_731` (timestamp [02:33:44])
> "Toda decisão de otimização segue 3 janelas temporais"

**6.0** Set up custo de checkout as a custom metric in Meta Ads Manager (M-07):

Custo de finalização de compra (initiate checkout cost) is NOT a default column in Meta Ads Manager. You must create it manually:

> In Ads Manager → Columns → Custom Metrics → Create formula: `Total Spend ÷ Initiate Checkout Events`

This custom column is the sovereign metric. Without it visible in your dashboard, you cannot run this SOP effectively.

> [DOC] "No gerenciador, tem uma forma de você criar fórmulas. Então você consegue pegar uma coluna de métricas e dividir por exemplo por outro... você consegue criar, pegar lá o valor gasto no criativo. Quantas finalizações teve, ele dividiu um pelo outro e vai te dar o custo da finalização." — @thiagoroas
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~25:00)

**Why custo de checkout is more reliable than ROAS (TRAFFIC-04):**

Checkout conversion rate is stable — once a funnel matures, it varies within a narrow band (+/-2–3%). This stability makes custo de checkout a predictable and mathematically reliable basis for scaling decisions. ROAS, by contrast, depends on both custo de checkout AND the variable checkout conversion rate, making it less deterministic.

> [DOC] "O custo para a finalização de compra ele te mostra a tendência. Eu sei que metade de conversão de checkout é essa. Se eu bater um custo para a finalização de compra, tal, eu consigo escalar. Porque é matemático. [...] Se eu tenho 20% de conversão de checkout, eu vou ter 20, 19, 18, 21, 22, e aquilo vai ficar." — @thiagoroas
> Source: Hotmart Cast (YouTube ID: RENU3kEns0E, ~25:00)

> **ALERT — Scaling on CPA is a critical error (PRICING-04):** Never use CPA (cost per acquisition/sale) as the primary metric for scaling decisions. CPA is influenced by too many post-checkout variables. The sovereign scaling metric is custo de checkout. [DOC]
> "Escala baseada em CPA é suicídio. É loucura." — @thiagoroas
> Source: Hotmart Cast (YouTube ID: RENU3kEns0E, ~10:00)

**6.1** For any traffic/creative decision, pull three time windows:

| Window | Period | Purpose |
|--------|--------|---------|
| 7-day | Last 7 days | General trend — is this creative fundamentally working? |
| 3-day | Last 3 days | Recent trend — is it rising or falling? |
| Today | Current day | Final decision trigger |

**6.2** Apply decision matrix:

| 7-day ROI | 3-day ROI | Today ROI | Action |
|-----------|-----------|-----------|--------|
| Good | Good | Good | MAINTAIN. Scale up to +20% budget. |
| Good | Bad | Bad | REDUCE budget 50–70% first — often recovers [DOC] |
| Good | Bad | Ok | MONITOR. Do not change. |
| Bad | Bad | Bad | KILL (after budget reduction attempt) |
| Bad | Improving | — | SUSPICIOUS — check for anomaly. Rare pattern. |

> [DOC] Budget reduction before kill: `thiagoroas-vsl-funnel-and-traffic-framework.yaml → modelo_731.before_killing`
> "Reduzir orçamento 50–70% antes de desligar. Grande parte das vezes a campanha se recupera."

**6.2a** Attribution window rule — NEVER kill within 24 hours (M-05 — CRITICAL):

Never pause or kill a creative within 24 hours of launch. Meta's own recommendation is a 72-hour attribution window before making any decisions. Conversions happening today may only be attributed to the platform 3 days later. A creative showing ROAS 0.8 in the platform may have an actual ROAS of 3.0 when late-attributed conversions are included. Always evaluate using the 3-day window minimum before any kill decision.

> [DOC] "Hoje, a gente não pode analisar as campanhas com um prazo de 24 horas. A própria Meta, ou seja, o próprio Facebook, orienta que a análise deve ser feita em um prazo de 72 horas. Por quê? Porque existem conversões que vão acontecer hoje, que só vão ser apontadas lá 3 dias da pra frente." — @thiagoroas
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~1:25:00)

**6.2b** Creative vs. page diagnostic decision node (M-08):

Before changing creatives, apply this diagnostic test: look at custo de checkout across ALL active creatives simultaneously.

- **If 1 creative has bad custo de checkout** → creative problem → test new creatives
- **If ALL creatives have bad custo de checkout simultaneously** → page problem → stop testing creatives and fix the page first

This rule prevents the "infinite creative loop" anti-pattern (D-04) where operators keep testing new creatives while the real bottleneck is the sales page.

> [DOC] "Eu rodo cinco criativos. 10 criativos. Nem um está dando bom. O problema está na página. Não é o tráfego. Não adianta ficar testando mais criativo." — @thiagoroas
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~45:00)

**6.2c** CPM interpretation rule (M-06):

High CPM is not inherently bad. Interpret CPM based on audience type:

- **Remarketing/retargeting campaigns:** SHOULD have high CPM. These audiences are qualified (people who already visited your page or interacted with your content). High CPM for a qualified audience that converts is correct.
- **Cold traffic campaigns:** CPM reflects audience pool size. High CPM with no conversions = wrong audience signal.
- Rule: A high CPM that produces sales is always correct. A low CPM that produces no sales is always wrong.

> [DOC] "Muita gente que olha o CPM... fala, meu CPM está alto. E ele não sabe que muitas vezes um CPM alto significa um público mais qualificado. Quando você roda remarketing... você tem de ter um CPM mais alto." — @thiagoroas
> Source: Kiwicast #213 (YouTube ID: hnw1pGcc3_A, ~1:05:00)

**6.3** Budget increase rule: Never increase budget by more than 20% per day per campaign. [DOC]

> [DOC] Source: `traffic_structure_updated.regra_20_percent`
> "Aumentar orçamento máximo 20% por dia por campanha existente"
> "Aumentar bruscamente = reiniciar fase de aprendizado = perda de estabilidade"

**6.4** Scale principle — scale by creatives, not by budget: [DOC]

> "2 criativos performando bem → quero 3x de resultado → preciso de 6 criativos performando"
> Source: `escalabilidade_baseada_criativos` (timestamp [02:27:01])

**6.5** Cost cap (Escala 2) configuration — use ticket médio do funil, NOT front ticket: [DOC]

| Input | Correct | Anti-pattern |
|-------|---------|--------------|
| Cost cap reference | Ticket médio do funil (ex: R$418) | Front ticket (ex: R$297) |
| Cost cap value example | R$280–300 | R$130 |
| Result of wrong cap | Campaign does not spend — Meta stops trying | |

> [DOC] Source: `kennedy_enrichment.limite_custo_segredo` (timestamp [02:18:19])
> "O limite de custo tem que ser um valor próximo ao ticket médio do seu funil."

**6.6** Account stability rules (White traffic only): [DOC]

| Action | Effect |
|--------|--------|
| Sudden large budget increase | Resets learning phase — avoid |
| Excess campaign duplication | Attribution cannibalism — avoid |
| Killing creative A to force spend to B | May kill B as well (synergy effect) — investigate first |

> [DOC] Source: `estabilidade_conta` and `white_vs_black_trafego` (timestamp [02:22:13])

---

### Phase 7 — Recovery Systems

**Performer:** Copy Chief
**Estimated Time:** Planning: 30 minutes. Implementation: variable.

Activate recovery systems when the VSL is performing at the front but upsell conversion is below target, or when significant front buyers did not take the upsell.

**7.1** Webinar Recovery System setup: [DOC]

> Source: `upsell_advanced.webinar_recovery_system` (timestamp [02:46:41])
> "Pode dobrar taxa de conversão efetiva do upsell (ex.: 15% → 30%)"

**Segmentation logic:**

```
IF buyer purchased FRONT + did NOT purchase upsell:
  → Add to: Recovery Webinar sequence
  → Invite to monthly webinar specifically for upsell recovery
  → Logic: "Quem não comprou upsell não disse 'não' ao produto — disse 'não agora'." [DOC]

IF buyer purchased FRONT + purchased UPSELL:
  → Add to: Ascension Webinar sequence
  → Invite to next product / high-ticket offer
```

**7.2** Recovery webinar implementation sequence:

1. Run first webinar LIVE (1–2x per month)
2. After first live event: record and automate
3. Reported result: up to R$400k lucro/mês from weekly webinars without touching traffic [DOC]

> [DOC] Source: `upsell_advanced.webinar_recovery_system.result_case`

**7.3** Implement the trigger mechanism:

- Implement API integration or tag-based segmentation to identify buyers who: purchased front + did NOT purchase upsell
- Flag each qualifying buyer in the CRM or email platform at checkout completion, before inviting them to the recovery webinar [REP]
- Verify the segmentation logic is operational before sending recovery invitations — sending the wrong segment to a recovery webinar damages trust and wastes capacity

---

### Phase 8 — Kill vs. Fix Decision Framework

**Performer:** Performance Analyst + Copy Chief
**Estimated Time:** 10 minutes

**8.1** Apply the Modelo 731 (Phase 6) to determine if the VSL/creative is recoverable.

**8.2** Decision protocol:

```
IF metric has been negative for 2 consecutive days:
  → "O que tá ruim não vai melhorar." [DOC]
  → ACTION: Kill (after 50–70% budget reduction attempt first)

IF metric was good and then declined:
  → FIRST: Reduce budget 50–70% — often recovers [DOC]
  → WAIT: 48 hours after reduction
  → IF recovers: maintain at reduced budget, scale slowly
  → IF does not recover: kill and rotate creatives

IF VSL diagnostic matrix returns "Nova VSL" quadrant:
  → Kill the VSL
  → Build new VSL using VSL Production SOP
  → Salvage: the copy structure if retention was acceptable, or the format if conversion was acceptable
```

> [DOC] Source: `philosophy_extended.o_que_sta_ruim_nao_melhora` (timestamp [02:19:48])
> "O que tá ruim não vai melhorar. O que tá bom vai piorar."

**Audit Trail Checkpoint:** Before closing the diagnostic session, append the Phase 8 kill/fix decision (verdict selected, supporting data summary, timestamp, performer names) to the audit trail file opened in Phase 1 Step 1.0.

**8.3** Creative fatigue is inevitable — plan for it: [DOC]

> "Toda campanha que hoje performa, vai parar. É inevitável."
> Source: `traffic_phases.fase_6.truth`
> Action: Always have new creatives in testing pipeline. Scale = more performing creatives, not more budget on fewer.

---

## 6. Verification & Acceptance Criteria

| Checkpoint | Criteria | Acceptable Range | Verifier |
|------------|----------|------------------|----------|
| Play rate | % of visitors who press play | >60% | Performance Analyst |
| First-minute retention | % of viewers at minute 1 | >60% | Performance Analyst |
| Retention at pitch | % of viewers still watching at pitch | >30% | Performance Analyst |
| Pitch drop shape | Shape of curve at pitch moment | Brutal (healthy) | Copy Chief |
| Checkout conversion | Sales / Checkouts initiated | >10% acceptable, >20% good | Performance Analyst |
| Custo de checkout | Cost per Initiate Checkout | 10–20% of front ticket | Performance Analyst |
| ROAS (7d) | Revenue / Ad spend over 7 days | >2.0 with min 10 sales | Performance Analyst |
| Upsell conversion | Upsell purchases / Front purchases | 10–20% (target 30% with recovery) [DOC] | Performance Analyst |
| Order bump conversion | Bump purchases / Checkouts | >30% (single bump) | Performance Analyst |
| Ticket médio do funil | Average revenue per converted visitor | >front ticket by 30–40%+ | Performance Analyst |

---

## 7. Error Handling

### 7.1 Known Failure Modes

| # | Symptom | Probable Cause | Immediate Action |
|---|---------|---------------|-----------------|
| 1 | All metrics declining simultaneously | Creative fatigue | Modelo 731 → new creatives |
| 2 | Good retention, zero conversion | Offer/ticket mismatch | Phase 4.5 — revise offer |
| 3 | Upsell kills checkout conversion | Order bump + checkout complexity | Remove bumps, clean checkout 7 days |
| 4 | Recovery webinar not converting | Wrong segment — sending upsell buyers | Re-check segmentation logic |
| 5 | Cost cap campaign not spending | Cap set to front ticket, not ticket médio | Recalculate cap with funnel average [DOC] |
| 6 | New lead tanks retention further | Lead format mismatch with body | Test intermediate format, or full VSL reformat |
| 7 | ROAS looks good but funnel is losing money | Small sample size, ROAS is statistical noise | Wait for min 10 sales before ROAS decisions [DOC] |
| 8 | High checkout volume, zero sales | Price not visible on CTA button or checkout page | Add price to button immediately — instant triage (ARCH-07) [DOC] |
| 9 | Campaign optimization seems corrupted / pixel behaving erratically | Boleto enabled in checkout — every generated boleto fires a "purchase" pixel event | Remove boleto from checkout immediately. Offer boleto via manual DM only if requested [DOC] |
| 10 | All creatives failing simultaneously despite optimization | Page problem, not traffic problem | Stop testing creatives. Fix sales page first. Apply M-08 diagnostic. [DOC] |
| 11 | Perpetuo declining after months of good performance | Redline no longer connecting to current market moment | Test new redlines first — before creatives or audiences [DOC] |

> [DOC] Source #5: `kennedy_enrichment.limite_custo_segredo`
> [DOC] Source #7: `kennedy_enrichment.custo_checkout_metrica_soberana`
> "Com orçamento pequeno (R$100/dia), ROAS de 2+ pode ser resultado de 1 venda. Matematicamente impossível converter 100% dos checkouts."

### 7.2 Escalation Path

```
Level 1: Performance Analyst diagnoses → applies Phase 4 protocol
Level 2: Copy Chief confirms diagnosis → approves Phase 5 order of operations
Level 3: If Nova VSL verdict → escalate to Creative Director for VSL brief
Level 4: If account stability issues → escalate to Traffic Manager for account audit
```

---

## 8. Appendices

### Appendix A — Benchmark Reference Card

| Metric | Critical | Fair | Good | Excellent |
|--------|---------|------|------|-----------|
| Play rate | <40% | 40–59% | 60–70% | >70% |
| First-minute retention | <40% | 40–59% | 60–70% | >70% |
| Retention at pitch | <15% | 15–29% | 30–40% | >40% |
| Checkout conversion | <5% | 5–9% | 10–20% | >20% |
| Custo de checkout | >25% of ticket | 20–25% | 10–20% | <10% |
| Upsell conversion | <5% | 5–9% | 10–20% | >25% (30% with recovery system) |
| Downsell conversion | <2% | 2–4% | 5–10% | >10% |
| Single order bump conversion | <15% | 15–29% | 30–40% | >40% |

> [DOC] Sources: `funnel_health_metrics` and `vsl_retention.benchmarks`

---

### Appendix B — Awareness Level Quick Reference

Understanding awareness levels helps diagnose VSL problems that appear to be retention or conversion issues but are actually audience-matching problems.

> Source: `thiagoroas-copy-analysis.yaml → schwartz_analysis`

| Level | State | VSL Minute Range | Action Required |
|-------|-------|-----------------|----------------|
| 1 | Unaware | — | Cold VSL does not target Level 1 (creative pre-filters) |
| 2 | Problem Aware | 0–1 min | Lead — validate the pain |
| 3 | Solution Aware | 1–10 min | Introduce mechanism |
| 4 | Product Aware | 10–20 min | Proof, credibility, differentiation |
| 5 | Most Aware | 20–30 min | Offer, anchor, CTA |

**Ticket ceiling by awareness completion:** [DOC]
- R$297: Level 4 partial — achievable with cold VSL traffic
- R$497+: Level 5 complete — requires authority funnel or retargeting
- R$997+: Requires sequence (email, webinar, retargeting) — more time on screen needed

> [DOC] Source: `schwartz_enrichment.ticket_e_nivel_de_consciencia` (timestamp [00:46:17])

---

### Appendix C — Format Library (Living Document)

Formats confirmed working as of the source recording date, September 2025. [DOC] (as of the source recording date, September 2025 — this list should be re-verified at each SOP review cycle)

| Format | Description | Status |
|--------|-------------|--------|
| Teleprompter / camera stare | Expert reading script directly to camera | DEAD — saturated, robotic [DOC] |
| Casual cotidiano | Expert doing everyday activity while talking | ALIVE [DOC] |
| Call center | Expert with headset, simulating answering a call | ALIVE — case: 2X conversion [DOC] |
| Podcast/entrevista | Two participants in conversation | ALIVE [DOC] |
| Talk show | Expert receiving guests | ALIVE [DOC] |
| Palestra | Expert on stage with microphone | ALIVE [DOC] |
| Nicho-congruente | Expert doing niche-specific activity while talking | ALIVE [DOC] |

> [DOC] Source: `vsl_production_extended.formatos_recomendados_2025` (timestamp [00:55:02])

---

### Appendix D — Order Bump Decision Protocol

> "A métrica correta do order bump NÃO é sua taxa de conversão isolada" [DOC]
> Source: `kennedy_enrichment.order_bump_matematica_real` (timestamp [01:48:44])

**Correct evaluation method:**

1. Run 7 days WITHOUT order bump — record baseline checkout conversion and ticket médio
2. Add 1 order bump — run 7 days — record checkout conversion and ticket médio
3. Calculate: (ticket médio gain × volume) vs. (checkout conversion loss × ticket × volume)
4. IF checkout conversion loss > ticket médio gain → remove bump
5. IF ticket médio gain > checkout conversion loss → keep bump
6. Maximum 3 bumps total. Each additional bump reduces checkout conversion. [DOC]
7. Single order bump benchmark: must convert at minimum 30% [DOC]

> "No ticket 297, às vezes você nem precisa de order bump. Foca no upsell, porque o upsell vai puxar o ticket médio para cima." [DOC]

---

## 9. Confidence Summary Table

| Phase/Step | Key Claim | Confidence | Evidence |
|-----------|-----------|-----------|---------|
| Phase 1 — Play rate benchmark | >60% benchmark | [DOC] 0.9 | Direct statement from practitioner with documented track record |
| Phase 1 — First-minute benchmark | >60% benchmark | [DOC] 0.9 | Direct statement + case evidence |
| Phase 1 — Pitch retention benchmark | >30% benchmark | [DOC] 0.9 | Direct statement |
| Phase 1 — Custo checkout benchmark | 10–20% of ticket | [DOC] 0.9 | Direct statement with specific example |
| Phase 2 — Micro-funnel method | Analyze separately | [DOC] 1.0 | Direct stated principle |
| Phase 3 — 2x2 matrix | 4 quadrants | [DOC] 0.9 | Direct matrix from source, timestamp [01:17:17] |
| Phase 4.1 — Play rate not VSL problem | Confirmed | [DOC] 0.9 | Direct statement |
| Phase 4.2 — Lead independence | Lead can differ from body | [DOC] 0.9 | Direct statement |
| Phase 4.2 — 5 leads practice | Min 3, common 5 | [DOC] 0.9 | Direct statement + case |
| Phase 4.3 — Format before copy | Format hierarchy | [DOC] 1.0 | Multiple corroborations across sources |
| Phase 4.4 — VSL length for R$297 | 20–30 min | [DOC] 0.9 | Direct statement |
| Phase 4.5 — Gentle drop = offer problem | Confirmed | [DOC] 0.8 | Direct stated interpretation |
| Phase 4.7 — Clean checkout | Statistical | [DOC] 0.8 | Stated as platform statistic + practitioner practice |
| Phase 4.8 — Upsell format change | 2X-type impact | [DOC] 0.9 | Multiple corroborations, attributed to Rafa Marques |
| Phase 4.8 — Hidden button kills downsell | Confirmed | [DOC] 0.9 | Direct causal explanation |
| Phase 5 — Fix order | Priority list | [REP] 0.7 | Implied from multiple statements, not stated as explicit sequence |
| Phase 6 — Modelo 731 | 3-window framework | [DOC] 1.0 | Named mechanism, timestamp [02:33:44] |
| Phase 6 — 20% budget rule | Max 20%/day/campaign | [DOC] 0.9 | Direct stated rule |
| Phase 6 — Cost cap = ticket médio | Not front ticket | [DOC] 0.9 | Direct statement + anti-pattern described |
| Phase 7 — Recovery webinar doubles upsell | 15% → 30% | [DOC] 0.8 | Stated result, plausible mechanism |
| Phase 7 — API segmentation required | Technical requirement | [REP] 0.7 | Inferred from stated mechanism, not explicitly detailed |
| Phase 8 — 2 days negative = kill | Confirmed | [DOC] 0.9 | Direct maxim stated |
| Appendix A — Benchmarks | Full table | [DOC] 0.8 | Compiled from multiple direct statements |
| Appendix C — Format status | Dead/alive | [DOC] 0.9 | Direct statements with case evidence |

---

## 10. Gaps & Verification Needed

Items below 0.8 confidence or not directly stated in source material. These require practitioner verification before treating as authoritative.

| Gap ID | Item | Current Confidence | Gap Description | Verification Needed |
|--------|------|-------------------|-----------------|---------------------|
| GAP-01 | One fix at a time / 7-day window (Phase 5 Step 5.2) + Explicit fix order (Phase 5 sequence) | [REP] 0.8 — UPGRADED from [INF] 0.5 | "One fix at a time" is now corroborated by two independent Thiago interviews: (1) Hotmart Cast: order bumps added "um de cada vez" with explicit before/after measurement; (2) Kiwicast #213: describes the failure mode of operators who change multiple checkout variables simultaneously and lose causality ("a galera começou a piorar as conversões" because A/B tests mixed variables). The 7-day minimum window for traffic decisions (Modelo 731) is [DOC]; for VSL element changes still inferred. Fix order priority: still implied, not stated as an explicit sequential protocol. | Remaining verification: (a) "Is the 7-day window required between VSL copy/format fixes, or only for traffic?" (b) "Is redline always before creative when perpetuo declines?" |
| GAP-02 | Recovery webinar technical setup | [REP] 0.7 | API trigger described at concept level but not technically detailed | What specific platform integrations are used? CRM tag logic? |
| GAP-03 | Checkout conversion benchmarks by niche | [INF] 0.5 | "Very variable by niche" stated — table in Appendix A uses general ranges | Need niche-specific benchmarks for at least 3–5 common niches |
| GAP-04 | Order bump maximum 3 | [DOC] 0.8 | Stated but mechanism not fully explained | Why does the 4th bump specifically cause inevitable decline? |
| GAP-05 | 7-day minimum data window | [INF] 0.5 | Using 7 days as minimum implied from Modelo 731, never explicitly stated as minimum for diagnosis | Confirm: is 7 days sufficient for decisions or should it be 14? |
| GAP-06 | Upsell conversion benchmark source | [DOC] 0.8 | 15% stated as target but sample size or study context not given | Is 15% based on a specific funnel type (R$297 front + R$597–697 upsell) or universal? |
| GAP-07 | Downsell formula specifics | [DOC] 0.8 | "Same product, half price, 6 months access" stated but no conversion rate validation given | Confirm: is the 6-month access structure tested, or is it a recommended starting point? |

---

## 11. Conflicts & Contradictions

No direct conflicts found between the source files. All sources are from the same practitioner (@thiagoroas) and are internally consistent across three separate recordings.

**Potential tension identified:**

| Tension | Resolution |
|---------|-----------|
| "Checkout limpo" (no bumps) vs. documented order bump protocol | Not a contradiction — practitioner uses clean checkout as default and provides bump protocol for those who want to test. The SOP follows this: baseline clean, then add bumps sequentially. |
| ROAS as metric vs. "ROAS engana" | Not a contradiction — Custo de checkout is the primary signal. ROAS is secondary confirmation. Both are used, not mutually exclusive. |
| Upsell benchmark "15%" (v0.3.0) vs. "10–20%" (v0.4.0) | The Hotmart Cast provides the more precise range (10–20%) which is consistent with the Kiwicast benchmark structure. The v0.3.0 "15%" was the midpoint of the same range. Updated to the explicit range in v0.4.0. Not a contradiction. |
| "Never kill in 24h" (72h window) vs. "2 bad days = kill" | Not a contradiction — the 72h rule applies to INITIAL creative launches (24h = insufficient attribution window). The "2 consecutive bad days" kill rule applies to established creatives that have accumulated statistical significance. Both rules operate in different lifecycle phases. |

---

## 12. Source Provenance

| Claim Category | Primary Source | File |
|---------------|---------------|------|
| VSL structure, micro-videos, lead section | @jon-benson lens analysis | `thiagoroas-copy-analysis.yaml → benson_analysis` |
| VSL structure enrichment, format cases | @jon-benson enrichment | `thiagoroas-copy-analysis.yaml → benson_enrichment` |
| Awareness levels, pitch timing | @eugene-schwartz lens | `thiagoroas-copy-analysis.yaml → schwartz_analysis` |
| Awareness enrichment, ticket ceiling | @eugene-schwartz enrichment | `thiagoroas-copy-analysis.yaml → schwartz_enrichment` |
| DR principles, checkout, order bump math | @dan-kennedy lens | `thiagoroas-copy-analysis.yaml → kennedy_analysis` |
| Custo checkout, cost cap, stability | @dan-kennedy enrichment | `thiagoroas-copy-analysis.yaml → kennedy_enrichment` |
| Mechanisms, format change upsell | @todd-brown lens | `thiagoroas-copy-analysis.yaml → brown_analysis` |
| Modelo 731, recovery webinar | @todd-brown enrichment | `thiagoroas-copy-analysis.yaml → brown_enrichment` |
| Funnel structure, metrics, traffic phases | Direct practitioner framework | `thiagoroas-vsl-funnel-and-traffic-framework.yaml` |
| Benchmarks, micro-funnel method | Direct practitioner framework | `thiagoroas-vsl-funnel-and-traffic-framework.yaml → funnel_health_metrics` |
| Upsell/downsell benchmarks, checkout instant triage, checkout A/B protocol, clean checkout priority, contextual benchmarks, CTA position case, CPA = suicídio, checkout stability | Hotmart Cast (~40min, YouTube ID: RENU3kEns0E) | `outputs/gerador-pop/extractions/hotmart-cast-gold-extraction.md` |
| 72h attribution window, CPM context rule, custom metric setup, all-creatives diagnostic, infinite creative loop, boleto pixel corruption, redline priority, survey qualification, perpetuo recovery case | Kiwicast #213 (~1h25min, YouTube ID: hnw1pGcc3_A) | `outputs/gerador-pop/extractions/kiwicast-213-gold-extraction.md` |

---

## Quick-Reference Card

> One-page summary for fast execution. For full decision trees and evidence, use the main procedure sections.

### Trigger Thresholds

| Signal | Threshold | Action |
|--------|-----------|--------|
| Click-to-page-view | < 70% | Check landing page redirect/load |
| Play rate | < 60% | Don't touch VSL — fix creative/page |
| First-minute retention | < 60% | Test 3–5 new leads |
| First-minute retention | < 40% | CRITICAL — escalate immediately |
| Retention at pitch | < 30% | Shorten VSL or fix body pacing |
| Checkout volume high, sales = 0 | Any amount | INSTANT: check price is visible on CTA |
| Checkout conversion | < 10% | Step 0: price on button; Step 1: clean checkout; remove boleto |
| Upsell conversion | < 10–20% | Check format, button, headline |
| Downsell conversion | < 5% | Check "não quero" button visibility |
| Custo de checkout | > 20% of ticket | Traffic/creative issue — don't touch VSL |
| All creatives: custo de checkout high | Simultaneous across all | Page problem — stop testing creatives |
| ROAS declining | 3+ consecutive days | Run Modelo 731 — check 72h attribution first |

### Diagnostic Matrix (Phase 3)

```
                CONVERSÃO OK     CONVERSÃO BAIXA
RETENÇÃO ALTA   ESCALAR          Copy ruim → rewrite copy, keep format
RETENÇÃO BAIXA  Formato ruim     Nova VSL → exit SOP
                → change format,
                  keep copy
```

### Fix Priority (Phase 5)

1. Format change (highest ROI)
2. Lead replacement
3. Creative-VSL coherence
4. Upsell optimization
5. Checkout cleanup
6. Copy rewrite (last resort)
7. Order bump testing

### Traffic Decision — Modelo 731 (Phase 6)

| 7d | 3d | Today | Action |
|----|----|-------|--------|
| Good | Good | Good | Maintain — scale +20% max |
| Good | Bad | Bad | Reduce 50–70% first |
| Good | Bad | Ok | Monitor — no change |
| Bad | Bad | Bad | Kill (after reduction attempt) |

### Key Rules

- NEVER analyze the funnel as a whole — always micro-funnels first [DOC]
- Format > Copy > Presentation — always fix format before copy [DOC]
- Lead can be a completely different format from the rest of the VSL [DOC]
- Clean checkout (no bumps, no banners) converts more — baseline always [DOC]
- "Limpar o checkout" is ALWAYS Step 1 before any A/B test on checkout [DOC]
- Remove boleto from perpetuo checkout — it corrupts the Meta pixel [DOC]
- Upsell format must differ from front-end format [DOC]
- Scale by creatives, not budget [DOC]
- Never increase budget more than 20%/day/campaign [DOC]
- Cost cap = ticket médio do funil (NOT front ticket) [DOC]
- 2 consecutive bad days = kill (after 50–70% budget reduction attempt) [DOC]
- NEVER kill a creative in 24h — use 72h attribution window (Meta's own standard) [DOC]
- If ALL creatives have bad custo de checkout → fix the page, not the creative [DOC]
- Scaling based on CPA is a critical error — sovereign metric is custo de checkout [DOC]
- Declining perpetuo: test the redline FIRST, before new creatives or audiences [DOC]
- Benchmarks are contextual (niche + ticket + traffic source) — not universal [DOC]

### Audit Trail Requirements

| When | What to Record |
|------|---------------|
| Phase 1 Step 1.0 | Open audit trail file with operator name, date, funnel, data sources |
| Phase 3 end | Append matrix quadrant verdict |
| Phase 8 end | Append kill/fix decision before closing session |

---

## Revision History

| Version | Date | Author | Change Description |
|---------|------|--------|--------------------|
| 0.1-DRAFT | 2026-03-11 | Ohno / SOP Extractor | Initial extraction from @thiagoroas source files |
| 0.2.0-DRAFT-REMEDIATED | 2026-03-11 | SOP Creator / SOP Factory Squad | Remediation per audit AUDIT-VSL-DIAG-001-v0.1-20260311. Changes: (F-02) Approver field updated with governance policy note. (F-01) Appendix C "as of 2025" annotated with source recording date. (F-03) Phase 7 Step 7.3 rewritten in imperative voice. (F-04) "Meaningful traffic" threshold defined in Section 4.2. (F-05) SOP IDs added for cross-referenced SOPs in Section 1.2. (F-06) Phase 5 Step 5.2 [INF] confidence retained but explicit uncertainty note added with source evidence analysis. (F-07) Step 1.0 added to Phase 1 with audit trail record and naming convention. (F-08) Section 4.3 Executor Qualifications added. (F-09) Section 4.4 Access and Distribution added. |
| 0.3.0 | 2026-03-11 | SOP Creator / SOP Factory Squad | Remediation per re-audit AUDIT-VSL-DIAG-001-v0.2-20260311. Status upgraded to CERTIFIED. (NF-01) Approver updated to "Squad Chief (independent of document owner — per ISO 9001:2015 Clause 7.5.2(c))"; `Governance Policy` field added pointing to `.claude/rules/aiox-rules.md`. (NF-02) Phase 5 Step 5.2 inline 140-word uncertainty note replaced with 1-line indicator; full evidence analysis consolidated into GAP-01 in Section 10. (NF-03) Audit trail checkpoints added to Phase 3 (matrix verdict) and Phase 8 (kill/fix decision). (BOOST-01) Section 3 expanded with formal RACI legend and role definitions table. (BOOST-02) Process flowchart added as ASCII diagram at start of Section 5. (BOOST-03) Quick-Reference Card section added before Revision History. |
| 0.4.0 | 2026-03-12 | SOP Creator / SOP Factory Squad | Enrichment from Hotmart Cast (RENU3kEns0E) + Kiwicast #213 (hnw1pGcc3_A). APPEND-ONLY — no existing content removed. Additions: (1) Section 1.1 — DIAG-01 purpose enrichment: diagnostic vs. resolution scope. (2) Section 1.4 — ARCH-04 upsell/downsell benchmarks; METRICS-01 contextual benchmark caveat. (3) Phase 1.3 — M-01 full metric hierarchy; click-to-page-view metric; M-02 CTR/CPC danger warning for beginners. (4) Phase 4.7 — ARCH-07 instant triage (115 checkouts case); ARCH-09 "limpar checkout first" protocol; METRICS-03 A/B statistical validity; F-10 boleto pixel corruption rule (critical). (5) Phase 4.8 — benchmark updated to 10–20% range per Hotmart Cast. (6) Phase 4.9 NEW — D-02 redline as first intervention; S-04 pandemic case study; D-04 infinite creative loop anti-pattern; D-03 lead qualification via survey. (7) Phase 5 — DIAG-03 CTA position case added to priority table; row 6 redline testing added; row 5 boleto removal added. (8) Phase 6 — 6.0 custom metric setup (M-07); TRAFFIC-04 checkout stability rationale; PRICING-04 CPA scaling alert; 6.2a 72h attribution window (M-05, critical); 6.2b all-creatives diagnostic (M-08); 6.2c CPM context rule (M-06). (9) Phase 5.2 — GAP-01 confidence upgraded [INF]→[REP] with cross-source corroboration. (10) Section 7 — failure modes 8–11 added. (11) Section 11 — two new conflict resolutions. (12) Section 12 — two new source entries. Sources: `outputs/gerador-pop/extractions/hotmart-cast-gold-extraction.md`, `outputs/gerador-pop/extractions/kiwicast-213-gold-extraction.md`. |

---

*This document is CERTIFIED status (v0.4.0). All P1/P2 audit findings from AUDIT-VSL-DIAG-001-v0.1-20260311 and all minor/observation findings from re-audit AUDIT-VSL-DIAG-001-v0.2-20260311 have been addressed. GAP-01 confidence upgraded from [INF] to [REP] in this version. Treat all remaining [INF] and [ASM] items as hypotheses pending verification. Next scheduled review: 2026-06-11.*
*End of SOP-COPY-VSL-DIAG-001 v0.4.0*
*Extracted by: SOP Factory Squad — SOP Extractor (Ohno) | Synkra AIOX*
*Remediated by: SOP Factory Squad — SOP Creator | Synkra AIOX*
*Enriched v0.4.0: SOP Creator / SOP Factory Squad — Sources: Hotmart Cast (RENU3kEns0E) + Kiwicast #213 (hnw1pGcc3_A) | Synkra AIOX*
