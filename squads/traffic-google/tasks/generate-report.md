# Task: Generate Report (Google Ads — formato 5 seções, multi-objetivo)

## Metadata
- **Agent:** Performance Analyst
- **Tipo:** Workflow analítico
- **Elicit:** true
- **Formato de saída:** Novo formato de **5 seções** (multi-objetivo, gráfico diário, links de mídia)
- **Read-only:** SIM — Analyst nunca muta a conta

## Objetivo
Gerar um pacote completo de relatório de performance de **UMA conta Google Ads** (ou árvore MCC), cobrindo **TODAS as campanhas** quaisquer que sejam os tipos/objetivos (Search vendas, Search leads/formulário nativo, PMax, Display, Video, Shopping, Demand Gen, App), no novo formato de 5 seções, com gráfico de evolução diária e links de mídia dos anúncios do rank.

> **Modelo de saída (estrutura idêntica):** `reports/verbo-feminino-meta-884611416502961/_piloto-novo-formato/` (é da Meta, mas a ESTRUTURA das 5 seções é a mesma).

## Inputs
- **Cliente** (qual empresa/conta — isolamento obrigatório, NUNCA cruzar dados entre clientes)
- **`client-profile`** do cliente (réguas de avaliação: meta de CPA/CPL/ROAS, o que é 🟢/🟡/🔴) — em `reports/{cliente-plataforma-id}/client-profile.md`
- **Período do relatório** (`--from YYYY-MM-DD --to YYYY-MM-DD`)
- **`customer-id`** da conta (10 dígitos) — argumento posicional do CLI
- **MCC:** se a conta está sob um manager, o `--login-customer-id <mcc>` é obrigatório
- **Período anterior** para comparação (default: janela imediatamente anterior de mesmo tamanho)
- **Mapa objetivo→métrica:** `data/objective-metric-map.md`
- **Benchmarks de indústria:** `data/industry-benchmarks.md` (NÃO há MCP de benchmark no Google — a régua vem desta tabela interna por nicho)
- **Thresholds de KPI:** `data/kpi-thresholds.md`
- **Convenções UTM:** `data/utm-conventions.md`
- **CLI google-ads autenticada** (`google-ads auth status` = OK)
- **Branding Solaro** (quando cliente da agência Solaro): logo + paleta no HTML/PDF

> Dados vêm em **tempo real via CLI** (`google-ads report --format json`) nos 5 níveis: account, campaign, ad_group, ad, **keyword**.

## Veto Conditions
NÃO gerar relatório se:
- ❌ Cliente/escopo não estiver definido (risco de cruzar dados entre contas)
- ❌ Período não estiver definido (sem `--from` OU sem `--to`)
- ❌ `google-ads auth status` retornar expirado/não-configurado
- ❌ CLI `google-ads report` retornar erro persistente (rede, customer-id inválido, MCC sem `--login-customer-id`)
- ❌ Soma das séries diárias **não bater** com o total do período (Step 4)
- ❌ Métricas básicas (Investimento, Cliques, Impressões) inconsistentes entre níveis
- ❌ Checklist `report-validation.md` com qualquer item FAIL após Step 10
- ❌ Recomendações geradas sem suporte nos dados consolidados

---

## Fluxo

### Step 1 — Pré-validação + Profile do cliente
**Pré-condição:** cliente e período informados.

1. Autenticação:
   ```bash
   google-ads auth status
   ```
   - Se expirado → BLOQUEAR e guiar para `google-ads auth setup`.
2. Carregar `client-profile.md` do cliente (réguas de CPA/CPL/ROAS, nicho, moeda). Se não existir, criar mínimo com o usuário antes de seguir (sem régua não há 🟢/🟡/🔴).
3. **Detecção de escopo MCC:** verificar se o `customer-id` é um manager:
   ```bash
   google-ads accounts --tree
   ```
   - Se for MCC → coletar child accounts (read-only) e iterar a coleta por conta, usando `--login-customer-id <mcc>`.
   - Se for single account → fluxo padrão.

**Pós-condição:** auth OK, profile carregado, escopo (single | MCC tree) definido.

---

### Step 2 — Coleta de TODAS as campanhas (tempo real, 5 níveis)
**Pré-condição:** Step 1 OK.

Puxar JSON em todos os níveis, período atual e anterior. Em MCC, repetir por child account com `--login-customer-id`.

```bash
GA="google-ads"
CID=<customer-id>            # posicional; em MCC adicionar: --login-customer-id <mcc>
FROM=<de>; TO=<ate>
PFROM=<de-anterior>; PTO=<ate-anterior>

# Período atual
$GA report $CID --from $FROM --to $TO --level account   --format json > /tmp/g-account.json
$GA report $CID --from $FROM --to $TO --level campaign  --format json > /tmp/g-campaigns.json
$GA report $CID --from $FROM --to $TO --level ad_group  --format json > /tmp/g-adgroups.json
$GA report $CID --from $FROM --to $TO --level ad        --format json > /tmp/g-ads.json
$GA report $CID --from $FROM --to $TO --level keyword   --format json > /tmp/g-keywords.json

# Período anterior (comparação)
$GA report $CID --from $PFROM --to $PTO --level campaign --format json > /tmp/g-campaigns-prev.json
$GA report $CID --from $PFROM --to $PTO --level account  --format json > /tmp/g-account-prev.json
```

- Incluir **todos os tipos** de campanha (Search vendas, Search leads/formulário nativo, PMax, Display, Video, Shopping, Demand Gen, App). NÃO filtrar por tipo.
- O JSON do CLI já traz `segments.date` em cada linha (uma linha por entidade **por dia**) → é a base da série diária do Step 4.

**Pós-condição:** 5 JSONs do período atual + 2 do anterior persistidos (auditoria).

---

### Step 3 — Detecção de tipo/objetivo por campanha (multi-objetivo)
**Pré-condição:** Step 2 OK. **Guia:** `data/objective-metric-map.md`.

Para CADA campanha, determinar tipo e objetivo na ordem:
1. `advertising_channel_type` (SEARCH, PERFORMANCE_MAX, DISPLAY, VIDEO, SHOPPING, DEMAND_GEN, MULTI_CHANNEL/App).
2. Meta de conversão dominante (compra → vendas; lead/lead form → leads; chamada; etc.).
3. Heurística por nome (fallback): tokens PESQUISA/SEARCH, PMAX, DISPLAY, VIDEO/YOUTUBE, SHOPPING, INSTITUCIONAL, LEAD, VENDAS.

Para cada campanha, fixar conforme o mapa:
- **Resultado primário** (ex.: vendas / leads / conversões / views / instalações).
- **KPI de custo** (CPA / CPL / ROAS / CPV / CPM / custo por instalação).
- **Funil** correto (ex.: Impressão→Clique→Conversão; ou Impressão→View→Conversão para Video).

**Regra de consolidação (Seção 1):** objetivos mistos NÃO viram um único número. Montar **quadro de resultados por tipo** (ex.: "X vendas a R$Y CPA · ROAS Z · K leads a R$W CPL"). Investimento total é a soma de tudo.

**Pós-condição:** cada campanha rotulada com {tipo, objetivo, resultado primário, KPI, funil}.

---

### Step 4 — Série diária (gráfico da Seção 1)
**Pré-condição:** Step 3 OK.

1. **Objetivo dominante:** identificar o objetivo com maior gasto no período (o gráfico usa ele; informar qual no título).
2. **Montar a série diária:**
   - **Caminho preferido:** agrupar as linhas de `/tmp/g-campaigns.json` por `segments.date`, somando `cost` e `conversions` (das campanhas do objetivo dominante) e calculando `custo por conversão` de cada dia.
   - **Fallback:** se o JSON vier pré-agregado (sem `segments.date` por linha), rodar 1 chamada por dia no período (`--from D --to D`) e extrair `cost` + `conversions` do objetivo dominante.
3. **Validação obrigatória:** soma dos dias = total do período (gasto e conversões). Se não bater → veto (Step não passa).
4. Marcar dias fora da curva (🔴 pior dia / 🟢 melhor dia) para a leitura do gráfico.

**Pós-condição:** tabela/série diária (dia · investimento · resultado · custo por resultado) com soma conferida.

---

### Step 5 — Nível keyword + Impression Share + Asset Library
**Pré-condição:** Steps 2–3 OK.

**5.1 — Keywords (campanhas Search):** a partir de `/tmp/g-keywords.json`:
- Top keywords por **gasto**.
- Top keywords por **conversão / ROAS**.
- Keywords com **gasto alto e poucas/zero conversões** → candidatas a **negativação/pause** (entram no Step 8 com R$ desperdiçado).

**5.2 — Impression Share (Search):** quando disponível, reportar `search_impression_share` e perda por orçamento (`lost IS budget`) e por rank (`lost IS rank`). Se o CLI não expuser o campo na versão atual, anotar como "não disponível nesta coleta" — não inventar.

**5.3 — Asset Library (apenas RDA / Performance Max):** quando houver campanhas RDA/PMax, inventariar assets (read-only):
```bash
$GA list-assets $CID --type ALL --format json > /tmp/g-assets.json   # IMAGE/VIDEO/TEXT
```
- Quantidade por tipo, reuso cross-campaign, gaps (PMax sem vídeo, RDA sem long headlines).
- Omitir a seção se não houver RDA/PMax.

**Pós-condição:** análise de keyword + IS + (assets quando aplicável) prontas.

---

### Step 6 — Links de mídia dos anúncios do rank
**Pré-condição:** ranking de anúncios do Step 7 (preencher coluna **Mídia / Link** da Seção 2.5).

O "criativo" no Google depende do tipo de campanha:
- **Search (RSA):** não há permalink de mídia. Montar um **preview do anúncio** a partir do nível `ad`: combinar **headlines** + **descriptions** + **final URL**. Exibir como bloco de texto (ex.: `H1 | H2 | H3 — Descrição… → final_url`) e linkar a **final URL** real do anúncio.
- **Display / Video (YouTube) / PMax:** usar o **asset/URL final** quando disponível (vídeo do YouTube, imagem do asset, landing final). Para Video, linkar a URL do vídeo; para Display/PMax, a imagem do asset ou a landing.
- **Como obter:** os campos de RSA (headlines/descrições/final URL) e os asset URLs vêm do nível `ad` / `list-assets`. Se a versão atual do CLI não expuser headlines do RSA no JSON de `report --level ad`, complementar com `google-ads ad <ad-id>` (read-only) quando disponível; se nada estiver disponível, preencher a coluna com o **nome do anúncio + final URL** e anotar a limitação — nunca inventar URL.

**Pós-condição:** coluna Mídia/Link preenchida com preview/URL real (ou nome+URL com limitação anotada).

---

### Step 7 — Rankings, funil e comparação de períodos
**Pré-condição:** Steps 2–6.

1. **Rank de campanhas** (melhor→pior pelo KPI do objetivo de cada uma).
2. **Rank de grupos de anúncios** (público/tema; gasto, conversões, CPA/CPL, CTR).
3. **Rank de anúncios** (top e bottom; com coluna Mídia/Link do Step 6).
4. **Funil** por objetivo dominante (Impressão→Clique→Conversão; Video usa View).
5. **Comparação atual vs anterior** (cálculo manual a partir dos JSONs): variação % de cada métrica, com detecção de **tendência** (melhora/piora/estável) e **anomalia** (dia/campanha fora da curva). NÃO há MCP de trend no Google — tudo calculado no pipeline.
6. **Benchmark:** ancorar as réguas com `data/industry-benchmarks.md` (por nicho do cliente) — ex.: "CPL de R$X está Y% acima/abaixo da média do segmento".

**Pós-condição:** rankings + funil + comparação + benchmark prontos.

---

### Step 8 — Priorização de ações (R$ desperdiçado × esforço)
**Pré-condição:** Steps 5–7.

Montar a lista priorizada por **impacto financeiro × esforço**:
- **Negativar/pausar keywords** com gasto alto e poucas conversões (R$ desperdiçado/mês estimado).
- **Realocar budget** de campanhas/grupos ruins para os campeões.
- **Escalar** os melhores performers (gradual, p/ não resetar aprendizado).
- **Testar** (novas keywords, novos públicos/assets, novos RSAs).
- Cada ação ancorada em **dado específico** do relatório (sem invenção).

**Pós-condição:** `action-list-priorizada.md` com prioridades P1..Pn.

---

### Step 9 — Montar as 5 seções (template) + pacote de saída
**Pré-condição:** Steps 1–8. **Template:** `templates/performance-report.md` (5 seções).

**As 5 seções (mesma estrutura do piloto Meta):**
1. **Visão Geral** — quadro de resultados por objetivo + variação vs anterior + **gráfico/série de evolução diária** (Step 4) e sua leitura.
2. **Visão do Tráfego** — funil de métricas (atual vs anterior), funil de conversão por etapas, e os **ranks** (campanhas, grupos, anúncios com Mídia/Link). Inclui keywords, Impression Share e Asset Library quando aplicável.
3. **Parecer de Performance Geral** — 🟢 bom / 🔴 ruim / 🟡 a melhorar, ancorado nas réguas do `client-profile` e no benchmark.
4. **Insights das Otimizações Realizadas** — cruzar `optimization-log` (ações registradas) com a variação das métricas; o que cada mexida causou (hipótese vs confirmado).
5. **Novas Otimizações (Próximas Ações)** — tabela priorizada do Step 8 (impacto × esforço).

**Pacote de saída completo (salvar em `reports/{cliente-plataforma-id}/`):**
- `performance-report-{de}_a_{ate}.md` — relatório técnico nas 5 seções.
- `resumo-cliente.md` — resumo executivo de 1 página, linguagem do cliente.
- `apresentacao-cliente.html` — apresentação com **gráfico SVG inline** (série diária do Step 4) e **branding Solaro** (logo + paleta) quando cliente da agência.
- `apresentacao-cliente.pdf` — gerado do HTML via **Chrome headless**:
  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless --disable-gpu --print-to-pdf="reports/{cliente-plataforma-id}/apresentacao-cliente.pdf" \
    --no-pdf-header-footer "reports/{cliente-plataforma-id}/apresentacao-cliente.html"
  ```
- `action-list-priorizada.md` — lista priorizada (Step 8).
- **Anexos de auditoria:** os JSONs do CLI (5 níveis atuais + 2 anteriores + assets quando aplicável).

> **Convenção de pasta:** todo relatório vai para `reports/{cliente-plataforma-id}/` na raiz do projeto (ex.: `reports/grupo-prestarh-google-9631900143/`).

**Pós-condição:** pacote completo gravado na pasta do cliente.

---

### Step 10 — Validação
**Pré-condição:** Step 9. Executar `checklists/report-validation.md`:
- 100% PASS → entregar o pacote.
- Qualquer FAIL → corrigir e revalidar (veto se persistir).

---

## Output
- Pacote completo: `performance-report-{de}_a_{ate}.md` + `resumo-cliente.md` + `apresentacao-cliente.html` + `apresentacao-cliente.pdf` + `action-list-priorizada.md`.
- Resumo executivo de 1 página.
- Lista priorizada de ações (impacto × esforço).

## Acceptance Criteria
- [ ] `google-ads auth status` OK e `client-profile` do cliente carregado (Step 1)
- [ ] Escopo MCC detectado via `accounts --tree`; coleta com `--login-customer-id` quando aplicável (Step 1)
- [ ] Dados puxados via `google-ads report --format json` nos 5 níveis (account/campaign/ad_group/ad/keyword), período atual e anterior (Step 2)
- [ ] TODAS as campanhas incluídas, qualquer tipo/objetivo (Search vendas/leads, PMax, Display, Video, Shopping) — sem filtrar tipo (Step 2)
- [ ] Cada campanha rotulada por tipo/objetivo via `objective-metric-map.md`, com resultado primário + KPI + funil corretos (Step 3)
- [ ] Quadro de resultados por objetivo na Seção 1 (objetivos mistos não somados num único número) (Step 3)
- [ ] Série diária do objetivo dominante montada e **soma diária = total** validada (Step 4)
- [ ] Análise de keyword (top gasto, top conversão/ROAS, candidatas a negativa) (Step 5.1)
- [ ] Impression Share reportado para Search quando disponível (Step 5.2)
- [ ] Asset Library inventariada quando há RDA/PMax (Step 5.3)
- [ ] Coluna Mídia/Link preenchida: preview RSA (headlines+descrições+final URL) p/ Search; asset/URL p/ Display/Video/PMax (Step 6)
- [ ] Rankings (campanha, grupo, anúncio), funil e comparação atual vs anterior com tendência/anomalia (Step 7)
- [ ] Réguas ancoradas em `industry-benchmarks.md` (sem MCP) (Step 7)
- [ ] Ações priorizadas por R$ desperdiçado × esforço, incluindo negativação de keywords e realocação de budget (Step 8)
- [ ] Relatório montado nas **5 seções** a partir de `templates/performance-report.md` (Step 9)
- [ ] Pacote completo gerado: `.md` técnico + `resumo-cliente.md` + `.html` (SVG inline + branding Solaro) + `.pdf` (Chrome headless) + `action-list-priorizada.md` em `reports/{cliente-plataforma-id}/` (Step 9)
- [ ] JSONs do CLI persistidos como anexos de auditoria (Step 9)
- [ ] Checklist `report-validation.md` 100% PASS (Step 10)
- [ ] Nenhuma mutação — task estritamente read-only

## Handoff
- **Próximo agente:** Campaign Optimizer (`*optimize`) caso as recomendações exijam ação imediata.
- **Artefato passado:** pacote de relatório + `action-list-priorizada.md`.
