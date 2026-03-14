# Task: Generate Report

## Metadata
- **Agent:** Performance Analyst
- **Tipo:** Workflow analítico
- **Elicit:** true

## Objetivo
Consolidar dados de múltiplas campanhas e plataformas em um relatório estruturado com recomendações acionáveis.

## Fluxo

### Step 1: Coleta de Dados
Solicitar ao usuário:

1. **Plataformas:** Facebook Ads, Google Ads, ou ambas
2. **Período:** Data de início e fim do relatório
3. **Dados das campanhas:** CSV exportado, texto colado, ou screenshots
4. **Dados de vendas/leads:** Se disponível, para atribuição (opcional)
5. **Período anterior:** Para comparação (opcional, recomendado)

### Step 2: Consolidação
Unificar dados de todas as fontes em formato padronizado:

- Padronizar nomes de métricas (ex: "Amount Spent" → "Gasto")
- Converter moedas se necessário
- Identificar e marcar dados faltantes

### Step 3: Métricas Gerais
Calcular totais e médias:

| Métrica | Valor | vs Período Anterior |
|---------|-------|-------------------|
| Investimento Total | R$ X | +/-% |
| Impressões | X | +/-% |
| Cliques | X | +/-% |
| CTR | X% | +/-pp |
| CPC Médio | R$ X | +/-% |
| Conversões | X | +/-% |
| CPA Médio | R$ X | +/-% |
| ROAS | X | +/-% |

### Step 4: Detalhamentos
Gerar análises específicas:

1. **Por campanha** — Ranking de melhor a pior performance
2. **Por conjunto** — Quais públicos performam melhor
3. **Por criativo** — Top 3 e Bottom 3 criativos
4. **Funil** — Impressão → Clique → Lead → Venda (com taxas de conversão)
5. **UTM** — Atribuição por source/medium/campaign

### Step 5: Comparação de Períodos
Se dados do período anterior disponíveis:
- Variação % de cada métrica principal
- Tendências identificadas (melhora, piora, estável)
- Correlação com ações tomadas no período

### Step 6: Recomendações
Gerar lista de ações baseadas nos dados:
- O que escalar (melhores performers)
- O que pausar (piores performers)
- O que testar (hipóteses baseadas nos dados)
- Próximos passos sugeridos

### Step 7: Validação
Executar `checklists/report-validation.md`:
- Se 100% PASS → Entregar relatório
- Se FAIL → Corrigir e revalidar

### Step 8: Output
Gerar relatório usando template `templates/performance-report.md`.

## Output
- Relatório completo de performance
- Resumo executivo (1 página)
- Recomendações acionáveis
