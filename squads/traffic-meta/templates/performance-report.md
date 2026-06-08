# Relatório de Performance — {{client_name}}

> **INSTRUÇÃO DE PREENCHIMENTO (ler antes de gerar):**
> Este relatório cobre **TODAS as campanhas da conta**, qualquer que seja o objetivo: Tráfego, Vendas/Conversões, Engajamento (inclui Mensagens/WhatsApp), Leads (formulário nativo ou conversão no site), Reconhecimento e App.
> A **métrica-chave de cada campanha** é definida pelo objetivo dela conforme `squads/traffic-meta/data/objective-metric-map.md`. NUNCA exiba uma métrica que não se aplica ao objetivo (ex.: ROAS/CPA em campanha de WhatsApp, conversões em Reconhecimento).
> Detecte o objetivo na ordem: campo `objective` da campanha → heurística por métrica não-zero → heurística por nome (ver o mapa).
> Quando a conta tem **objetivos mistos**, use a **Regra de consolidação** do mapa na Seção 1: não somar resultados de tipos diferentes num único número; mostrar um quadro de resultados por tipo e usar o objetivo **dominante** (maior gasto) no gráfico diário.

| | |
|---|---|
| **Cliente** | {{client_name}} |
| **Conta Meta** | `{{account_id}}` |
| **Plataforma** | Meta Ads (Facebook/Instagram) |
| **Objetivos na conta** | {{objectives_summary}} |
| **Período analisado** | {{period_start}} – {{period_end}} ({{period_days}} dias) |
| **Período de comparação** | {{compare_start}} – {{compare_end}} ({{compare_days}} dias anteriores) |
| **Gerado em** | {{generated_at}} · **Versão** {{report_version}} |
| **Moeda** | {{currency}} |

---

## 1. Visão Geral

Indicadores de resultado do período, comparados ao período anterior.

> **Resultados consolidados por tipo de objetivo.** Quando a conta tem objetivos mistos, NÃO somar tipos diferentes. Use a linha de **Investimento total** + um **quadro de resultados por tipo** (ver `objective-metric-map.md`).

| Indicador | Atual ({{period_short}}) | Anterior ({{compare_short}}) | Variação |
|-----------|--------------------------|-------------------------------|----------|
| 💰 **Investimento total** | R$ {{total_spend}} | R$ {{prev_total_spend}} | {{spend_variation}} |
| 🎯 **Resultados** (consolidado por tipo) | {{results_by_type}} | {{prev_results_by_type}} | {{results_variation}} |
| 💵 **Custo por resultado** (por tipo) | {{cost_per_result_by_type}} | {{prev_cost_per_result_by_type}} | {{cpr_variation}} |

> **Quadro de resultados por tipo** (preencher uma linha por objetivo presente na conta — omitir os ausentes):
> - 🛒 Vendas: {{purchases}} compras · CPA R$ {{cost_per_purchase}} · ROAS {{roas}}
> - 📝 Leads: {{leads}} leads · CPL R$ {{cost_per_lead}}
> - 💬 Mensagens/WhatsApp: {{conversations}} conversas · R$ {{cost_per_conversation}}/conversa
> - 🚦 Tráfego: {{link_clicks}} cliques · CPC R$ {{cpc_link}}
> - 📣 Reconhecimento: {{reach}} alcance · CPM R$ {{cpm}}
> - 📱 App: {{app_installs}} instalações · R$ {{cost_per_install}}/instalação

{{overview_note}}

### 1.1 Evolução diária (resultado × custo por resultado)

> Tabela dia × resultado × custo por resultado. Alimenta o **gráfico de evolução**. Objetivo dominante (maior gasto): **{{dominant_objective}}** — a coluna "Resultado" reflete a métrica-chave desse objetivo.

| Dia | Investimento | Resultado ({{dominant_result_label}}) | Custo por resultado |
|-----|--------------|----------------------------------------|---------------------|
| {{day_1}} | R$ {{day_1_spend}} | {{day_1_result}} | R$ {{day_1_cpr}} |
| {{day_2}} | R$ {{day_2_spend}} | {{day_2_result}} | R$ {{day_2_cpr}} |
| {{day_3}} | R$ {{day_3_spend}} | {{day_3_result}} | R$ {{day_3_cpr}} |
| {{day_4}} | R$ {{day_4_spend}} | {{day_4_result}} | R$ {{day_4_cpr}} |
| {{day_5}} | R$ {{day_5_spend}} | {{day_5_result}} | R$ {{day_5_cpr}} |
| {{day_6}} | R$ {{day_6_spend}} | {{day_6_result}} | R$ {{day_6_cpr}} |
| {{day_7}} | R$ {{day_7_spend}} | {{day_7_result}} | R$ {{day_7_cpr}} |
| **Total** | **R$ {{total_spend}}** | **{{total_result}}** | **R$ {{total_cpr}}** |

> **Leitura do gráfico:** {{chart_reading}}

**Leitura:** {{overview_reading}}

---

## 2. Visão do Tráfego

### 2.1 Funil de métricas universais — Meta (conta)

> Estas métricas valem para **todo objetivo** e são sempre exibidas (ver `objective-metric-map.md`).

| Métrica | Atual | Anterior | Variação |
|---------|-------|----------|----------|
| Impressões | {{impressions}} | {{prev_impressions}} | {{impressions_var}} |
| CPM | R$ {{cpm}} | R$ {{prev_cpm}} | {{cpm_var}} |
| Frequência | {{frequency}} | {{prev_frequency}} | {{frequency_var}} |
| Cliques no link | {{link_clicks}} | {{prev_link_clicks}} | {{clicks_var}} |
| CTR (link) | {{ctr_link}}% | {{prev_ctr_link}}% | {{ctr_var}} |
| CPC (link) | R$ {{cpc_link}} | R$ {{prev_cpc_link}} | {{cpc_var}} |

### 2.2 Funil de conversão — POR OBJETIVO

> **O funil muda conforme o objetivo da campanha** (fonte: `objective-metric-map.md`). Preencher o(s) bloco(s) correspondente(s) às campanhas presentes na conta; omitir os ausentes. Mostrar etapas e taxas de conversão entre elas.

**🛒 Vendas/Conversões:** Impressão → Clique (CTR/CPC) → LP View → Checkout → Compra · KPI: CPA + ROAS

**📝 Leads (form nativo):** Impressão → Clique → Lead · KPI: CPL
**📝 Leads (site):** Impressão → Clique → LP View → Lead · KPI: CPL

**💬 Mensagens/WhatsApp:** Impressão → Clique → Conversa iniciada → 1ª Resposta · KPI: custo/conversa · _NÃO exibir ROAS/CPA/compras (Meta reporta 0 por design)_

**🚦 Tráfego:** Impressão → Clique → LP View · KPI: CPC + CTR · _se não houver evento de destino medido, sinalizar "funil cego" na Seção 3_

**📣 Reconhecimento:** Impressão → Alcance · KPI: CPM + Frequência · _NÃO exibir CPA/ROAS/conversões_

**📱 App:** Impressão → Clique → Instalação → Evento · KPI: custo por instalação/evento

| Etapa (objetivo dominante: {{dominant_objective}}) | Anterior | Atual | Variação |
|-----------------------------------------------------|----------|-------|----------|
| {{funnel_step_1}} | {{funnel_1_prev}} | {{funnel_1_now}} | {{funnel_1_var}} |
| {{funnel_step_2}} | {{funnel_2_prev}} | {{funnel_2_now}} | {{funnel_2_var}} |
| {{funnel_step_3}} | {{funnel_3_prev}} | {{funnel_3_now}} | {{funnel_3_var}} |
| Custo por resultado | R$ {{funnel_cpr_prev}} | R$ {{funnel_cpr_now}} | {{funnel_cpr_var}} |

> {{funnel_note}}

### 2.3 🏆 Rank — Melhores Campanhas

> Uma linha por campanha. A coluna "Resultado/Custo" usa a métrica-chave do **objetivo de cada campanha** (não misturar réguas).

| # | Campanha | Objetivo | Gasto | Resultado | Custo/Resultado | CTR | Status |
|---|----------|----------|-------|-----------|-----------------|-----|--------|
| 1 | {{camp_1_name}} | {{camp_1_obj}} | R$ {{camp_1_spend}} | {{camp_1_result}} | {{camp_1_cpr}} | {{camp_1_ctr}}% | {{camp_1_status}} |
| 2 | {{camp_2_name}} | {{camp_2_obj}} | R$ {{camp_2_spend}} | {{camp_2_result}} | {{camp_2_cpr}} | {{camp_2_ctr}}% | {{camp_2_status}} |
| 3 | {{camp_3_name}} | {{camp_3_obj}} | R$ {{camp_3_spend}} | {{camp_3_result}} | {{camp_3_cpr}} | {{camp_3_ctr}}% | {{camp_3_status}} |

### 2.4 Rank — Melhores Conjuntos

| # | Conjunto | Campanha | Gasto | Resultado | Custo/Resultado |
|---|----------|----------|-------|-----------|-----------------|
| 1 | {{adset_1_name}} | {{adset_1_camp}} | R$ {{adset_1_spend}} | {{adset_1_result}} | {{adset_1_cpr}} |
| 2 | {{adset_2_name}} | {{adset_2_camp}} | R$ {{adset_2_spend}} | {{adset_2_result}} | {{adset_2_cpr}} |
| 3 | {{adset_3_name}} | {{adset_3_camp}} | R$ {{adset_3_spend}} | {{adset_3_result}} | {{adset_3_cpr}} |

> {{adset_note}}

### 2.5 🎬 Rank — Melhores Anúncios (com mídia)

> A coluna **Mídia/Link** é OBRIGATÓRIA: permalink público do criativo (puxado da Meta via Graph API na geração), para o cliente clicar e ver o anúncio como foi veiculado.

| # | Anúncio | Campanha | Gasto | Resultado | Custo/Resultado | Mídia / Link |
|---|---------|----------|-------|-----------|-----------------|--------------|
| 1 | {{ad_1_name}} | {{ad_1_camp}} | R$ {{ad_1_spend}} | {{ad_1_result}} | {{ad_1_cpr}} | [{{ad_1_media_label}}]({{ad_1_permalink}}) |
| 2 | {{ad_2_name}} | {{ad_2_camp}} | R$ {{ad_2_spend}} | {{ad_2_result}} | {{ad_2_cpr}} | [{{ad_2_media_label}}]({{ad_2_permalink}}) |
| 3 | {{ad_3_name}} | {{ad_3_camp}} | R$ {{ad_3_spend}} | {{ad_3_result}} | {{ad_3_cpr}} | [{{ad_3_media_label}}]({{ad_3_permalink}}) |
| 🔴 | {{ad_worst_name}} | {{ad_worst_camp}} | R$ {{ad_worst_spend}} | {{ad_worst_result}} | {{ad_worst_cpr}} | [{{ad_worst_media_label}}]({{ad_worst_permalink}}) |

> **Mídia/Link:** {{media_note}}

---

## 3. Parecer de Performance Geral

> Cada campanha é avaliada pela **régua do seu próprio objetivo** (custo/conversa para WhatsApp, ROAS/CPA para vendas, CPL para leads, CPC/CTR para tráfego, CPM para reconhecimento), conforme `objective-metric-map.md` + `client-profile.md`.

### 🟢 O que está BOM
- {{good_1}}
- {{good_2}}
- {{good_3}}

### 🔴 O que está RUIM
- {{bad_1}}
- {{bad_2}}

### 🟡 O que precisa MELHORAR
- {{improve_1}}
- {{improve_2}}
- {{improve_3}}

---

## 4. Insights das Otimizações Realizadas

> Registro das ações executadas recentemente e o efeito observado nos números. **Esta seção é alimentada pelo `optimization-log`** (o que o gestor/otimizador registrou ter feito). Marque o nível de confiança: ✅ confirmado pelo log ou 🟡 hipótese a confirmar — nada deve ser assumido como fato sem registro.

| Ação realizada | Quando | Efeito (ajudou/piorou) | Evidência nos números | Confiança |
|----------------|--------|------------------------|------------------------|-----------|
| {{opt_1_action}} | {{opt_1_when}} | {{opt_1_effect}} | {{opt_1_evidence}} | {{opt_1_confidence}} |
| {{opt_2_action}} | {{opt_2_when}} | {{opt_2_effect}} | {{opt_2_evidence}} | {{opt_2_confidence}} |
| {{opt_3_action}} | {{opt_3_when}} | {{opt_3_effect}} | {{opt_3_evidence}} | {{opt_3_confidence}} |

**Como preencher daqui pra frente:** sempre que pausar, escalar, trocar criativo ou mexer em público, registre no `optimization-log`. Na próxima geração, o relatório cruza essas ações com a variação das métricas e mostra **o que cada mexida causou** — virando um histórico de aprendizado da conta.

---

## 5. Novas Otimizações (Próximas Ações)

Ações priorizadas por **R$ desperdiçado × esforço** (P1 = maior retorno/menor esforço). Detalhe em `action-list-priorizada.md`.

| # | Prioridade | Ação | Impacto estimado (R$ recuperado/ganho) | Esforço |
|---|-----------|------|-----------------------------------------|---------|
| 1 | 🔴 P1 | {{action_p1}} | {{impact_p1}} | {{effort_p1}} |
| 2 | 🟠 P2 | {{action_p2}} | {{impact_p2}} | {{effort_p2}} |
| 3 | 🟡 P3 | {{action_p3}} | {{impact_p3}} | {{effort_p3}} |
| 4 | 🟡 P4 | {{action_p4}} | {{impact_p4}} | {{effort_p4}} |
| 5 | ⚪ P5 | {{action_p5}} | {{impact_p5}} | {{effort_p5}} |

---

*Fontes: CLI meta-ads (níveis account/campaign/adset/ad), período {{period_start}}–{{period_end}} vs {{compare_start}}–{{compare_end}}. Métrica-chave por objetivo: `objective-metric-map.md`. Régua de avaliação: `client-profile.md`. Otimizações: `optimization-log`. Permalinks de criativos via Graph API. Relatório no formato de 5 seções, multi-objetivo.*
