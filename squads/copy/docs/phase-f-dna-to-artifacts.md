---
version: "1.0"
date: "2026-03-11"
author:
  agent: "claude-code"
  squad: "copy"
aiox: true
project: "opb-corp"
---

# Phase F: DNA → Artefatos Operacionais

## Objetivo

Converter os frameworks extraidos via 7D pipeline (voice_dna.yaml + thinking_dna.yaml)
em artefatos AIOX operacionais: checklists, templates, workflows e tasks.

## Pre-requisitos

- [x] Phase A-C: 12/23 agents com DNA extraido e validado
- [ ] Phase D-E: 11 agents restantes (--batch all rodando)
- [ ] v1.1 patch: adicionar `counter_intuitive_rules` aos 12 agents validados

## Mapeamento: DNA Section → Tipo de Artefato

| DNA Section | Artifact Type | Exemplo |
|-------------|--------------|---------|
| `decision_heuristics` | **Checklist** | "Pre-Writing Diagnostic Checklist (Hopkins)" |
| `veto_conditions` | **Checklist** | "Copy QA Veto Checklist (Schwartz)" |
| `primary_framework` | **Workflow** | "Scientific Advertising Diagnostic (Hopkins)" |
| `templates` (voice_dna) | **Template** | "Headline Formula Template (Ogilvy)" |
| `secondary_frameworks` | **Task** | "Control-Beating Analysis (Lampropoulos)" |
| `diagnostic_pattern` | **Workflow** | "Market Awareness Routing (Schwartz)" |
| `tone_calibration.modes` | **SOP** | "Tone Selection Guide per Format" |
| `counter_intuitive_rules` | **Checklist** | "Counterintuitive Copy Rules (cross-agent)" |

## Prioridade de Geração

### P0 — High Value, Immediate Use (first batch)

| Artifact | Type | Source Agent | Source Section | Impact |
|----------|------|-------------|----------------|--------|
| headline-diagnostic-checklist | checklist | hopkins | decision_heuristics (12) + veto_conditions (7) | Every copy starts here |
| awareness-routing-workflow | workflow | schwartz | primary_framework (5 levels) + diagnostic_pattern | Core routing decision |
| sales-letter-template | template | halbert | templates (3) + primary_framework | Most common format |
| control-beating-workflow | workflow | lampropoulos | primary_framework (5 phases) | Direct response gold |
| copy-qa-veto-checklist | checklist | ALL agents | veto_conditions (merged) | Final quality gate |

### P1 — Framework Workflows (second batch)

| Artifact | Type | Source Agent | Source Section |
|----------|------|-------------|----------------|
| research-first-workflow | workflow | ogilvy | primary_framework + proprietary_data |
| emotional-proof-workflow | workflow | makepeace | primary_framework (QwikCrit) |
| unique-mechanism-checklist | checklist | brown | secondary_frameworks |
| email-sequence-workflow | workflow | chaperon | primary_framework (SOAP opera) |
| offer-engineering-workflow | workflow | hormozi | primary_framework (Grand Slam) |

### P2 — Specialist Templates (third batch)

| Artifact | Type | Source Agent | Source Section |
|----------|------|-------------|----------------|
| vsl-script-template | template | georgi | primary_framework + templates |
| launch-sequence-workflow | workflow | walker | primary_framework (PLF) |
| daily-email-template | template | settle | templates + tone_calibration |
| fascination-formula-template | template | carlton | secondary_frameworks |
| 30-triggers-checklist | checklist | sugarman | primary_framework (30 triggers) |

### P3 — Cross-Agent Synthesis (requires all 23 done)

| Artifact | Type | Source | Method |
|----------|------|--------|--------|
| master-copy-diagnostic | workflow | ALL T0 agents | Merge diagnostic_patterns |
| universal-veto-checklist | checklist | ALL agents | Union of all veto_conditions |
| tier-routing-decision-tree | workflow | copy-chief + ALL | From awareness + product routing |
| counter-intuitive-playbook | template | ALL agents | Merge counter_intuitive_rules |

## Execução

### Mechanism: `create-artifact-from-kb.md` (adapted)

**Mudança necessaria:** atualizar `kb_path` de `data/books/{agent}/frameworks_inventory.yaml`
para `data/minds/{agent}/thinking_dna.yaml` + `data/minds/{agent}/voice_dna.yaml`.

### Flow per artifact:

```
1. Read thinking_dna.yaml + voice_dna.yaml do agent
2. Ativar agent via /copywriterOs:agents:{name}
3. Agent gera artefato usando SEUS frameworks (não genérico)
4. Quality gate: verifica generated_from, tags, operacionalidade
5. Save em squads/copy/{checklists|templates|workflows}/
6. Update config.yaml
```

### Estimativa

| Batch | Artifacts | Agents envolvidos | Tempo est. |
|-------|-----------|-------------------|------------|
| P0 | 5 | 5 (hopkins, schwartz, halbert, lampropoulos, ALL) | 2-3h |
| P1 | 5 | 5 (ogilvy, makepeace, brown, chaperon, hormozi) | 2-3h |
| P2 | 5 | 5 (georgi, walker, settle, carlton, sugarman) | 2-3h |
| P3 | 4 | ALL (cross-agent synthesis) | 3-4h |
| **Total** | **19** | **23 agents** | **~10-12h** |

## Validação

Cada artefato deve:
- [ ] Referenciar frameworks source no header (`generated_from`)
- [ ] Refletir a metodologia do agent (não ser genérico)
- [ ] Ser funcional (usável imediatamente)
- [ ] Ter metadata AIOX (version, date, agent, squad)
- [ ] Ter pelo menos 3 frameworks documentados como source

## Dependencias

- Phase D+E completion (all 23 agents extracted)
- v1.1 patch: `counter_intuitive_rules` added to all agents
- `create-artifact-from-kb.md` updated for minds/ path

## Resultado Final

O CopywriterOS terá:
- 25 agents com DNA completo (voice + thinking)
- ~19 artefatos operacionais derivados dos DNA
- Routing matrix + awareness routing + product routing (já existe)
- Cada artefato traceable ao agent + frameworks de origem
