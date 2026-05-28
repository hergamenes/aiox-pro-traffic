---
version: "1.0"
date: "2026-03-09"
author:
  agent: "squad-chief"
  squad: "copy"
aiox: true
project: "opb-corp"
---

# Task: Diagnose — Tier 0 Diagnostic Protocol

## Task Anatomy

| Campo | Valor |
|-------|-------|
| task_name | diagnose |
| status | active |
| responsible_executor | copy-chief (delegates to T0 agents) |
| execution_type | parallel |
| elicit | false |

## Objetivo

Rodar os 3 agentes Tier 0 (Hopkins, Schwartz, Collier) em paralelo para produzir um Diagnostic Report que guia a seleção de copywriters.

## Input

Briefing completo (output de `briefing.md`).

## Diagnostic Agents (rodar em PARALELO)

### 1. Claude Hopkins — Scientific Advertising Diagnostic
```
Analyze this briefing through the lens of Scientific Advertising:
- Is the claim SPECIFIC and MEASURABLE?
- Can we create a REASON-WHY argument?
- What PROOF elements are available?
- Is there a TEST we can run?
- How would you structure a SAMPLING strategy?
Output: Hopkins Diagnostic (specificity_score, testability, proof_inventory)
```

### 2. Eugene Schwartz — Awareness & Sophistication Diagnostic
```
Analyze this briefing through Breakthrough Advertising:
- What is the prospect's AWARENESS LEVEL? (Unaware → Most Aware, 1-5)
- What is the MARKET SOPHISTICATION level? (1-5)
- What MASS DESIRE can we channel?
- What HEADLINE STRATEGY matches this awareness level?
Output: Schwartz Diagnostic (awareness_level, sophistication_level, desire_angle, headline_strategy)
```

### 3. Robert Collier — Conversation Entry Diagnostic
```
Analyze this briefing through The Robert Collier Letter Book:
- What CONVERSATION is already in the prospect's mind?
- Which of the 6 PRIME MOTIVES applies? (Love, Duty, Greed, Self-Indulgence, Pride, Self-Preservation)
- What is the prospect's DOMINANT DESIRE?
- How do we ENTER that conversation with the first sentence?
Output: Collier Diagnostic (conversation_entry, dominant_motive, desire_sequence)
```

## Output

```yaml
diagnostic_report:
  hopkins:
    specificity_score: "{1-10}"
    testability: "{high | medium | low}"
    proof_inventory: ["{proof 1}", "{proof 2}"]
    recommendation: "{string}"
  schwartz:
    awareness_level: "{1-5: Unaware, Problem-Aware, Solution-Aware, Product-Aware, Most-Aware}"
    sophistication_level: "{1-5}"
    desire_angle: "{string}"
    headline_strategy: "{string}"
  collier:
    conversation_entry: "{string}"
    dominant_motive: "{Love | Duty | Greed | Self-Indulgence | Pride | Self-Preservation}"
    desire_sequence: ["{step 1}", "{step 2}"]
  combined:
    routing_recommendation: "{copy type from routing-matrix}"
    recommended_agents: ["{agent 1}", "{agent 2}"]
    rationale: "{string}"
```

## Veto Conditions

- NÃO pular o diagnóstico — NUNCA rotear sem diagnóstico
- NÃO rodar apenas 1 ou 2 dos 3 agentes — os 3 são obrigatórios
- NÃO aceitar awareness_level sem justificativa

## Acceptance Criteria

- [ ] 3 diagnósticos produzidos (Hopkins, Schwartz, Collier)
- [ ] Diagnostic Report consolidado com routing recommendation
- [ ] Recommended agents listados com rationale

## Handoff

→ Copy Chief recebe Diagnostic Report → seleciona agents → `write-copy.md`
