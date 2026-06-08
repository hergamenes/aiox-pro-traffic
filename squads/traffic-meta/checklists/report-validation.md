# Checklist de Validação de Relatório

## Instruções
Verificar antes de entregar qualquer relatório de performance.
Todos os itens devem ser PASS para considerar o relatório válido.
Formato alvo: relatório de **5 seções, multi-objetivo** (ver `templates/performance-report.md` e `data/objective-metric-map.md`).

---

## 1. Estrutura das 5 seções
- [ ] Seção 1 — Visão Geral presente (investimento, resultados por tipo, custo por resultado, comparativo período anterior)
- [ ] Seção 2 — Visão do Tráfego presente (funil universal + funil por objetivo + 3 ranks)
- [ ] Seção 3 — Parecer de Performance Geral presente (🟢 bom / 🔴 ruim / 🟡 melhorar)
- [ ] Seção 4 — Insights das Otimizações Realizadas presente
- [ ] Seção 5 — Novas Otimizações (próximas ações) presente
- [ ] Cabeçalho com metadados (cliente, conta, período, comparação, versão) e rodapé de fontes

## 2. Cobertura multi-objetivo
- [ ] TODAS as campanhas da conta incluídas (tráfego, vendas, engajamento, leads/form nativo, conversões, reconhecimento, app)
- [ ] Cada campanha agrupada/avaliada pelo objetivo correto (detectado por `objective` → métrica não-zero → nome)
- [ ] Métrica-chave correta por objetivo conforme `objective-metric-map.md`
- [ ] NÃO exibe métrica inaplicável (sem ROAS/CPA em WhatsApp; sem CPA/ROAS/conversões em Reconhecimento; etc.)
- [ ] Objetivos mistos: resultados consolidados POR TIPO (não somados num único número)

## 3. Dados
- [ ] Fonte dos dados identificada (CLI meta-ads, níveis account/campaign/adset/ad)
- [ ] Período e período de comparação claramente definidos (datas início e fim)
- [ ] Dados conferem com a plataforma (spot check de 3+ métricas)
- [ ] Dados faltantes sinalizados explicitamente
- [ ] Somas batem (gasto por campanha = gasto total)
- [ ] Médias calculadas corretamente (custo/resultado = gasto/resultados, não média das médias)

## 4. Seção 1 — Visão Geral
- [ ] Investimento total presente com variação vs período anterior
- [ ] Resultados por tipo de objetivo (quadro por tipo quando misto)
- [ ] Custo por resultado por tipo presente
- [ ] **Subseção 1.1 — gráfico/tabela de evolução diária presente** (dia × resultado × custo por resultado)
- [ ] Objetivo dominante do gráfico diário identificado no título

## 5. Seção 2 — Visão do Tráfego
- [ ] Funil de métricas universais presente (impressões, CPM, freq, cliques, CTR, CPC)
- [ ] Funil de conversão exibido conforme o objetivo (etapas corretas por tipo)
- [ ] Taxas de conversão entre etapas calculadas
- [ ] Rank de melhores campanhas presente (com objetivo de cada campanha)
- [ ] Rank de melhores conjuntos presente
- [ ] Rank de melhores anúncios presente
- [ ] **Coluna "Mídia/Link" preenchida no rank de anúncios** (permalink público do criativo)

## 6. Seção 3 — Parecer
- [ ] Parecer classifica em 🟢 bom / 🔴 ruim / 🟡 precisa melhorar
- [ ] Avaliação usa a régua do objetivo de cada campanha (`client-profile.md` + mapa)
- [ ] "Funil cego" sinalizado quando tráfego sem evento de destino medido

## 7. Seção 4 — Otimizações Realizadas
- [ ] Tabela Ação / Quando / Efeito / Evidência / Confiança presente
- [ ] Alimentada pelo `optimization-log` (hipóteses marcadas como 🟡 a confirmar)

## 8. Seção 5 — Novas Otimizações
- [ ] Ações priorizadas (P1–P5) por R$ desperdiçado × esforço
- [ ] Impacto estimado (R$ recuperado/ganho) e esforço por ação
- [ ] Ações específicas e acionáveis (não opiniões genéricas)

## 9. Formatação
- [ ] Tabelas formatadas corretamente
- [ ] Sem erros de digitação visíveis
- [ ] Data de geração e versão do relatório presentes

---

## Resultado

| Total Items | PASS | FAIL | Taxa |
|-------------|------|------|------|
| 38 | __ | __ | __% |

**Decisão:** [ ] APROVADO para entrega / [ ] CORREÇÃO necessária
