# Performance Report — {{period}}

## 1. Resumo Executivo

| Métrica | Valor | vs Anterior | Tendência |
|---------|-------|------------|-----------|
| **Investimento** | R$ {{total_spend}} | {{spend_change}}% | {{spend_trend}} |
| **Conversões** | {{total_conversions}} | {{conv_change}}% | {{conv_trend}} |
| **CPA Médio** | R$ {{avg_cpa}} | {{cpa_change}}% | {{cpa_trend}} |
| **ROAS** | {{avg_roas}} | {{roas_change}}% | {{roas_trend}} |

**Destaque:** {{highlight}}

---

## 2. Métricas Gerais

| Métrica | Valor |
|---------|-------|
| Impressões | {{impressions}} |
| Cliques (link) | {{clicks}} |
| CTR | {{ctr}}% |
| CPC Médio | R$ {{avg_cpc}} |
| Conversões | {{conversions}} |
| CPA | R$ {{cpa}} |
| ROAS | {{roas}} |
| Frequência Média | {{frequency}} |

---

## 3. Performance por Campanha

| Campanha | Gasto | Conv. | CPA | ROAS | Status |
|----------|-------|-------|-----|------|--------|
| {{campaign_rows}} | | | | | |

---

## 4. Performance por Conjunto

| Conjunto | Público | Gasto | Conv. | CPA | CTR |
|----------|---------|-------|-------|-----|-----|
| {{adset_rows}} | | | | | |

---

## 5. Performance por Criativo

### Top 3
| Criativo | Conv. | CPA | CTR | ROAS |
|----------|-------|-----|-----|------|
| {{top_creatives}} | | | | |

### Bottom 3
| Criativo | Conv. | CPA | CTR | ROAS |
|----------|-------|-----|-----|------|
| {{bottom_creatives}} | | | | |

---

## 6. Análise de Funil

Use o funil conforme o objetivo da campanha.

**Funil padrão (sales / leads):**
```
Impressões: {{impressions}}
    ↓ {{impression_to_click_rate}}%
Cliques: {{clicks}}
    ↓ {{click_to_lead_rate}}%
Leads: {{leads}}
    ↓ {{lead_to_sale_rate}}%
Vendas: {{sales}}
```

**Funil de conversa (whatsapp / Click-to-WhatsApp):**
```
Impressões: {{impressions}}
    ↓ {{impression_to_click_rate}}%
Cliques: {{clicks}}
    ↓ {{click_to_conversation_rate}}%
Conversas iniciadas: {{conversations}}
    ↓ {{conversation_to_qualified_rate}}%
Leads qualificados: {{qualified_leads}}
```
> Para campanhas `whatsapp`, a CLI reporta 0 compras/leads por design — a métrica de conversão é a **conversa iniciada** (lida dos eventos de mensageria via `meta-ads report`). Custo por conversa = investimento ÷ conversas iniciadas.

---

## 7. Atribuição por UTM

| Source | Medium | Campaign | Conv. | % do Total |
|--------|--------|----------|-------|-----------|
| {{utm_rows}} | | | | |

---

## 8. Comparação de Períodos

| Métrica | Período Atual | Período Anterior | Variação |
|---------|--------------|-----------------|----------|
| {{comparison_rows}} | | | |

---

## 9. Recomendações

### Ações Imediatas
1. {{action_1}}
2. {{action_2}}
3. {{action_3}}

### Testes Sugeridos
1. {{test_1}}
2. {{test_2}}

### Próximos Passos
1. {{next_step_1}}
2. {{next_step_2}}

---

## 10. Benchmarks da Indústria

Comparação das métricas da conta com a média do setor (via MCP `ads_insights_industry_benchmark`). Diz se um KPI "bom" é mesmo bom no contexto do nicho.

| Métrica | Sua conta | Média da indústria | Posição |
|---------|-----------|--------------------|---------|
| CPA | {{account_cpa}} | {{industry_cpa}} | {{cpa_position}} |
| ROAS | {{account_roas}} | {{industry_roas}} | {{roas_position}} |
| CTR | {{account_ctr}} | {{industry_ctr}} | {{ctr_position}} |
| CPM | {{account_cpm}} | {{industry_cpm}} | {{cpm_position}} |

> Posição = acima / na média / abaixo do benchmark do setor. Para campanhas `whatsapp`, comparar custo por conversa quando o benchmark do nicho estiver disponível.

---

**Relatório gerado em:** {{generated_at}}
**Fonte dos dados:** {{data_source}}
**Período:** {{period_start}} a {{period_end}}
