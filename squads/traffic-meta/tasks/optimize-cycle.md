# Task: Optimize Cycle

## Metadata
- **Agent:** Campaign Optimizer
- **Tipo:** Workflow analítico
- **Elicit:** true

## Objetivo
Analisar dados de performance e gerar recomendações de otimização baseadas em frameworks de decisão pré-definidos.

## Inputs
- **Dados de performance** (CSV, texto colado, screenshots) com no mínimo 3 dias
- **Período de análise** (3, 7, 14 ou 30 dias)
- **Objetivo da campanha** (Vendas, Leads, Tráfego)
- **KPIs alvo** (CPA máximo, ROAS mínimo)
- **Thresholds de referência** (`data/kpi-thresholds.md`)
- **ID da campanha** publicada pelo Campaign Publisher

## Veto Conditions
NÃO executar se:
- ❌ Período de dados < 3 dias (insuficiente para decisão estatística)
- ❌ KPIs alvo não definidos (CPA máximo ou ROAS mínimo ausentes)
- ❌ Dados em formato ilegível ou incompletos (sem gasto, impressões ou conversões)
- ❌ Objetivo da campanha não declarado
- ❌ Recomendação de pausar/escalar sem 3+ dias consecutivos confirmando tendência

## Fluxo

### Step 1: Coleta de Dados
Solicitar ao usuário:

1. **Dados de performance:** CSV, texto colado, ou screenshots
2. **Período:** Últimos 3, 7, 14 ou 30 dias
3. **Objetivo da campanha:** Vendas, Leads, Tráfego
4. **KPIs alvo:** CPA máximo aceitável, ROAS mínimo desejado

### Step 2: Processamento
Organizar os dados em tabela padronizada:

| Campanha/Conjunto | Gasto | Impressões | Cliques | CTR | CPC | Conversões | CPA | ROAS | Frequência |
|-------------------|-------|-----------|---------|-----|-----|-----------|-----|------|-----------|

### Step 3: Diagnóstico
Para cada campanha/conjunto, classificar:

- **🟢 Escalar:** ROAS > meta por 3+ dias, CPA < meta, frequência < 3.0
- **🔴 Pausar:** CPA > 2x meta por 3+ dias, ROAS < 50% meta, frequência > 4.0
- **🟡 Ajustar:** CPA entre 1-2x meta, ROAS entre 50-100% meta
- **⚪ Manter:** Métricas dentro da meta, sem tendência clara

### Step 4: Recomendações
Para cada item classificado, detalhar a ação:

- **Escalar:** Quanto aumentar o budget (sugestão: 20-30% por vez)
- **Pausar:** Justificativa e sugestão de substituição
- **Ajustar:** O que ajustar (criativo, público, lance, copy)
- **Manter:** Por quanto tempo monitorar antes de reavaliar

### Step 5: Log de Otimização
Preencher template `templates/optimization-log.md` com:
- Data da análise
- Dados analisados
- Decisões tomadas
- Justificativas
- Resultados esperados

## Regras
- Mínimo 3 dias de dados para qualquer decisão
- Sempre comparar contra thresholds de `data/kpi-thresholds.md`
- Registrar TODA decisão no log

## Output
- Diagnóstico por campanha/conjunto
- Lista de ações recomendadas
- Log de otimização preenchido

## Acceptance Criteria
- [ ] Dados de no mínimo 3 dias coletados (Step 1)
- [ ] Tabela padronizada montada com todas as métricas (Step 2)
- [ ] Cada campanha/conjunto recebeu classificação (🟢/🔴/🟡/⚪) (Step 3)
- [ ] Recomendações detalham AÇÃO + JUSTIFICATIVA (Step 4)
- [ ] Log preenchido em `templates/optimization-log.md` (Step 5)
- [ ] Thresholds de `kpi-thresholds.md` foram referenciados explicitamente

## Handoff
- **Próximo agente:** Performance Analyst (`*report`) para consolidar resultados
- **Artefato passado:** log de otimização + diagnóstico
