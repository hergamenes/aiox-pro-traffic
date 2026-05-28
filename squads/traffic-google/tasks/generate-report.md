# Task: Generate Report

## Metadata
- **Agent:** Performance Analyst
- **Tipo:** Workflow analítico
- **Elicit:** true

## Objetivo
Consolidar dados de múltiplas campanhas e plataformas em um relatório estruturado com recomendações acionáveis.

## Inputs
- **Fonte de dados** (Google Ads via CLI — tempo real)
- **Período do relatório** (data início + data fim)
- **`account-id` da Google Ads** (ou usa default configurado)
- **Escopo de contas** (single account OU MCC tree — quando MCC, agrega múltiplas contas)
- **Dados de vendas/leads** para atribuição (opcional, recomendado)
- **Período anterior** para comparação (opcional, recomendado)
- **Convenções UTM** (`data/utm-conventions.md`)
- **Thresholds de KPI** (`data/kpi-thresholds.md`)
- **CLI google-ads autenticada** (`google-ads auth status` = OK)

> Os dados vêm em **tempo real via CLI** (`google-ads report --format json`), nos 5 níveis (account, campaign, ad_group, ad, keyword).

## Veto Conditions
NÃO gerar relatório se:
- ❌ Período não estiver definido (sem data início OU sem data fim)
- ❌ `google-ads auth status` retornar expirado/não-configurado
- ❌ CLI `google-ads report` retornar erro persistente (rede, account-id inválido)
- ❌ Métricas básicas (Investimento, Cliques, Impressões) estiverem inconsistentes (totais não batem)
- ❌ Checklist `report-validation.md` tiver qualquer item FAIL após Step 7
- ❌ Recomendações forem geradas sem suporte nos dados consolidados

## Fluxo

### Step 0: Pré-validação Real-Time
```bash
node packages/google-ads-agent/dist/bin/google-ads.js auth status
```
- Se expirado → BLOQUEAR e guiar para `google-ads auth setup`

### Step 0.5: Detecção de Escopo MCC (Story 5.4)

Antes de coletar dados, verificar se o `account-id` é um MCC (manager) — se for, listar a árvore de contas filhas para agregação multi-account:

```bash
node packages/google-ads-agent/dist/bin/google-ads.js accounts --tree
```

- Se o customer é um MCC → coletar lista de child accounts (read-only) e iterar Step 1 para cada uma
- Se é single account → seguir fluxo padrão
- Esta operação é **read-only** (apenas lista a hierarquia, não muta nada)

### Step 1: Coleta de Dados em Tempo Real

Coletar parâmetros do usuário:

1. **Fonte:** Google Ads via CLI (tempo real)
2. **Período:** Data início e fim (`--from YYYY-MM-DD --to YYYY-MM-DD`)
3. **Account-ID** (opcional — usa default se não informado)
4. **Dados de vendas/leads:** Se disponível, para atribuição (opcional)
5. **Período anterior:** Para comparação (opcional)

**Puxar dados via CLI (Google Ads):**

```bash
# Período atual — granularidades múltiplas
node packages/google-ads-agent/dist/bin/google-ads.js report \
  --from {start} --to {end} --level account --format json > /tmp/account.json

node packages/google-ads-agent/dist/bin/google-ads.js report \
  --from {start} --to {end} --level campaign --format json > /tmp/campaigns.json

node packages/google-ads-agent/dist/bin/google-ads.js report \
  --from {start} --to {end} --level ad_group --format json > /tmp/ad_groups.json

node packages/google-ads-agent/dist/bin/google-ads.js report \
  --from {start} --to {end} --level ad --format json > /tmp/ads.json

# Período anterior (opcional para comparação)
node packages/google-ads-agent/dist/bin/google-ads.js report \
  --from {prev-start} --to {prev-end} --level campaign --format json > /tmp/campaigns-prev.json
```

### Step 2: Consolidação
Parsear cada JSON do CLI e organizar:

- Padronizar nomes de métricas (ex: "spend" → "Gasto")
- Converter moedas se necessário (CLI já retorna em BRL para contas BR)
- Marcar dados faltantes (campanhas pausadas no período etc)
- **Multi-account (MCC):** se o escopo for MCC tree (Step 0.5), agregar métricas de todas as child accounts — somar Investimento/Impressões/Cliques/Conversões, recalcular CTR/CPC/CPA/ROAS ponderados, e produzir uma seção "Por Conta" no relatório listando contribuição de cada account

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
2. **Por grupo de anúncios** — Quais grupos/segmentações performam melhor
3. **Por criativo** — Top 3 e Bottom 3 criativos
4. **Funil** — Impressão → Clique → Lead → Venda (com taxas de conversão)
5. **UTM** — Atribuição por source/medium/campaign

### Step 5: Comparação de Períodos (cálculo manual)

> ⚠️ Diferente do `traffic-meta` que usa MCP para performance_trend nativa, **NÃO há MCP de Google Ads ativo**. A comparação é feita manualmente.

Se dados do período anterior disponíveis:
- Variação % de cada métrica principal (cálculo manual a partir dos dois JSONs do CLI)
- Tendências identificadas (melhora, piora, estável)
- Correlação com ações tomadas no período

### Step 5b: Asset Library (somente RDA / Performance Max — Story 6.6)

Quando o account possuir campanhas **Responsive Display Ads (RDA)** ou **Performance Max (PMax)**, incluir uma seção de inventário de assets — operação **read-only**:

```bash
node packages/google-ads-agent/dist/bin/google-ads.js list-assets \
  --type IMAGE --format json > /tmp/assets-image.json

node packages/google-ads-agent/dist/bin/google-ads.js list-assets \
  --type VIDEO --format json > /tmp/assets-video.json

node packages/google-ads-agent/dist/bin/google-ads.js list-assets \
  --type TEXT --format json > /tmp/assets-text.json

# Ou puxar tudo de uma vez:
node packages/google-ads-agent/dist/bin/google-ads.js list-assets \
  --type ALL --format json > /tmp/assets-all.json
```

- Listar quantidade de assets por tipo (IMAGE/VIDEO/TEXT)
- Identificar assets reutilizáveis entre campanhas (cross-campaign reuse)
- Sinalizar gaps (ex: PMax sem video assets, RDA sem long headlines)
- Esta seção é **omitida** quando não há RDA/PMax no account
- Analyst **não muta** assets — apenas lista para análise

### Step 5.5: Análise por Palavra-Chave (Google-only)

Para campanhas Search, executar:

```bash
node packages/google-ads-agent/dist/bin/google-ads.js report \
  --from {start} --to {end} --level keyword --format json
```

- Identificar top 10 keywords por gasto
- Identificar top 10 por ROAS
- Identificar keywords com muito gasto e poucas conversões (candidatos a pause/negative)
- Esta seção é **única do traffic-google** (Meta não tem o conceito)

### Step 6: Recomendações (sem opportunity score automatizado)

Gerar lista de ações baseadas nos dados:
- O que escalar (melhores performers — ROAS alto, CPA baixo, conversões crescentes)
- O que pausar (piores performers — CPA > 2x meta, ROAS < 50% meta)
- O que testar (hipóteses baseadas nos dados — novos keywords, novos públicos, novos copies)
- Próximos passos sugeridos

> Nota: se MCP Google Ads ficar disponível no futuro, esta seção deve incorporar `opportunity_score` para sugestões automatizadas (similar ao traffic-meta).

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

## Output Example

```markdown
# 📊 Relatório de Performance — Google Ads
**Conta:** Grupo Prestarh (9631900143) · **Período:** 22–28/05/2026 (7d)
**Fonte:** CLI google-ads (tempo real) · **Moeda:** BRL

## 1. Resumo Executivo
Investiu R$ 133,21, gerou 14 conversões a CPA de R$ 9,52. Vs. semana anterior:
gasto +25,7%, conversões +40%, CPA −10,2% → conta mais eficiente.

## 2. Métricas Gerais
| Métrica | Atual | Anterior | Δ |
|---------|-------|----------|---|
| Investimento | R$ 133,21 | R$ 105,99 | +25,7% |
| Conversões | 14 | 10 | +40% |
| CPA | R$ 9,52 | R$ 10,60 | −10,2% |

## 3. Por Campanha
| Campanha | Invest. | CPC | Conv. | CPA |
|----------|---------|-----|-------|-----|
| INSTITUCIONAL | R$ 58,12 | R$ 2,08 | 8 | R$ 7,27 ✅ |
| SERVIÇOS | R$ 75,09 | R$ 5,01 🔴 | 6 | R$ 12,52 ⚠️ |

## 5.5 Palavras-chave (Google-only)
"Grupo Prestarh" (marca) é a melhor (CPA R$ 7,26); "consultoria de rh para
empresas" consome 53% do gasto com CPC R$ 5,07.

## 9. Recomendações
1. 🟢 Escalar INSTITUCIONAL (+20–30%) — melhor CPA da conta.
2. 🟡 Investigar SERVIÇOS — CPC zona "Ruim", adicionar negativas.
```

> O relatório completo segue as 9 seções de `templates/performance-report.md`. Este exemplo é abreviado.

## Acceptance Criteria
- [ ] `google-ads auth status` verificado e OK (Step 0)
- [ ] Escopo MCC detectado via `accounts --tree` quando aplicável (Step 0.5)
- [ ] Dados puxados via `google-ads report --format json` nos 4 níveis (account/campaign/ad_group/ad) (Step 1)
- [ ] Dados de todas as plataformas declaradas foram consolidados (Step 2)
- [ ] Agregação multi-account aplicada quando o customer é um MCC tree (Step 2)
- [ ] Tabela de métricas gerais preenchida com totais e comparações (Step 3)
- [ ] 5 detalhamentos gerados: campanha, grupo de anúncios, criativo, funil, UTM (Step 4)
- [ ] Comparação com período anterior incluída quando os dados existem (Step 5)
- [ ] Comparação de períodos calculada manualmente a partir dos JSONs (Step 5)
- [ ] Seção Asset Library incluída quando account possui RDA/PMax via `list-assets` (Step 5b)
- [ ] Análise por keyword incluída para campanhas Search (Step 5.5)
- [ ] Cada recomendação tem suporte em dados específicos do relatório (Step 6)
- [ ] Checklist `report-validation.md` com 100% PASS (Step 7)
- [ ] Relatório final gerado a partir de `templates/performance-report.md`
- [ ] JSONs do CLI (5 níveis + assets quando aplicável) persistidos como anexos do relatório (auditoria)
- [ ] Nenhuma mutação executada — task estritamente read-only (Analyst não muta)

## Handoff
- **Próximo agente:** Campaign Optimizer (`*optimize`) caso recomendações exijam ação imediata
- **Artefato passado:** relatório consolidado + lista priorizada de ações
