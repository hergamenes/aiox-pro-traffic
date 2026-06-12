# Framework de Priorização de Ações

> **Propósito:** transformar os achados da **Seção 5 (Recomendações)** do relatório numa lista executável, ordenada por **impacto financeiro × esforço**. Cada ação ganha um número de prioridade (P1–P5) e uma estimativa de R$ em jogo, para que o gestor saiba exatamente o que fazer primeiro. Usado pelo `generate-report.md` ao montar a `action-list-priorizada.md`.

---

## Princípio

Toda ação compete por atenção e budget. A que **recupera/gera mais dinheiro com menos esforço** vem primeiro. O critério é objetivo:

```
Prioridade ≈ (R$ desperdiçado ou ganho por mês) ÷ (esforço)
```

Não é opinião: o "desperdício" é medido contra a **melhor campanha da própria conta** (o padrão-ouro), nunca contra outra conta/cliente (isolamento — ver `kpi-thresholds.md`).

---

## Passo a passo

### (a) Calcular o desperdício mensal (R$)

Para cada campanha/ad/keyword fora do padrão:

```
desperdício_mensal = (custo_atual_por_resultado − custo_padrão_da_melhor_campanha) × volume_de_resultados_por_semana × 4,33
```

- **custo_atual_por_resultado:** o custo por resultado da entidade analisada (custo/conversa, CPL, CPA, CPC — o KPI-mestre do objetivo).
- **custo_padrão_da_melhor_campanha:** o menor custo por resultado obtido na **própria conta** (campanha-modelo / padrão-ouro).
- **volume_de_resultados_por_semana:** quantos resultados a entidade entrega por semana.
- **4,33:** semanas por mês (média), para projetar o impacto mensal.

> Para **ações de ganho** (escalar um campeão), troque "desperdício" por "ganho projetado": quantos resultados extras o budget adicional gera ao custo-padrão.

### (b) Classificar o esforço

| Esforço | Critério | Exemplos |
|---------|----------|----------|
| 🟢 **Baixo** | Mudança dentro da plataforma, minutos, sem dependência externa | trocar/pausar criativo, ajustar budget, pausar campanha, adicionar negativa |
| 🟡 **Médio** | Requer produção ou pessoa externa, dias | produzir variações de criativo, instrumentar evento/medição, reescrever copy |
| 🔴 **Alto** | Projeto, semanas, várias dependências | reestruturar conta, nova landing page, integração de CRM/medição nova |

### (c) Ordenar P1–P5

| Prioridade | Significado | Regra |
|------------|-------------|-------|
| 🔴 **P1** | Urgente | maior R$/mês em jogo **e** esforço baixo/médio — a sangria que custa mais e é fácil de estancar |
| 🟢 **P2** | Alta | grande ganho com esforço baixo (ex.: escalar o campeão) |
| 🟡 **P3** | Média | sustenta os ganhos de P1/P2 ou impacto médio (ex.: novos criativos para suportar escala) |
| 🟡 **P4** | Média | corrige medição/visibilidade — budget rodando "às cegas" |
| ⚪ **P5** | Monitoria | preventivo/contínuo — vigiar sem agir agora |

Empate de R$: o de **menor esforço** sobe. Esforço alto só vira P1 se o R$/mês for muito grande e não houver alternativa.

---

## Exemplo numérico (caso do piloto — Verbo Feminino)

Padrão-ouro da conta: campanha **SOL_PLUS** a **R$ 2,69/conversa**.
Campanha problemática: **SOL_SLIM** (criativo AD0032) a **R$ 11,31/conversa**, entregando ~8 conversas/semana com aquele criativo.

```
desperdício_mensal = (11,31 − 2,69) × 8 × 4,33
                   = 8,62 × 8 × 4,33
                   ≈ R$ 298/mês
```

→ ~**R$ 298/mês** presos num criativo ruim. Esforço de correção: 🟢 Baixo (trocar/pausar criativo). Resultado: vira **P1**.

---

## Tabela de prioridades (modelo de saída)

| P | Ação | R$/mês em jogo | Esforço | Status | Dono |
|---|------|----------------|---------|--------|------|
| 🔴 P1 | {ação urgente} | ~R$ {valor} recuperáveis | 🟢 Baixo | ⬜ | {agente/cliente} |
| 🟢 P2 | {escalar campeão} | ~+{n} resultados/mês | 🟢 Baixo | ⬜ | {agente} |
| 🟡 P3 | {sustenta a escala} | preserva o custo-padrão | 🟡 Médio | ⬜ | {cliente/criação} |
| 🟡 P4 | {corrigir medição} | {valor} accountável | 🟡 Médio | ⬜ | {agente} |
| ⚪ P5 | {monitorar KPI} | preventivo | 🟢 Baixo | 🔄 | {agente} |

### Legenda
- **Prioridade:** 🔴 P1 urgente · 🟢 P2 alta · 🟡 P3–P4 média · ⚪ P5 monitoria
- **Esforço:** 🟢 Baixo · 🟡 Médio · 🔴 Alto
- **Status:** ⬜ A fazer · 🔄 Em andamento/contínuo · ✅ Feito · 🔒 Bloqueado

---

## Regras
- Sempre informar **a base do cálculo** (qual campanha é o padrão-ouro) junto da tabela.
- Nunca usar a média de mercado como padrão quando há padrão-ouro **interno** melhor.
- Isolamento: o padrão-ouro vem **sempre da mesma conta** — nunca importar custo de outro cliente/nicho.
- Quando faltar volume estatístico (< 5 resultados), marcar o R$/mês como "estimativa frágil" e rebaixar a prioridade.

---
*Framework de priorização · suporte ao novo formato de relatório*
