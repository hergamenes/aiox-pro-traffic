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
- Montar a estrutura (campanha → grupos de anúncios → anúncios)
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
- **Puxar dados em tempo real** da Google Ads via CLI nos 5 níveis (account/campaign/ad_group/ad/keyword)
- Calcular todas as métricas
- Analisar funil de conversão
- Comparar com período anterior
- Entregar recomendações acionáveis

**Comando:** `/trafficGoogle:agents:performance-analyst` depois `*report`

Você só precisa informar: período (`--from`/`--to`) + `account-id` (opcional, usa default).

## ⚡ Real-Time via CLI google-ads

Todos os 4 agentes usam a **CLI `google-ads`** (em `packages/google-ads-agent/`) como **única fonte** de dados — leituras e operações em tempo real:

| Agente | Comandos CLI principais |
|--------|--------------------------|
| 🚀 Launcher | `auth status`, `config get-default`, `accounts --tree`, `list-assets`, `report` |
| 🎯 Publisher | `create campaign-search/display/pmax`, `create ad-group`, `keyword add`, `create ad`, `upload`, `enable`, `pause` |
| ⚡ Optimizer | `report --level ad_group --format json`, `update budget`, `update bidding`, `pause`, `keyword update-bid/remove` |
| 📊 Analyst | `report --from --to --level {account/campaign/ad_group/ad/keyword} --format json`, `list-assets` |

> ❌ **MCP de Google Ads NÃO disponível neste projeto.** Diferente do `traffic-meta` (que usa o MCP `claude_ai_Facebook` para anomaly signal, industry benchmark, opportunity score), o traffic-google opera **somente com a CLI** + thresholds de `kpi-thresholds.md` + análise manual. Comparações de período e tendências são calculadas manualmente. Se um MCP de Google Ads for adicionado no futuro, esta seção deve ser atualizada.

**Antes de usar qualquer agente, certifique-se que a CLI está autenticada:**

```bash
node packages/google-ads-agent/dist/bin/google-ads.js auth status
```

Se expirou → rodar `google-ads auth setup`.

## Fluxo típico de trabalho

```
1. Receber briefing do cliente
2. 🚀 *launch → Estruturar e validar campanha (CLI valida accounts/pages/creatives)
3. 🎯 *publish → Publicar na Google Ads (CLI cria hierarquia PAUSED) → *enable após GO
4. Esperar 72h+ de dados
5. ⚡ *optimize → CLI puxa report em tempo real, otimizar
6. Repetir otimização semanalmente
7. 📊 *report → CLI puxa dados completos, gera relatório
```

## Dicas

- **Sempre valide antes de subir** — O checklist pré-lançamento evita erros caros
- **Mínimo 3 dias de dados** — Decisões com menos dados são arriscadas
- **Refresh token Google não expira por padrão** — mas pode ser revogado manualmente; `auth status` confirma a validade e os agents BLOQUEIAM se inválido
- **Documente tudo** — O log de otimização guarda o JSON cru do CLI como anexo
- **Ajuste os thresholds** — Os valores padrão em `kpi-thresholds.md` servem como base
