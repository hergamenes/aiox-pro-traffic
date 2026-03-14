# Task: Optimize Cycle

## Metadata
- **Agent:** Campaign Optimizer
- **Tipo:** Workflow analítico
- **Elicit:** true

## Objetivo
Analisar dados de performance e gerar recomendações de otimização baseadas em frameworks de decisão pré-definidos.

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
