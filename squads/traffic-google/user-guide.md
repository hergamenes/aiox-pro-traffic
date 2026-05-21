# Guia do Usuário — Squad de Tráfego Pago

## Para que serve este squad?

Este squad automatiza as 3 operações principais de um gestor de tráfego:

1. **Lançar campanhas** com validação completa antes de publicar
2. **Otimizar campanhas** com regras claras de decisão (escalar, pausar, ajustar)
3. **Gerar relatórios** consolidados com recomendações acionáveis

## Quando usar cada agente?

### 🚀 Campaign Launcher — "Vou subir uma campanha"
Use ANTES de publicar qualquer campanha. Ele vai:
- Pedir as informações do briefing
- Montar a estrutura (campanha → conjuntos → anúncios)
- Validar UTMs, segmentação, criativos e budget
- Executar checklist obrigatório
- Gerar o plano final

**Comando:** `/trafficGoogle:agents:campaign-launcher` depois `*launch`

### ⚡ Campaign Optimizer — "Preciso otimizar minhas campanhas"
Use quando tiver pelo menos 3 dias de dados na conta. Ele vai:
- **Puxar dados em tempo real** da Google Ads via CLI (não precisa colar CSV)
- Comparar contra thresholds definidos
- Classificar cada item (escalar, pausar, ajustar, manter)
- Sugerir redistribuição de budget
- Registrar tudo no log de otimização

**Comando:** `/trafficGoogle:agents:campaign-optimizer` depois `*optimize`

Você só precisa informar: `campaign-id` ou `account-id` + período (7d/14d/30d) + KPIs alvo.

### 📊 Performance Analyst — "Preciso de um relatório"
Use para consolidar dados e gerar relatórios. Ele vai:
- **Puxar dados em tempo real** da Google Ads via CLI nos 4 níveis (account/campaign/ad_group/ad)
- Calcular todas as métricas
- Analisar funil de conversão
- Comparar com período anterior
- Entregar recomendações acionáveis

**Comando:** `/trafficGoogle:agents:performance-analyst` depois `*report`

Você só precisa informar: período (`--from`/`--to`) + `account-id` (opcional, usa default).

## ⚡ Real-Time via CLI google-ads + MCP claude_ai_Google

Todos os 4 agentes usam duas fontes:

**CLI `google-ads`** (em `packages/google-ads-agent/`) — operações e leituras básicas:

| Agente | Comandos CLI principais |
|--------|--------------------------|
| 🚀 Launcher | `auth status`, `accounts`, `pages`, `creatives` |
| 🎯 Publisher | `create sales/leads`, `up`, `upload`, `history` |
| ⚡ Optimizer | `report --campaign-id --period --level ad_group --format json` |
| 📊 Analyst | `report --from --to --level {account/campaign/ad_group/ad} --format json` |

**MCP `claude_ai_Google`** — insights avançados (não existem na CLI):

| Agente | MCP Tools |
|--------|-----------|
| ⚡ Optimizer | `ads_insights_anomaly_signal`, `ads_insights_performance_trend`, `ads_insights_auction_ranking_benchmarks`, `ads_get_opportunity_score` |
| 📊 Analyst | `ads_insights_advertiser_context`, `ads_insights_industry_benchmark`, `ads_insights_performance_trend`, `ads_insights_anomaly_signal`, `ads_get_opportunity_score` |

**Quando MCP entra em cena:**
- Antes de pausar/escalar: optimizer consulta `anomaly_signal` para evitar agir em ruído
- Antes de classificar: optimizer cruza com `auction_ranking_benchmarks` para entender se é problema de criativo ou de leilão
- No relatório: analyst adiciona Seção 10 com `industry_benchmark` (comparação com a média do setor)

**Antes de usar qualquer agente, certifique-se que a CLI está autenticada:**

```bash
node packages/google-ads-agent/dist/bin/google-ads.js auth status
```

Se expirou → rodar `google-ads auth setup`.

## Fluxo típico de trabalho

```
1. Receber briefing do cliente
2. 🚀 *launch → Estruturar e validar campanha (CLI valida accounts/pages/creatives)
3. 🎯 *publish-sales/leads → Publicar na Google Ads (CLI executa create)
4. Esperar 72h+ de dados
5. ⚡ *optimize → CLI puxa report em tempo real, otimizar
6. Repetir otimização semanalmente
7. 📊 *report → CLI puxa dados completos, gera relatório
```

## Dicas

- **Sempre valide antes de subir** — O checklist pré-lançamento evita erros caros
- **Mínimo 3 dias de dados** — Decisões com menos dados são arriscadas
- **Renove auth a cada 60 dias** — Token expira; agents vão BLOQUEAR se expirado
- **Documente tudo** — O log de otimização guarda o JSON cru do CLI como anexo
- **Ajuste os thresholds** — Os valores padrão em `kpi-thresholds.md` servem como base
