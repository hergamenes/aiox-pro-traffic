---
version: "1.0"
date: "2026-03-09"
author:
  agent: "squad-chief"
  squad: "copy"
aiox: true
project: "opb-corp"
---

# Task: Deliver — Entrega Final ao Usuário

## Task Anatomy

| Campo | Valor |
|-------|-------|
| task_name | deliver |
| status | active |
| responsible_executor | copy-chief |
| execution_type | autonomous |
| elicit | false |

## Objetivo

Copy Chief consolida o resultado final e entrega ao usuário com contexto completo.

## Input

1. Copy final (post-QA Gate PASS)
2. Diagnostic Report
3. QA Gate score
4. Routing decision + rationale

## Output — Delivery Package

```markdown
# Copy Delivery — {projeto}

## Copy Final
{copy completa aqui}

## Metadata
- **Writer:** {agent-name} ({tier})
- **Canal:** {canal}
- **Awareness Level:** {1-5} ({label})
- **Sophistication Level:** {1-5}
- **QA Score:** {X}/30 ({grade})

## Diagnostic Summary
- Hopkins: {key finding}
- Schwartz: {key finding}
- Collier: {key finding}

## Routing Rationale
{por que este writer foi selecionado}

## Next Steps (sugestões)
- [ ] A/B test headline variants
- [ ] Monitorar métricas em {período}
- [ ] Iterar baseado em dados
```

## Acceptance Criteria

- [ ] Copy final inclusa e formatada para o canal
- [ ] Metadata completo (writer, awareness, QA score)
- [ ] Diagnostic summary presente
- [ ] Routing rationale documentado
