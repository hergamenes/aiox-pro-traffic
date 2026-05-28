---
version: "1.0"
date: "2026-03-09"
author:
  agent: "squad-chief"
  squad: "copy"
aiox: true
project: "opb-corp"
---

# Task: Write Copy — Produção de Copy por Agente Selecionado

## Task Anatomy

| Campo | Valor |
|-------|-------|
| task_name | write-copy |
| status | active |
| responsible_executor | agent selecionado pelo Copy Chief (T1/T2/T3) |
| execution_type | autonomous |
| elicit | false |

## Objetivo

O agente selecionado produz o draft de copy usando sua metodologia proprietária, informado pelo briefing + diagnostic report.

## Input

1. Briefing completo
2. Diagnostic Report (awareness, sophistication, conversation entry)
3. Copy Chief routing decision (agent selecionado + rationale)

## Execution Rules

1. **Ativar o agente via slash command:** `/copy:agents:{agent-name}`
2. **Entregar ao agente:**
   - Briefing
   - Diagnostic Report
   - Instrução: "Produza o copy usando sua metodologia. Aplique seus frameworks. Mantenha sua voz."
3. **O agente produz usando SUA metodologia** — não uma genérica
4. **Output deve refletir o DNA do agente** — se é Halbert, deve soar como Halbert

## Agent Selection by Copy Type (from routing-matrix)

| Copy Type | Primary Agents | When |
|-----------|---------------|------|
| Sales page (long-form) | halbert, makepeace, bencivenga | High-stakes, $1K+ products |
| VSL script | georgi, benson | Health VSLs, conversational VSLs |
| Email sequence | chaperon, settle | Nurture sequences, daily emails |
| Launch sequence | walker, brunson, kern | PLF, webinar, relational launches |
| Ads copy | kennedy, halbert | Urgency-driven, hook-driven |
| Cohort/workshop | ry-schwartz | Cohort launch copy |
| Unique mechanism | todd-brown | E5 Method, mechanism discovery |
| Brand + DR | ogilvy, bencivenga | Brand layer + response layer |
| Magalog/direct mail | rutz, makepeace, lampropoulos | Magalogs, health/finance controls |
| Infomercial/TV | deutsch | DRTV, demonstrations |
| Social/creator | dan-koe | OPB, threads, newsletters |
| Webinar script | brunson | Perfect Webinar |

## Output

Draft de copy no formato do canal solicitado, com:
- Headline/hook
- Body copy
- CTA
- Notas do agente sobre decisões de copy

## Veto Conditions

- NÃO produzir copy genérica — deve refletir a metodologia do agente
- NÃO ignorar o Diagnostic Report — awareness level guia o tom e a estrutura
- NÃO misturar metodologias de agentes diferentes no mesmo draft

## Acceptance Criteria

- [ ] Copy produzida no formato correto para o canal
- [ ] Metodologia do agente claramente aplicada
- [ ] Diagnostic Report considerado (awareness, sophistication)
- [ ] Copy pronta para QA Gate

## Handoff

→ `review-copy.md` (opcional, high-stakes) → `qa-gate.md` (obrigatório)
