# Relatório de Performance — {{cliente}}

| | |
|---|---|
| **Cliente** | {{cliente}} |
| **Conta Google Ads** | `{{customer_id}}` |
| **MCC (se aplicável)** | `{{mcc_login_customer_id}}` |
| **Plataforma** | Google Ads |
| **Tipos de campanha na conta** | {{tipos_campanha}} (ex.: Search vendas, Search leads, PMax, Display, Video, Shopping) |
| **Período analisado** | {{periodo_atual}} ({{dias}} dias) |
| **Período de comparação** | {{periodo_anterior}} ({{dias}} dias anteriores) |
| **Gerado em** | {{generated_at}} · **Versão** 2.0 (nova estrutura de 5 seções) |
| **Moeda** | BRL (R$) |

> **Multi-objetivo:** esta conta tem campanhas de tipos/objetivos diferentes. A métrica-chave de cada uma segue o mapa `data/objective-metric-map.md`: **ROAS/CPA** para vendas, **CPL** para leads/formulário nativo, **CPV/CPM** para Video, etc. Resultados de tipos diferentes **não são somados** num único número (ver Seção 1).

---

## 1. Visão Geral

Indicadores de resultado do período, comparados ao período anterior. Em conta multi-objetivo, os resultados aparecem **separados por tipo de conversão**.

### 1.1 Quadro de resultados (por tipo de objetivo)

| Indicador | Atual | Anterior | Variação |
|-----------|-------|----------|----------|
| 💰 **Investimento total** | R$ {{spend_atual}} | R$ {{spend_anterior}} | {{spend_var}} |
| 🛒 **Vendas** (conversões compra) | {{vendas_atual}} | {{vendas_anterior}} | {{vendas_var}} |
| 🎯 CPA vendas (`cost_per_conversion`) | R$ {{cpa_vendas}} | R$ {{cpa_vendas_ant}} | {{cpa_vendas_var}} |
| 📈 **ROAS** (quando há valor) | {{roas_atual}}x | {{roas_anterior}}x | {{roas_var}} |
| 📋 **Leads** (formulário nativo / lead) | {{leads_atual}} | {{leads_anterior}} | {{leads_var}} |
| 🎯 **CPL** (custo por lead) | R$ {{cpl_atual}} | R$ {{cpl_anterior}} | {{cpl_var}} |
| 👁 **Views** (Video, se houver) | {{views_atual}} | {{views_anterior}} | {{views_var}} |
| 🎯 CPV (custo por view) | R$ {{cpv_atual}} | R$ {{cpv_anterior}} | {{cpv_var}} |

> **Regra (do `objective-metric-map.md`):** nunca somar tipos diferentes de conversão num único número. Cada linha acima cobre um tipo de objetivo presente na conta. Linhas sem dados no período são omitidas.
>
> **MCC:** quando a conta é gerida via MCC, o investimento é a soma das child accounts e métricas de razão (CTR, CPC, CPA, ROAS) são **agregadas com ponderação** (ex.: ROAS da conta = Σ valor / Σ custo, não a média dos ROAS).

### 1.2 Evolução diária (objetivo dominante: {{objetivo_dominante}})

Série diária do objetivo de maior gasto, para o gráfico de evolução.

| Dia | Investimento | {{conv_label}} | Custo por {{conv_label_unit}} |
|-----|--------------|----------------|-------------------------------|
| {{dia_1}} | R$ {{inv_1}} | {{conv_1}} | R$ {{cpc_conv_1}} |
| {{dia_2}} | R$ {{inv_2}} | {{conv_2}} | R$ {{cpc_conv_2}} |
| ... | ... | ... | ... |
| **Total** | **R$ {{spend_atual}}** | **{{conv_total}}** | **R$ {{custo_conv_total}}** |

> **Leitura do gráfico:** {{leitura_grafico}} (apontar dia fora da curva, melhor dia, e o que mudou entre eles — ver Seção 4).

**Leitura:** {{leitura_visao_geral}} Régua de avaliação: ancorada nos benchmarks por nicho em `data/industry-benchmarks.md` (não há MCP de benchmark nativo no Google, ao contrário do Meta).

---

## 2. Visão do Tráfego

### 2.1 Funil de métricas universais — conta {{customer_id}}

Métricas que se aplicam a **todo tipo** de campanha (do `objective-metric-map.md`).

| Métrica | Atual | Anterior | Variação |
|---------|-------|----------|----------|
| Impressões | {{impr_atual}} | {{impr_anterior}} | {{impr_var}} |
| CPM | R$ {{cpm_atual}} | R$ {{cpm_anterior}} | {{cpm_var}} |
| Cliques | {{clicks_atual}} | {{clicks_anterior}} | {{clicks_var}} |
| CTR | {{ctr_atual}}% | {{ctr_anterior}}% | {{ctr_var}} |
| CPC médio | R$ {{cpc_atual}} | R$ {{cpc_anterior}} | {{cpc_var}} |
| Conversões | {{conv_atual}} | {{conv_anterior}} | {{conv_var}} |
| Custo/conversão | R$ {{cpconv_atual}} | R$ {{cpconv_anterior}} | {{cpconv_var}} |

### 2.2 Funil por tipo de campanha

Uma sub-tabela por tipo presente na conta. A métrica-chave (última coluna) segue o `objective-metric-map.md`.

**Search — Vendas** (Impressão → Clique → Conversão · KPI: CPA + ROAS)

| Métrica | Atual | Anterior |
|---------|-------|----------|
| Impressões → Cliques (CTR) | {{search_v_ctr}}% | {{search_v_ctr_ant}}% |
| Cliques → Conversões (CVR) | {{search_v_cvr}}% | {{search_v_cvr_ant}}% |
| CPA | R$ {{search_v_cpa}} | R$ {{search_v_cpa_ant}} |
| ROAS | {{search_v_roas}}x | {{search_v_roas_ant}}x |

**Search — Leads / formulário nativo** (Impressão → Clique → Lead · KPI: CPL)

| Métrica | Atual | Anterior |
|---------|-------|----------|
| Impressões → Cliques (CTR) | {{search_l_ctr}}% | {{search_l_ctr_ant}}% |
| Cliques → Leads (CVR) | {{search_l_cvr}}% | {{search_l_cvr_ant}}% |
| CPL | R$ {{search_l_cpl}} | R$ {{search_l_cpl_ant}} |

**Performance Max** (Impressão → Clique → Conversão · KPI: CPA + ROAS · sem keywords, ver asset groups)

| Métrica | Atual | Anterior |
|---------|-------|----------|
| Conversões | {{pmax_conv}} | {{pmax_conv_ant}} |
| CPA | R$ {{pmax_cpa}} | R$ {{pmax_cpa_ant}} |
| ROAS | {{pmax_roas}}x | {{pmax_roas_ant}}x |

**Shopping** (KPI: ROAS + CPA · análise por produto/grupo)

| Métrica | Atual | Anterior |
|---------|-------|----------|
| Conversões | {{shop_conv}} | {{shop_conv_ant}} |
| ROAS | {{shop_roas}}x | {{shop_roas_ant}}x |
| CPA | R$ {{shop_cpa}} | R$ {{shop_cpa_ant}} |

**Display / Demand Gen** (Impressão → Clique → Conversão · KPI: CPA + CPC + CPM)

| Métrica | Atual | Anterior |
|---------|-------|----------|
| CPM | R$ {{disp_cpm}} | R$ {{disp_cpm_ant}} |
| CPC | R$ {{disp_cpc}} | R$ {{disp_cpc_ant}} |
| CPA | R$ {{disp_cpa}} | R$ {{disp_cpa_ant}} |

**Video (YouTube)** (Impressão → View → Conversão · KPI: CPV + CPM)

| Métrica | Atual | Anterior |
|---------|-------|----------|
| Views | {{video_views}} | {{video_views_ant}} |
| CPV | R$ {{video_cpv}} | R$ {{video_cpv_ant}} |
| CPM | R$ {{video_cpm}} | R$ {{video_cpm_ant}} |

> Tipos de campanha sem dados no período são omitidos. Cada bloco usa a régua do seu tipo (Seção 3).

### 2.3 Impression Share (somente Search)

Métrica exclusiva da Rede de Pesquisa — quanto da audiência disponível estamos capturando e por que perdemos o resto.

| Campanha Search | Impression Share | IS perdido (orçamento) | IS perdido (rank) |
|-----------------|------------------|------------------------|-------------------|
| {{search_camp_1}} | {{is_1}}% | {{is_lost_budget_1}}% | {{is_lost_rank_1}}% |
| {{search_camp_2}} | {{is_2}}% | {{is_lost_budget_2}}% | {{is_lost_rank_2}}% |

> **Leitura:** IS perdido por **orçamento** → falta verba (oportunidade de escala). IS perdido por **rank** → falta qualidade/lance (otimizar lance, anúncio ou keyword). {{is_leitura}}

### 2.4 Análise por palavra-chave (somente Search)

> Nível keyword só existe no Google. PMax/Display/Video **não expõem keywords** — para esses, ver Asset Library (2.5).

**Top keywords por gasto**

| Palavra-chave | Match | Gasto | Cliques | Conv. | CPA / CPL | ROAS |
|---------------|-------|-------|---------|-------|-----------|------|
| {{kw_gasto_1}} | {{kw_gasto_1_match}} | R$ {{kw_gasto_1_spend}} | {{kw_gasto_1_clicks}} | {{kw_gasto_1_conv}} | R$ {{kw_gasto_1_cpa}} | {{kw_gasto_1_roas}}x |

**Top keywords por ROAS / conversão**

| Palavra-chave | Match | Gasto | Conv. | CPA / CPL | ROAS |
|---------------|-------|-------|-------|-----------|------|
| {{kw_roas_1}} | {{kw_roas_1_match}} | R$ {{kw_roas_1_spend}} | {{kw_roas_1_conv}} | R$ {{kw_roas_1_cpa}} | {{kw_roas_1_roas}}x |

**🔴 Keywords caras sem conversão (candidatas a negativar/pausar)**

| Palavra-chave | Match | Gasto | Cliques | Conv. | Ação sugerida |
|---------------|-------|-------|---------|-------|---------------|
| {{kw_ruim_1}} | {{kw_ruim_1_match}} | R$ {{kw_ruim_1_spend}} | {{kw_ruim_1_clicks}} | 0 | 🔴 Negativar |

> **Negativação:** keywords com gasto acima da régua e zero (ou pouquíssimas) conversões drenam orçamento — entram como ação na Seção 5. {{kw_leitura}}

### 2.5 Asset Library (RDA / Performance Max)

Inventário e performance de assets quando há Responsive Search Ads (RDA) ou Performance Max — onde não há keywords, a alavanca de otimização são os **assets** e **asset groups**.

| Asset Group / Anúncio | Tipo asset | Performance (label) | Gasto | Conv. | CPA / ROAS |
|-----------------------|-----------|----------------------|-------|-------|------------|
| {{asset_1_group}} | {{asset_1_type}} (IMAGE/VIDEO/TEXT) | {{asset_1_label}} (Best/Good/Low) | R$ {{asset_1_spend}} | {{asset_1_conv}} | {{asset_1_kpi}} |

> Assets marcados **Low** pelo Google são candidatos a substituição (entram na Seção 5). {{asset_leitura}}

### 2.6 🏆 Rank — Melhores Campanhas

| # | Campanha | Tipo | Gasto | Conv. | Métrica-chave | CTR | Status |
|---|----------|------|-------|-------|---------------|-----|--------|
| 1 | {{camp_1}} | {{camp_1_tipo}} | R$ {{camp_1_spend}} | {{camp_1_conv}} | {{camp_1_kpi}} | {{camp_1_ctr}}% | {{camp_1_status}} |
| 2 | {{camp_2}} | {{camp_2_tipo}} | R$ {{camp_2_spend}} | {{camp_2_conv}} | {{camp_2_kpi}} | {{camp_2_ctr}}% | {{camp_2_status}} |
| 3 | {{camp_3}} | {{camp_3_tipo}} | R$ {{camp_3_spend}} | {{camp_3_conv}} | {{camp_3_kpi}} | {{camp_3_ctr}}% | {{camp_3_status}} |

> Métrica-chave por linha segue o tipo da campanha (CPA/ROAS, CPL, CPV...). Comparar campanhas pela régua do **próprio tipo**, nunca cruzando tipos diferentes.

### 2.7 Rank — Melhores Grupos de Anúncios

| # | Grupo de Anúncios | Campanha | Gasto | Conv. | Métrica-chave | CTR |
|---|-------------------|----------|-------|-------|---------------|-----|
| 1 | {{ag_1}} | {{ag_1_camp}} | R$ {{ag_1_spend}} | {{ag_1_conv}} | {{ag_1_kpi}} | {{ag_1_ctr}}% |
| 2 | {{ag_2}} | {{ag_2_camp}} | R$ {{ag_2_spend}} | {{ag_2_conv}} | {{ag_2_kpi}} | {{ag_2_ctr}}% |

### 2.8 🎬 Rank — Melhores Anúncios (com mídia)

| # | Anúncio | Campanha | Gasto | Conv. | Métrica-chave | Mídia / Link |
|---|---------|----------|-------|-------|---------------|--------------|
| 1 | {{ad_1}} | {{ad_1_camp}} | R$ {{ad_1_spend}} | {{ad_1_conv}} | {{ad_1_kpi}} | [▶ ver anúncio]({{ad_1_link}}) |
| 2 | {{ad_2}} | {{ad_2_camp}} | R$ {{ad_2_spend}} | {{ad_2_conv}} | {{ad_2_kpi}} | [▶ ver anúncio]({{ad_2_link}}) |
| 3 | {{ad_3}} | {{ad_3_camp}} | R$ {{ad_3_spend}} | {{ad_3_conv}} | {{ad_3_kpi}} | [🖼 ver anúncio]({{ad_3_link}}) |

> **Mídia/Link:** link real do anúncio/asset (preview do Google Ads ou URL final) puxado na geração do relatório — o cliente clica e vê o anúncio como foi veiculado. Para Search/RDA, o link aponta para o preview do texto; para Video, ao YouTube; para Display/PMax, ao asset de imagem/vídeo.

---

## 3. Parecer de Performance Geral

> Avaliação **pela régua do tipo de cada campanha** (mapa em `data/objective-metric-map.md`, thresholds em `data/kpi-thresholds.md` ancorados em `data/industry-benchmarks.md`). Nunca julgar uma campanha de leads pela régua de vendas, nem Video pela régua de Search.

### 🟢 O que está BOM
- {{bom_1}}
- {{bom_2}}

### 🔴 O que está RUIM
- {{ruim_1}}
- {{ruim_2}}

### 🟡 O que precisa MELHORAR
- {{melhorar_1}}
- {{melhorar_2}}

---

## 4. Insights das Otimizações Realizadas

> Registro das ações executadas recentemente e o efeito observado nos números. **Esta seção é alimentada pelo `templates/optimization-log.md`** (o que o gestor/otimizador registrou ter feito). Quando uma ação não estiver registrada, marcar como **hipótese a confirmar** — nada é assumido como fato.

| Ação realizada | Quando | Efeito observado | Evidência nos números | Confiança |
|----------------|--------|------------------|------------------------|-----------|
| {{otim_1_acao}} | {{otim_1_quando}} | {{otim_1_efeito}} | {{otim_1_evidencia}} | {{otim_1_confianca}} |
| {{otim_2_acao}} | {{otim_2_quando}} | {{otim_2_efeito}} | {{otim_2_evidencia}} | {{otim_2_confianca}} |
| _[seu registro aqui]_ | | | | |

**Como preencher daqui pra frente:** sempre que pausar/escalar campanha, trocar lance, negativar keyword, ajustar orçamento ou trocar asset, registre no `optimization-log`. Na próxima geração, o relatório cruza essas ações com a variação das métricas e mostra **o que cada mexida causou** — virando histórico de aprendizado da conta.

---

## 5. Novas Otimizações (Próximas Ações)

Ações priorizadas por **R$ desperdiçado × esforço** (P1 = mais retorno por menos esforço).

| # | Prioridade | Ação | Tipo de campanha | Impacto estimado | Esforço |
|---|-----------|------|------------------|------------------|---------|
| 1 | 🔴 P1 | {{acao_1}} | {{acao_1_tipo}} | {{acao_1_impacto}} | {{acao_1_esforco}} |
| 2 | 🟠 P2 | {{acao_2}} | {{acao_2_tipo}} | {{acao_2_impacto}} | {{acao_2_esforco}} |
| 3 | 🟡 P3 | {{acao_3}} | {{acao_3_tipo}} | {{acao_3_impacto}} | {{acao_3_esforco}} |
| 4 | 🟡 P4 | {{acao_4}} | {{acao_4_tipo}} | {{acao_4_impacto}} | {{acao_4_esforco}} |
| 5 | ⚪ P5 | {{acao_5}} | {{acao_5_tipo}} | {{acao_5_impacto}} | {{acao_5_esforco}} |

> **Negativação de keywords:** quando houver keywords caras sem conversão (Seção 2.4), incluir a negativação como ação aqui, com o R$/mês que deixa de ser desperdiçado. Para PMax/Display/Video sem keyword, a ação equivalente é trocar asset **Low** ou ajustar asset group (Seção 2.5).

---

*Fontes: CLI google-ads (níveis account/campaign/ad_group/ad/keyword), período {{periodo_atual}} vs {{periodo_anterior}}. {{fonte_mcc}} Réguas: `data/kpi-thresholds.md` + `data/objective-metric-map.md`, ancoradas em `data/industry-benchmarks.md` (sem MCP de benchmark nativo no Google). Relatório no novo formato de 5 seções.*
