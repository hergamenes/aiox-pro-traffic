# Mapa Objetivo → Métrica — Meta Ads

> **Propósito:** o relatório de performance deve cobrir **TODAS as campanhas da conta**, qualquer que seja o objetivo. Este mapa define, para cada objetivo de campanha da Meta, qual é o **resultado primário**, a **métrica-chave de custo**, o **funil** e as **métricas que NÃO se aplicam** (não exibir). O `generate-report.md` usa este mapa para montar as Seções 1, 2 e 3 corretamente por campanha.

## Como detectar o objetivo de cada campanha
Em ordem de preferência:
1. **Campo `objective` da campanha** (Graph API: `OUTCOME_SALES`, `OUTCOME_LEADS`, `OUTCOME_ENGAGEMENT`, `OUTCOME_TRAFFIC`, `OUTCOME_AWARENESS`, `OUTCOME_APP_PROMOTION`). Puxar SEMPRE via Graph API (`/act_{id}/campaigns?fields=name,objective,effective_status`). O CLI `report` NÃO retorna objective.
2. **Distinguir o DESTINO dentro de `OUTCOME_LEADS`** (crítico — ver aviso abaixo): uma campanha `OUTCOME_LEADS` pode ser **Formulário nativo (instant form)** OU **Click-to-WhatsApp**. Não dá para saber só pelo objective. Distinga por: (a) `optimization_goal`/`destination_type` do adset (`LEAD_GENERATION`/`ON_AD` = formulário; `CONVERSATIONS`/`WHATSAPP` = WhatsApp); ou (b) token no nome (`FORMNATIVO`/`FORM` vs `WHATSAPP`/`WPP`); ou (c) qual action type a campanha realmente gera (ver abaixo).
3. **Nunca use heurística por métrica não-zero para o tipo** — uma campanha de formulário com 0 leads na semana seria classificada errado. O tipo vem do objective+destino, não do volume.

> ✅ **CLI `report` corrigido (2026-06-08):** o campo `leads`/`costPerLead` agora captura leads de formulário nativo (`onsite_conversion.lead_grouped`/`lead`) + pixel de site (`offsite_conversion.fb_pixel_lead`), por preferência sem double-count. Conversas WhatsApp (`messagingConversationsStarted`) já funcionavam. **Use o CLI `report --level campaign` como fonte primária** dos números (leads E conversas vêm corretos por campanha).
>
> ⚠️ **Ainda atenção:** (a) o campo agregado `results`/`costPerResult` colapsa em contas MISTAS (a hierarquia escolhe 1 outcome: purchases > leads > conversas > cliques) — em contas com leads E conversas, leia os campos individuais (`leads` E `messagingConversationsStarted`), não `results`. (b) Uma mesma campanha pode gerar leads E conversas — reporte separado, nunca some. (c) Distinguir formulário nativo vs WhatsApp vem do `objective`+nome/optimization_goal (não do CLI).
>
> Action types canônicos (referência): leads formulário `onsite_conversion.lead_grouped`; conversas WhatsApp `onsite_conversion.messaging_conversation_started_7d`; compras `offsite_conversion.fb_pixel_purchase`.

## Mapa por objetivo

### OUTCOME_SALES — Vendas / Conversões
- **Resultado primário:** Compras (`purchases`)
- **KPI de custo:** CPA (`costPerPurchase`) + **ROAS** (`roas`)
- **Funil:** Impressão → Clique (CTR/CPC) → LP View (`landingPageViews`) → Checkout (`initiateCheckout`) → Compra (`purchases`)
- **Métricas-chave a exibir:** spend, purchases, costPerPurchase, roas, conversions, costPerConversion
- **Régua:** ROAS e CPA-alvo do `client-profile`

### OUTCOME_LEADS — Cadastros / Leads (3 subtipos!)
> No padrão atual da Meta, `OUTCOME_LEADS` engloba **três destinos diferentes**, cada um com métrica própria. SEMPRE separar no relatório:
> 1. **Formulário nativo (instant form)** → resultado = `onsite_conversion.lead_grouped`; KPI = custo por lead; funil Impressão → Clique → Lead.
> 2. **Conversão no site** → resultado = leads no site; funil Impressão → Clique → LP View → Lead.
> 3. **Click-to-WhatsApp** → resultado = `onsite_conversion.messaging_conversation_started_7d`; KPI = custo por conversa; funil Impressão → Clique → Conversa → 1ª Resposta. (NÃO exibir ROAS/CPA.)
- **Métricas-chave (form):** spend, leads (via lead_grouped), custo por lead, linkClicks, ctrLink
- **Atenção:** uma campanha pode gerar leads E conversas (anúncios com formulário + botão WhatsApp). Reportar os dois separadamente; nunca somar num único "resultado".
- **Régua:** CPL-alvo e custo/conversa-alvo do `client-profile` (por subtipo)

### OUTCOME_ENGAGEMENT — Engajamento (inclui Mensagens/WhatsApp)
> Subtipo **Mensagens/Click-to-WhatsApp (CTWA)** é o mais comum e tem tratamento próprio.
- **Mensagens/WhatsApp:**
  - **Resultado primário:** Conversas iniciadas (`messagingConversationsStarted`)
  - **KPI de custo:** Custo por conversa (`costPerMessagingConversation`)
  - **Funil:** Impressão → Clique → Conversa iniciada → 1ª Resposta (`messagingFirstReplies`)
  - **NÃO exibir:** ROAS, CPA, compras (Meta reporta 0 por design — a venda acontece no WhatsApp)
- **Engajamento de post/vídeo:** usar `results`/`costPerResult`; funil Impressão → Engajamento
- **Régua:** custo/conversa-alvo do `client-profile`

### OUTCOME_TRAFFIC — Tráfego
- **Resultado primário:** Cliques no link (`linkClicks`) ou LP Views (`landingPageViews`)
- **KPI de custo:** CPC (`cpcLink`) + CTR (`ctrLink`) + custo por LP view
- **Funil:** Impressão → Clique → LP View
- **Atenção (funil cego):** se não houver evento de destino medido após o clique, sinalizar no parecer (Seção 3) que falta medir o resultado final.

### OUTCOME_AWARENESS — Reconhecimento
- **Resultado primário:** Alcance / Impressões
- **KPI de custo:** CPM + Frequência
- **Funil:** Impressão → Alcance
- **NÃO exibir:** CPA/ROAS/conversões (objetivo não é resposta direta)

### OUTCOME_APP_PROMOTION — App
- **Resultado primário:** Instalações / eventos de app
- **KPI de custo:** custo por instalação/evento
- **Funil:** Impressão → Clique → Instalação → Evento

## Regra de consolidação (Seção 1 — Visão Geral)
Quando a conta tem **objetivos mistos**, NÃO somar resultados de tipos diferentes num único número. Em vez disso:
- Linha de **Investimento total** (soma de todas as campanhas).
- Um **quadro de resultados por tipo**: ex. "X compras (R$ Y CPA) · Z leads (R$ W CPL) · K conversas (R$ V custo/conversa)".
- O **gráfico diário** usa o objetivo **dominante** (maior gasto) — informar qual no título.

## Métricas universais (valem para todo objetivo — Seção 2)
spend, impressions, cpm, frequency, linkClicks, ctrLink, cpcLink. Sempre exibir, independentemente do objetivo.
