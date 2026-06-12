# Task: Generate Report

## Metadata
- **Agent:** Performance Analyst
- **Tipo:** Workflow analítico
- **Elicit:** true

## Objetivo
Gerar o **pacote de relatório no novo formato de 5 seções**, cobrindo **TODAS as campanhas da conta** (multi-objetivo: Vendas, Leads, Mensagens/WhatsApp, Tráfego, Alcance, App), com **gráfico diário** (SVG inline) e **links reais de mídia** dos anúncios do rank. A avaliação 🟢/🟡/🔴 de cada métrica vem da régua do `client-profile` do cliente — nunca de thresholds genéricos.

## Inputs
- **Cliente** (resolve o `client-profile` = régua de metas)
- **`account-id` da Meta Ads** (acessa via **ID posicional** no CLI — a conta pode não aparecer em `accounts`)
- **Período do relatório** (`--from YYYY-MM-DD --to YYYY-MM-DD`)
- **Período anterior** para comparação (opcional, recomendado)
- **`client-profile`** do cliente (`squads/traffic-meta/data/client-profiles/{cliente}.md`)
- **Mapa objetivo→métrica** (`squads/traffic-meta/data/objective-metric-map.md`)
- **Template alvo** (`squads/traffic-meta/templates/performance-report.md` — estrutura de 5 seções)
- **Optimization log** do cliente, se existir (alimenta a Seção 4)
- **CLI meta-ads autenticada** (`meta-ads auth status` = OK)

## Veto Conditions
NÃO gerar relatório se:
- ❌ Período não estiver definido (sem data início OU sem data fim)
- ❌ Cliente / `account-id` não resolvido (sem régua = sem avaliação de KPI)
- ❌ `meta-ads auth status` retornar expirado/não-configurado
- ❌ CLI `meta-ads report` retornar erro persistente (rede, account-id inválido)
- ❌ Soma da série diária NÃO bater com o total do período (Step 4)
- ❌ Checklist `report-validation.md` tiver qualquer item FAIL após Step 8
- ❌ Recomendações forem geradas sem suporte nos dados consolidados

---

## Convenções de execução
- **Binário CLI:** `meta-ads`
- **Account ID é posicional:** `meta-ads report <accountId> --from ... --to ...` (não usar flag `--account`).
- **Escopo do CLI `report`:** serve para **métricas universais** (impressões, CPM, frequência, cliques, CTR, CPC, spend) — válidas para qualquer objetivo. **NÃO** serve para contagem de leads/resultados de formulário nem para detectar `objective`: os campos `leads`/`costPerLead` vêm 0 e `results`/`costPerResult` não captura formulário nativo. Contagem de resultados e `objective` vêm da **Graph API** (Steps 3 e 3.5).
- **stdout é "sujo":** o CLI mistura linhas tipo `Consultando...` com o JSON. **Sempre extrair o JSON com regex** `/\[\s*\{[\s\S]*\}\s*\]/` antes de parsear.
- **Saída em:** `reports/{cliente-plataforma-id}/` (ex.: `reports/verbo-feminino-meta-884611416502961/`).

---

## Fluxo

### Step 0: Pré-validação
```bash
meta-ads auth status
```
- Se expirado/não-configurado → **BLOQUEAR** e guiar para `meta-ads auth setup`.
- **Carregar o `client-profile` do cliente** (`squads/traffic-meta/data/client-profiles/{cliente}.md`). Sem régua → BLOQUEAR. Esta régua define os cortes 🟢/🟡/🔴 usados em todas as seções.

**Pós-condição:** auth OK + régua de KPI carregada.

### Step 1: Coletar parâmetros
1. **Cliente** + **account-id** (posicional)
2. **Período atual** (`{de}`, `{ate}`)
3. **Período anterior** (`{prev-de}`, `{prev-ate}`) — opcional, recomendado para comparação

### Step 2: Coleta de TODAS as campanhas (4 níveis, período inteiro)
Puxar os 4 níveis do período. **Incluir todas as campanhas, de TODOS os objetivos** — não filtrar só WhatsApp.

```bash
meta-ads report {accountId} \
  --from {de} --to {ate} --level account  --format json > /tmp/account.json
meta-ads report {accountId} \
  --from {de} --to {ate} --level campaign --format json > /tmp/campaigns.json
meta-ads report {accountId} \
  --from {de} --to {ate} --level adset    --format json > /tmp/adsets.json
meta-ads report {accountId} \
  --from {de} --to {ate} --level ad       --format json > /tmp/ads.json
# Período anterior (comparação) — pelo menos nível account + campaign
meta-ads report {accountId} \
  --from {prev-de} --to {prev-ate} --level account  --format json > /tmp/account-prev.json
meta-ads report {accountId} \
  --from {prev-de} --to {prev-ate} --level campaign --format json > /tmp/campaigns-prev.json
```
Parsear cada arquivo extraindo o JSON com a regex `/\[\s*\{[\s\S]*\}\s*\]/`.

**Pós-condição:** dataset de account/campaign/adset/ad do período atual + comparação.

### Step 3: Detecção de objetivo por campanha (multi-objetivo)
Para **cada campanha**, seguir `objective-metric-map.md` (seção "Como detectar o objetivo"). O CLI `report` **NÃO** retorna `objective` → a detecção é via Graph API:

1. **Campo `objective` via Graph API** (fonte de verdade — não inferir por métrica):
   ```bash
   # token via keytar (NÃO imprimir) — ver Step 5 para leitura segura
   GET /act_{accountId}/campaigns?fields=name,objective,effective_status
   ```
   Mapeia para `OUTCOME_SALES | OUTCOME_LEADS | OUTCOME_ENGAGEMENT | OUTCOME_TRAFFIC | OUTCOME_AWARENESS | OUTCOME_APP_PROMOTION`.
2. **Distinguir o DESTINO dentro de `OUTCOME_LEADS`** (crítico — Formulário nativo vs Click-to-WhatsApp). NÃO dá para saber só pelo `objective`. Distinguir por:
   - (a) **`optimization_goal`/`destination_type` do adset:** `LEAD_GENERATION`/`ON_AD` = Formulário nativo; `CONVERSATIONS`/`WHATSAPP` = Click-to-WhatsApp;
   - (b) **token no nome:** `FORMNATIVO`/`FORM` = Formulário; `WHATSAPP`/`WPP` = WhatsApp;
   - (c) **action type realmente gerado** (ver Step 3.5): `onsite_conversion.lead_grouped` = Formulário; `onsite_conversion.messaging_conversation_started_7d` = WhatsApp.
3. ⚠️ **NUNCA classificar o tipo por volume de métrica.** Uma campanha de formulário com 0 leads na semana seria classificada errado. O tipo vem do `objective` + destino, **não** do volume. (O CLI `report` ainda traz `leads`/`results` não-confiáveis — não usar para tipagem nem para contagem; ver Step 3.5.)

Para cada campanha, definir:
- **Resultado primário** (ex.: purchases / leads / messagingConversationsStarted / linkClicks)
- **KPI de custo** (ex.: costPerPurchase+ROAS / costPerLead / costPerMessagingConversation / cpcLink)
- **Funil correto** (ver mapa) e **métricas que NÃO se aplicam** (não exibir — ex.: ROAS/CPA em campanha WhatsApp).

**Regra de consolidação (Seção 1):** com objetivos mistos, NÃO somar resultados de tipos diferentes num único número. Usar:
- Linha de **Investimento total** (soma de todas as campanhas).
- **Quadro de resultados por tipo** (ex.: "X compras (R$ Y CPA) · Z leads (R$ W CPL) · K conversas (R$ V custo/conversa)").
- **Objetivo dominante = maior gasto** → define a métrica do gráfico diário (informar qual no título do gráfico).

### Step 3.5: Coleta de resultados via Graph API `actions` (FONTE DE VERDADE)
> ⚠️ **Por que não usar o CLI para contagem de resultados:** o campo `leads`/`costPerLead` do CLI `report` vem **sempre 0** mesmo com leads de formulário nativo; e `results`/`costPerResult` **não captura corretamente** os leads de formulário (pode refletir cliques/outro evento). Por isso a contagem de resultados (leads, conversas, compras) vem **sempre** da Graph API `actions`, nunca do CLI.

1. **Endpoint (nível campanha):**
   ```bash
   # token via keytar (NÃO imprimir) — ver Step 5
   GET /act_{accountId}/insights?level=campaign&time_range={"since":"{de}","until":"{ate}"}\
       &fields=campaign_name,spend,actions,cost_per_action_type
   ```
2. **Action types a extrair de `actions[]` (separados, nunca somados):**
   - **Leads de formulário nativo:** `onsite_conversion.lead_grouped` (fallback `lead`)
   - **Conversas WhatsApp:** `onsite_conversion.messaging_conversation_started_7d`
   - **Compras:** `purchase` (fallback `offsite_conversion.fb_pixel_purchase`)
   - Custo por resultado: ler de `cost_per_action_type[]` pelo mesmo `action_type`, ou calcular `spend ÷ resultado`.
3. **Regra crítica:** uma mesma campanha pode gerar **leads E conversas** (anúncio com formulário + botão WhatsApp). **Reportar os dois eventos separadamente** — nunca somar `leads + conversas` num único "resultado".
4. **Série diária:** repetir o endpoint com `time_increment=1` para obter o breakdown por dia (alternativa ao loop 1-chamada-por-dia do Step 4 quando se quer a série de leads/conversas, que o CLI não fornece corretamente).

### Step 4: Série diária (para o gráfico da Seção 1)
O CLI **não tem breakdown por dia** → rodar **1 chamada por dia** no período, nível account:
```bash
# para cada dia D em [de..ate]:
meta-ads report {accountId} \
  --from {D} --to {D} --level account --format json   # extrair JSON com a regex
```
Para cada dia extrair: **resultado primário do objetivo dominante** (ex.: `messagingConversationsStarted` / `purchases` / `leads`) e o **custo por resultado** do dia (spend ÷ resultado).

**Validação obrigatória:** soma dos dias (spend e resultado) **deve bater** com o total do período do Step 2. Se não bater → investigar antes de prosseguir (veto).

### Step 5: Links de mídia dos anúncios do rank
Para os anúncios que entrarão no rank (Seção 2.5), obter o link real da mídia.

1. Pegar `adId` de cada anúncio do rank via `/tmp/ads.json` (`report --level ad`).
2. **Caminho preferido:** MCP `claude_ai_Facebook`. Se retornar `not enabled for Ads MCP`, usar o fallback abaixo.
3. **Fallback que funciona (Graph API):**
   - Ler o token do **keychain** via keytar (service `meta-ads-agent`), módulo em `packages/meta-ads-agent/node_modules/keytar`. **NUNCA imprimir o token** (não logar, não escrever em arquivo).
   - Para cada `adId`, chamar Graph API **v21.0**:
     `GET /{adId}?fields=creative{instagram_permalink_url,effective_object_story_id,video_id,image_url}`
   - Usar **`instagram_permalink_url`** como link da mídia (fallback para `effective_object_story_id` / `image_url` se ausente).
   - Marcar 🎬 (vídeo, se `video_id` presente) ou 🖼 (imagem).

> Exemplo de leitura segura do token (Node, sem imprimir):
> ```js
> const keytar = require('./packages/meta-ads-agent/node_modules/keytar');
> const token = await keytar.getPassword('meta-ads-agent', '<account>'); // NÃO imprimir
> ```

### Step 6: Comparação de período + enriquecimento MCP (quando disponível)
- Calcular variação (%/pp) de cada métrica vs período anterior (`/tmp/*-prev.json`).
- **Enriquecimento opcional (graceful — pular se MCP indisponível):**
  - `industry_benchmark` → posiciona CPA/ROAS/CTR/CPM/custo-conversa vs setor (parecer Seção 3).
  - `performance_trend` → tendência nativa Meta (Seção 1/3).
  - `anomaly_signal` → anomalias do período (parecer Seção 3).
  - `opportunity_score` → confirma o que escalar (Seção 5).

### Step 7: Montar as 5 seções (template `performance-report.md`)
Preencher conforme o template e o piloto (`reports/verbo-feminino-meta-884611416502961/_piloto-novo-formato/`):

- **Seção 1 — Visão Geral:** tabela de indicadores (Atual × Anterior × Variação, com 🟢/🟡/🔴 da régua) + **quadro de resultados POR TIPO** quando a conta tem objetivos/destinos mistos (ex.: "X compras (R$ Y CPA) · Z leads de formulário (R$ W CPL) · K conversas WhatsApp (R$ V custo/conversa)") — contagens vindas do Step 3.5 (Graph API `actions`), **nunca somando tipos diferentes** + **1.1 Evolução diária** (tabela + leitura do gráfico).
- **Seção 2 — Visão do Tráfego:** 2.1 funil de métricas Meta · 2.2 funil de conversão por etapas (conforme objetivo) · 2.3 Rank Melhores Campanhas · 2.4 Rank Melhores Conjuntos · 2.5 **Rank Melhores Anúncios com mídia** (link real do Step 5).
- **Seção 3 — Parecer de Performance Geral:** 🟢 BOM / 🔴 RUIM / 🟡 MELHORAR (com benchmark/anomalia se houver).
- **Seção 4 — Insights das Otimizações Realizadas:** alimentada pelo `optimization-log`; se não houver, registrar **hipóteses** marcadas como "a confirmar" (nunca assumir como fato).
- **Seção 5 — Novas Otimizações (Próximas Ações):** priorizadas por **R$ desperdiçado × esforço**; detalhe completo vai no `action-list-priorizada.md`.

### Step 8: Validação
Executar `checklists/report-validation.md`. **100% PASS** antes de entregar. Se algum FAIL → corrigir e revalidar.

### Step 9: Saída — pacote completo
Gerar e salvar em `reports/{cliente-plataforma-id}/`:

1. **`performance-report-{de}_a_{ate}.md`** — relatório técnico das 5 seções.
2. **`resumo-cliente.md`** — 1 página, linguagem simples, sem jargão.
3. **`action-list-priorizada.md`** — ações por impacto financeiro × esforço (P1..Pn, dono, status).
4. **`apresentacao-cliente.html`** — versão visual com **branding Solaro** (paleta `#E8453C`/`#FF6F43`/`#FFB300`, fontes Poppins/Montserrat, logo) e o **gráfico diário em SVG inline** (barras = resultado/dia + linha = custo por resultado, eixo duplo). **NÃO usar Chart.js** — SVG inline puro.
5. **`apresentacao-cliente.pdf`** — gerado do HTML via **Chrome headless** (ver MEMORY: design system Solaro).

> Referência de gráfico SVG e branding: `reports/verbo-feminino-meta-884611416502961/_piloto-novo-formato/apresentacao-cliente.html`.

**PDF via Chrome headless (exemplo):**
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="reports/{cliente-plataforma-id}/apresentacao-cliente.pdf" \
  "file://$(pwd)/reports/{cliente-plataforma-id}/apresentacao-cliente.html"
```

## Acceptance Criteria
- [ ] `meta-ads auth status` OK e `client-profile` (régua) carregado (Step 0)
- [ ] 4 níveis coletados via ID posicional, **todas as campanhas de todos os objetivos** (Step 2)
- [ ] JSON extraído com regex `/\[\s*\{[\s\S]*\}\s*\]/` (stdout sujo) (Step 2/4)
- [ ] Objetivo detectado via Graph API `objective` (nunca por volume de métrica) + destino em `OUTCOME_LEADS` distinguido (Formulário nativo vs WhatsApp) (Step 3)
- [ ] Resultados (leads de formulário, conversas WhatsApp, compras) coletados via Graph API `actions` — `lead_grouped` / `messaging_conversation_started_7d` / `purchase` — leads e conversas reportados separadamente (Step 3.5)
- [ ] Quadro de resultados por tipo (não somar tipos diferentes) + objetivo dominante definido (Step 3/3.5)
- [ ] Série diária coletada (1 chamada/dia) e **soma bate com o total do período** (Step 4)
- [ ] Links de mídia reais dos anúncios do rank (MCP ou fallback Graph API v21.0) **sem imprimir o token** (Step 5)
- [ ] Comparação com período anterior + enriquecimento MCP quando disponível (graceful) (Step 6)
- [ ] 5 seções montadas conforme template + piloto; ações priorizadas por R$×esforço (Step 7)
- [ ] Checklist `report-validation.md` 100% PASS (Step 8)
- [ ] Pacote completo salvo em `reports/{cliente-plataforma-id}/`: `performance-report-{de}_a_{ate}.md` + `resumo-cliente.md` + `action-list-priorizada.md` + `apresentacao-cliente.html` (SVG inline, branding Solaro) + `apresentacao-cliente.pdf` (Chrome headless) (Step 9)

## Handoff
- **Próximo agente:** Campaign Optimizer (`*optimize`) caso a Seção 5 / `action-list` exija ação imediata.
- **Artefato passado:** pacote de relatório + `action-list-priorizada.md`.
