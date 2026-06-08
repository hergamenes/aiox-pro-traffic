# Checklist de Validação de Relatório — Google Ads

## Instruções
Verificar antes de entregar qualquer relatório de performance do squad traffic-google.
Todos os itens devem ser PASS para considerar o relatório válido.
Referências: `templates/performance-report.md`, `data/objective-metric-map.md`, `data/kpi-thresholds.md`, `data/industry-benchmarks.md`.

---

## 1. Estrutura de 5 seções
- [ ] **Seção 1 — Visão Geral** presente (quadro de resultados por tipo + comparativo período anterior)
- [ ] **Seção 2 — Visão do Tráfego** presente (métricas universais + funil por tipo + ranks)
- [ ] **Seção 3 — Parecer** presente (bom / ruim / precisa melhorar)
- [ ] **Seção 4 — Insights das Otimizações Realizadas** presente (tabela do optimization-log)
- [ ] **Seção 5 — Novas Otimizações** presente (ações priorizadas P1–P5)
- [ ] Cabeçalho com metadados (cliente, customer_id, MCC, período, moeda, versão) e rodapé de fontes presentes

## 2. Cobertura de campanhas (multi-objetivo)
- [ ] **TODAS** as campanhas da conta incluídas (nenhuma omitida)
- [ ] Cada campanha classificada no **tipo correto** (Search vendas, Search leads/formulário nativo, PMax, Display/Demand Gen, Video, Shopping)
- [ ] Tipos detectados via `advertising_channel_type` / meta de conversão / heurística por nome (ordem do `objective-metric-map.md`)
- [ ] Tipos sem dados no período omitidos explicitamente (não inventados)

## 3. Métrica-chave correta por tipo
- [ ] Vendas (Search/PMax/Shopping): **CPA + ROAS** quando há valor
- [ ] Leads / formulário nativo (Search): **CPL**
- [ ] Video: **CPV + CPM** (e conversões se houver objetivo)
- [ ] Display / Demand Gen: **CPA + CPC + CPM**
- [ ] Resultados de tipos diferentes **NÃO somados** num único número (regra do `objective-metric-map.md`)
- [ ] Parecer (Seção 3) julga cada campanha pela régua do **próprio tipo**, sem cruzar tipos

## 4. Particularidades Search
- [ ] **Impression Share** presente para campanhas Search (com IS perdido por orçamento e por rank)
- [ ] **Análise por palavra-chave** presente: top por gasto, top por ROAS/conversão e keywords caras sem conversão
- [ ] Keywords caras sem conversão sinalizadas como candidatas a **negativar/pausar**
- [ ] **Asset Library** (RDA / PMax) presente quando há esses tipos (assets IMAGE/VIDEO/TEXT, asset groups, label Best/Good/Low)

## 5. Gráfico diário (Seção 1.1)
- [ ] Tabela de evolução diária presente (dia × conversões × custo por conversão)
- [ ] Usa o objetivo **dominante** (maior gasto) e isso está informado no título
- [ ] Total da série bate com o investimento e conversões do período
- [ ] Leitura do gráfico aponta dia fora da curva / melhor dia

## 6. Ranks e Mídia/Link
- [ ] 3 ranks presentes: campanhas, grupos de anúncios, anúncios
- [ ] Coluna **Mídia / Link** presente no rank de anúncios (link real do anúncio/asset)
- [ ] Links clicáveis e apontando para o destino correto por tipo (preview Search, YouTube p/ Video, asset p/ Display/PMax)

## 7. Otimizações
- [ ] Seção 4 alimentada pelo `optimization-log` (ações realizadas com Ação/Quando/Efeito/Evidência/Confiança)
- [ ] Ações não registradas marcadas como **hipótese a confirmar** (não assumidas como fato)
- [ ] Seção 5 com novas otimizações **priorizadas por R$ desperdiçado × esforço** (P1–P5)
- [ ] Negativação de keywords incluída na Seção 5 quando há keywords caras sem conversão (Seção 2.4)

## 8. MCC e benchmarks
- [ ] Quando MCC: investimento = soma das child accounts
- [ ] Quando MCC: razões (CTR/CPC/CPA/ROAS) **agregadas com ponderação** (Σ valor / Σ custo), não média das médias
- [ ] `--login-customer-id` / contexto MCC refletido no cabeçalho quando aplicável
- [ ] Réguas ancoradas em `data/industry-benchmarks.md` (sem MCP de benchmark nativo no Google)

## 9. Dados e formatação
- [ ] Período claramente definido (início e fim) e período de comparação
- [ ] Somas batem (gasto por campanha = gasto total)
- [ ] Médias calculadas corretamente (CPA = gasto/conversões, não média das médias)
- [ ] Tabelas formatadas, sem erros de digitação visíveis
- [ ] Data de geração presente

---

## Resultado

| Total Items | PASS | FAIL | Taxa |
|-------------|------|------|------|
| 38 | __ | __ | __% |

**Decisão:** [ ] APROVADO para entrega / [ ] CORREÇÃO necessária
