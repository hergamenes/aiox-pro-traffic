# Task: Generate Report

## Metadata
- **Agent:** Performance Analyst
- **Tipo:** Workflow analítico
- **Elicit:** true

## Objetivo
Consolidar dados de múltiplas campanhas e plataformas em um relatório estruturado com recomendações acionáveis.

## Inputs
- **Plataformas-fonte** (Facebook Ads via CLI / Google Ads manual / ambas)
- **Período do relatório** (data início + data fim)
- **`account-id` da Meta Ads** (ou usa default configurado)
- **Dados de vendas/leads** para atribuição (opcional, recomendado)
- **Período anterior** para comparação (opcional, recomendado)
- **Convenções UTM** (`data/utm-conventions.md`)
- **Thresholds de KPI** (`data/kpi-thresholds.md`)
- **CLI meta-ads autenticada** (`meta-ads auth status` = OK)

> Para Meta Ads, dados vêm em **tempo real via CLI** (`meta-ads report --format json`). Para Google Ads (futuro), input ainda é manual.

## Veto Conditions
NÃO gerar relatório se:
- ❌ Período não estiver definido (sem data início OU sem data fim)
- ❌ `meta-ads auth status` retornar expirado/não-configurado (quando plataforma inclui Meta)
- ❌ CLI `meta-ads report` retornar erro persistente (rede, account-id inválido)
- ❌ Métricas básicas (Investimento, Cliques, Impressões) estiverem inconsistentes (totais não batem)
- ❌ Checklist `report-validation.md` tiver qualquer item FAIL após Step 7
- ❌ Recomendações forem geradas sem suporte nos dados consolidados

## Fluxo

### Step 0: Pré-validação Real-Time
```bash
node packages/meta-ads-agent/dist/bin/meta-ads.js auth status
```
- Se expirado → BLOQUEAR e guiar para `meta-ads auth setup`

### Step 1: Coleta de Dados em Tempo Real

Coletar parâmetros do usuário:

1. **Plataformas:** Facebook (CLI) / Google (manual) / ambas
2. **Período:** Data início e fim (`--from YYYY-MM-DD --to YYYY-MM-DD`)
3. **Account-ID** (opcional — usa default se não informado)
4. **Dados de vendas/leads:** Se disponível, para atribuição (opcional)
5. **Período anterior:** Para comparação (opcional)

**Puxar dados via CLI (Meta Ads):**

```bash
# Período atual — granularidades múltiplas
node packages/meta-ads-agent/dist/bin/meta-ads.js report \
  --from {start} --to {end} --level account --format json > /tmp/account.json

node packages/meta-ads-agent/dist/bin/meta-ads.js report \
  --from {start} --to {end} --level campaign --format json > /tmp/campaigns.json

node packages/meta-ads-agent/dist/bin/meta-ads.js report \
  --from {start} --to {end} --level adset --format json > /tmp/adsets.json

node packages/meta-ads-agent/dist/bin/meta-ads.js report \
  --from {start} --to {end} --level ad --format json > /tmp/ads.json

# Período anterior (opcional para comparação)
node packages/meta-ads-agent/dist/bin/meta-ads.js report \
  --from {prev-start} --to {prev-end} --level campaign --format json > /tmp/campaigns-prev.json
```

### Step 2: Consolidação
Parsear cada JSON do CLI e organizar:

- Padronizar nomes de métricas (ex: "spend" → "Gasto")
- Converter moedas se necessário (CLI já retorna em BRL para contas BR)
- Marcar dados faltantes (campanhas pausadas no período etc)
- Cruzar com dados de Google Ads (input manual) se aplicável

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
4. **Funil** — conforme objetivo: Impressão → Clique → Lead → Venda (sales/leads) OU Impressão → Clique → Conversa iniciada → Lead qualificado (whatsapp/Click-to-WhatsApp, com custo por conversa)
5. **UTM** — Atribuição por source/medium/campaign

### Step 5: Comparação de Períodos + MCP Performance Trend
Se dados do período anterior disponíveis:
- Variação % de cada métrica principal (cálculo manual via CLI)
- **Enriquecer com MCP `ads_insights_performance_trend`** para análise nativa da Meta
- Tendências identificadas (melhora, piora, estável)
- Correlação com ações tomadas no período

### Step 5.5: Benchmarks Indústria + Contexto do Anunciante (NOVO — via MCP)

Consultar MCP para enriquecer o relatório:

1. **`mcp__claude_ai_Facebook__ads_insights_advertiser_context`**
   - Vertical do anunciante, maturidade da conta, características
   - Usar na Seção 1 (Resumo Executivo)

2. **`mcp__claude_ai_Facebook__ads_insights_industry_benchmark`**
   - Comparar CPA/ROAS/CTR com média da indústria do anunciante
   - Resultado vira Seção 10 (Benchmarks da Indústria) no relatório
   - Permite afirmar "CPA de R$ 15 é 30% melhor que a média do segmento"

3. **`mcp__claude_ai_Facebook__ads_insights_anomaly_signal`**
   - Captura anomalias no período do relatório
   - Anota na Seção 9 como pontos de atenção

### Step 6: Recomendações + Opportunity Score
Gerar lista de ações baseadas nos dados:
- O que escalar (melhores performers, **confirmado por `opportunity_score`**)
- O que pausar (piores performers)
- O que testar (hipóteses baseadas nos dados)
- Próximos passos sugeridos
- **Insights automatizados da Meta via `mcp__claude_ai_Facebook__ads_get_opportunity_score`**

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

## Acceptance Criteria
- [ ] `meta-ads auth status` verificado e OK (Step 0)
- [ ] Dados puxados via `meta-ads report --format json` nos 4 níveis (account/campaign/adset/ad) (Step 1)
- [ ] Dados de todas as plataformas declaradas foram consolidados (Step 2)
- [ ] Tabela de métricas gerais preenchida com totais e comparações (Step 3)
- [ ] 5 detalhamentos gerados: campanha, conjunto, criativo, funil, UTM (Step 4)
- [ ] Comparação com período anterior incluída quando os dados existem (Step 5)
- [ ] MCP `performance_trend` consultado e incluído na Seção 8 (Step 5)
- [ ] MCP `advertiser_context` consultado e incluído na Seção 1 (Step 5.5)
- [ ] MCP `industry_benchmark` consultado e incluído na nova Seção 10 (Step 5.5)
- [ ] MCP `anomaly_signal` consultado e anomalias anotadas na Seção 9 (Step 5.5)
- [ ] MCP `opportunity_score` consultado para recomendações de escala (Step 6)
- [ ] Cada recomendação tem suporte em dados específicos do relatório (Step 6)
- [ ] Checklist `report-validation.md` com 100% PASS (Step 7)
- [ ] Relatório final gerado a partir de `templates/performance-report.md`
- [ ] JSONs do CLI + outputs MCP persistidos como anexos do relatório (auditoria)

## Handoff
- **Próximo agente:** Campaign Optimizer (`*optimize`) caso recomendações exijam ação imediata
- **Artefato passado:** relatório consolidado + lista priorizada de ações
