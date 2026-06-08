# Mapa Objetivo → Métrica — Google Ads

> **Propósito:** o relatório de performance deve cobrir **TODAS as campanhas da conta**, qualquer que seja o tipo/objetivo. Este mapa define, para cada tipo de campanha do Google Ads, o **resultado primário**, a **métrica-chave de custo**, o **funil** e as métricas que NÃO se aplicam. O `generate-report.md` usa este mapa para montar as Seções 1, 2 e 3 corretamente por campanha.

## Como detectar o tipo/objetivo de cada campanha
Em ordem de preferência:
1. **`advertising_channel_type`** (GAQL: `SEARCH`, `PERFORMANCE_MAX`, `DISPLAY`, `VIDEO`, `SHOPPING`, `DEMAND_GEN`, `MULTI_CHANNEL`/App).
2. **Meta de conversão configurada** (tipo de conversão dominante: compra, lead, chamada, etc.).
3. **Heurística por nome** (fallback): tokens (`PESQUISA`/`SEARCH`, `PMAX`, `DISPLAY`, `VIDEO`/`YOUTUBE`, `SHOPPING`, `INSTITUCIONAL`, `LEAD`, `VENDAS`).

> No Google, "conversão" é configurável pelo anunciante. O resultado primário agnóstico é `conversions` + `cost_per_conversion`; quando há valor, usar `conversions_value` e **ROAS** = conversions_value / cost.

## Mapa por tipo de campanha

### SEARCH — Rede de Pesquisa
> Subtipos por objetivo de conversão: **Vendas**, **Leads** (inclui formulário nativo / lead form assets), **Tráfego/Chamadas**.
- **Vendas:** resultado = conversões (compra); KPI = CPA (`cost_per_conversion`) + **ROAS**; funil Impressão → Clique (CTR/CPC) → Conversão.
- **Leads / formulário nativo:** resultado = leads (`conversions` do tipo lead / lead form submissions); KPI = **CPL**; funil Impressão → Clique → Lead.
- **Métrica exclusiva Search:** **Impression Share** (search_impression_share) + lost IS (budget/rank).
- **Nível keyword:** sempre incluir análise por palavra-chave (top por gasto, top por ROAS/conversão, keywords com gasto alto e poucas conversões → candidatas a negativa/pause).

### PERFORMANCE_MAX
- **Resultado primário:** conversões (vendas ou leads, conforme meta)
- **KPI de custo:** CPA + ROAS
- **Funil:** Impressão → Clique → Conversão (sem detalhamento por keyword — usar **asset groups** e tipos de asset IMAGE/VIDEO/TEXT)
- **Atenção:** PMax não expõe keywords; reportar por asset group e categoria de busca quando disponível.

### SHOPPING
- **Resultado primário:** conversões (compra) + valor
- **KPI:** ROAS + CPA; análise por produto/grupo de produtos quando disponível.

### DISPLAY / DEMAND_GEN
- **Resultado primário:** conversões; secundário: alcance/cliques
- **KPI:** CPA + CPC + CPM; funil Impressão → Clique → Conversão.

### VIDEO (YouTube)
- **Resultado primário:** visualizações / conversões (conforme objetivo)
- **KPI:** CPV (custo por view) + CPM + conversões; funil Impressão → View → (Conversão).

### APP / MULTI_CHANNEL
- **Resultado primário:** instalações / eventos no app
- **KPI:** custo por instalação/evento.

## Regra de consolidação (Seção 1 — Visão Geral)
Objetivos mistos: NÃO somar tipos diferentes de conversão num único número.
- **Investimento total** (soma de todas as campanhas; em MCC, agregar child accounts com ponderação).
- **Quadro de resultados por tipo:** ex. "X vendas (R$ Y CPA · ROAS Z) · K leads (R$ W CPL)".
- **Gráfico diário** usa o objetivo **dominante** (maior gasto) — informar qual no título.

## Métricas universais (todo tipo — Seção 2)
cost, impressions, clicks, ctr, average_cpc, cpm, conversions, cost_per_conversion. Sempre exibir.

## Particularidades Google (vs Meta)
- **5 níveis:** account, campaign, ad_group, ad, **keyword**.
- **MCC:** suportar árvore (agregação ponderada de CTR/CPC/CPA/ROAS entre child accounts).
- **Sem MCP de benchmark:** usar `data/industry-benchmarks.md` (tabela por nicho mantida internamente) para ancorar as réguas — não há `industry_benchmark` nativo como no Meta.
- **Asset Library:** inventário de assets (IMAGE/VIDEO/TEXT) quando houver RDA/Performance Max.
