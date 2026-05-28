---
version: "1.0"
date: "2026-03-09"
author:
  agent: "squad-chief"
  squad: "copy"
aiox: true
project: "opb-corp"
---

# Task: Self-Improve — Gap Detection & Artifact Generation

## Task Anatomy

| Campo | Valor |
|-------|-------|
| task_name | self-improve |
| status | active |
| responsible_executor | copy-chief |
| execution_type | autonomous |
| elicit | true (asks user before creating) |

## Objetivo

Detectar artefatos faltantes (templates, checklists, workflows, SOPs) durante
a produção de copy e gerar automaticamente usando o KB dos agentes.

O squad se auto-evolui: cada produção de copy pode gerar novos artefatos
baseados nas metodologias reais dos masters (1,331 frameworks disponíveis).

## Quando Executar

1. **Automático (pós-delivery):** Copy Chief roda gap detection após cada entrega
2. **Manual:** Usuário pede `*improve` ou `*gaps`
3. **Proativo:** Copy Chief detecta gap durante routing e sinaliza

## Gap Detection Flow

```
1. Identificar channel + type do projeto atual
2. Gerar tags: [channel:{canal}, type:template], [channel:{canal}, type:checklist]
3. Verificar se artefatos existem em templates/, checklists/, workflows/
4. Se NÃO existe → consultar artifact-capability-map.yaml
5. Encontrar agent(s) com tags matching
6. Apresentar sugestão ao usuário com frameworks disponíveis
7. Se aprovado → executar create-artifact-from-kb.md
```

## Tag Matching Algorithm

```yaml
# Input: briefing com channel=email, type=sequence
# Generated search tags:
search_tags:
  - channel:email
  - type:template

# Lookup in artifact-capability-map.yaml:
# Match: andre-chaperon (tags: [channel:email, ...])
#   → can_create: email-sequence-tmpl
#   → source_frameworks: ARM, Soap Opera, Email Engine

# Check if exists:
# ls templates/email-sequence-tmpl.md → NOT FOUND

# Result: GAP DETECTED
gap:
  id: email-sequence-tmpl
  name: "Email Sequence Template"
  agent: andre-chaperon
  frameworks: ["ARM", "Soap Opera Sequence Creation", "Email Engine Setup"]
  action: "Gerar template baseado em 41 frameworks do Andre Chaperon KB"
```

## User Presentation Format

```markdown
## Gaps Detectados

Após produzir copy para **{projeto}** (canal: {canal}), identifiquei:

| # | Artefato Faltante | Agent Responsável | Frameworks Disponíveis |
|---|-------------------|-------------------|----------------------|
| 1 | {name} | {agent} ({N} frameworks) | {top 3 frameworks} |
| 2 | {name} | {agent} ({N} frameworks) | {top 3 frameworks} |

Quer que eu gere? (número ou "todos")
```

## Output

```yaml
gap_report:
  projeto: "{nome}"
  channel: "{canal}"
  gaps_found: {N}
  gaps:
    - id: "{artifact_id}"
      name: "{artifact name}"
      type: "{template | checklist | workflow | sop}"
      agent: "{agent-name}"
      agent_frameworks: {count}
      source_frameworks: ["{fw1}", "{fw2}", "{fw3}"]
      status: "{pending | approved | created}"
```

## Veto Conditions

- NÃO interromper produção para criar artefatos — gaps são sinalizados PÓS-delivery
- NÃO criar artefato sem aprovação do usuário
- NÃO criar artefato genérico — DEVE usar frameworks do KB do agente
- NÃO duplicar artefato existente — verificar antes de sugerir

## Acceptance Criteria

- [ ] Gap detection executou contra artifact-capability-map.yaml
- [ ] Gaps apresentados com agent + frameworks source
- [ ] Usuário aprovou antes da criação
- [ ] Artefatos criados via create-artifact-from-kb.md

## Handoff

→ `create-artifact-from-kb.md` (para cada gap aprovado)
