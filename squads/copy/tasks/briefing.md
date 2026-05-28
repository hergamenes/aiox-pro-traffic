---
version: "1.0"
date: "2026-03-09"
author:
  agent: "squad-chief"
  squad: "copy"
aiox: true
project: "opb-corp"
---

# Task: Briefing — Captura Estruturada do Projeto de Copy

## Task Anatomy

| Campo | Valor |
|-------|-------|
| task_name | briefing |
| status | active |
| responsible_executor | copy-chief |
| execution_type | interactive |
| elicit | true |

## Objetivo

Capturar todas as informações necessárias do usuário para que o Copy Chief possa rodar o diagnóstico Tier 0 e selecionar os copywriters corretos.

## Input

Descrição livre do usuário sobre o projeto de copy.

## Output

```yaml
briefing:
  projeto: "{nome do projeto}"
  produto: "{descrição do produto/serviço}"
  preco: "{faixa de preço}"
  icp:
    quem: "{perfil do cliente ideal}"
    dor_principal: "{maior dor/frustração}"
    desejo_principal: "{maior desejo/aspiração}"
    objecoes: ["{objeção 1}", "{objeção 2}"]
  canal: "{sales page | email | VSL | ads | launch | webinar | social | magalog | infomercial | cohort}"
  objetivo: "{gerar leads | vender direto | nutrir | lançar | reativar}"
  tom: "{agressivo | consultivo | story-driven | educacional | provocativo}"
  stakes: "{low | medium | high | critical}"
  referencias: "{exemplos de copy que gosta, concorrentes}"
  restricoes: "{compliance, regulatório, brand guidelines}"
  prazo: "{urgência}"
```

## Elicitation Flow

Perguntar na seguinte ordem (máximo 5 perguntas, agrupar quando possível):

1. **Produto + Preço:** "O que você está vendendo e por quanto?"
2. **ICP + Dor:** "Quem é o cliente ideal e qual a maior dor/desejo dele?"
3. **Canal + Objetivo:** "Onde vai publicar (sales page, email, VSL, ads...) e qual o objetivo?"
4. **Tom + Stakes:** "Qual tom de voz? E qual o nível de importância desse projeto (low/medium/high/critical)?"
5. **Referências + Restrições:** "Tem referências de copy que gosta? Alguma restrição (compliance, brand)?"

## Veto Conditions

- NÃO avançar sem canal definido (impossível rotear sem canal)
- NÃO avançar sem ICP (copy sem ICP é copy genérica)
- NÃO avançar sem produto (impossível criar argumento sem saber o que se vende)

## Acceptance Criteria

- [ ] Todos os campos obrigatórios preenchidos (produto, ICP, canal, objetivo)
- [ ] Briefing formatado no schema YAML acima
- [ ] Handoff para task `diagnose.md` com briefing completo

## Handoff

→ `diagnose.md` (Tier 0 Diagnostic)
