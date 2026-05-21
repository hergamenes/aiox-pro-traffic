# Squad de Tráfego Google (traffic-google)

Squad especializado em operações de tráfego pago focado em Google Ads (Search, Display, Performance Max, YouTube) para gestores de tráfego e media buyers.

> ⚡ **Real-time (parcial):** Os 4 agentes estão conectados à **CLI `google-ads`** (em `packages/google-ads-agent/`). Leituras (`accounts`, `report` nos 5 níveis) são em tempo real. **Publicação no MVP atual é coordenada manualmente no Google Ads UI** — Phase 2 da CLI vai adicionar `create`/`upload`/`up` para automação completa.
>
> **MCP Google Ads:** ❌ não disponível neste projeto. Diferente do `traffic-meta` que usa `claude_ai_Facebook` MCP, o traffic-google opera apenas com CLI + análise manual.

## Pré-requisitos

Antes de usar o squad, a CLI precisa estar configurada:

```bash
# 1. Autenticar via OAuth (uma vez)
node packages/google-ads-agent/dist/bin/google-ads.js auth setup

# 2. Definir conta de anúncios padrão (uma vez)
node packages/google-ads-agent/dist/bin/google-ads.js config set-default

# 3. Verificar status (sempre que abrir uma sessão)
node packages/google-ads-agent/dist/bin/google-ads.js auth status
```

> ⚠️ **Conta padrão NÃO pode ser MCC** (Manager Account). Google rejeita métricas em MCC. Use uma conta cliente.
>
> Todos os agentes vão BLOQUEAR execução se `auth status` retornar inválido.

## Agentes

| Agente | Icon | Função |
|--------|------|--------|
| **Campaign Launcher** | 🚀 | Estrutura e valida campanhas antes da publicação (briefing → plano → pré-launch checklist) |
| **Campaign Publisher** | 🎯 | Coordena publicação no Google Ads UI + captura IDs (MVP — `create` automático é Phase 2) |
| **Campaign Optimizer** | ⚡ | Otimiza campanhas com base em `report` real-time e thresholds de `kpi-thresholds.md` |
| **Performance Analyst** | 📊 | Consolida dados de 5 níveis (account/campaign/ad_group/ad/keyword) em relatório |

## Como Usar

Ative os agentes usando slash commands:

```
/trafficGoogle:agents:campaign-launcher    → Lançar/validar campanhas
/trafficGoogle:agents:campaign-publisher   → Coordenar publicação
/trafficGoogle:agents:campaign-optimizer   → Otimizar campanhas ativas
/trafficGoogle:agents:performance-analyst  → Gerar relatórios
```

## Comandos Principais

### Campaign Launcher (🚀)
- `*launch` — Fluxo completo de lançamento
- `*validate` — Validar campanha existente
- `*checklist` — Checklist pré-lançamento

### Campaign Publisher (🎯)
- `*publish` — Coordenar publicação (apresenta plano, valida, redireciona ao UI, captura IDs)
- `*accounts` — Listar contas de anúncio acessíveis
- `*capture-ids` — Capturar customer-id + campaign-id pós-publicação no UI

### Campaign Optimizer (⚡)
- `*optimize` — Ciclo de otimização (puxa report, classifica, recomenda)
- `*analyze` — Diagnóstico sem ação
- `*scale-check` — Verificar se pode escalar

### Performance Analyst (📊)
- `*report` — Relatório completo (5 níveis incluindo keyword)
- `*compare` — Comparar períodos
- `*funnel` — Análise de funil

## Diferenças vs `traffic-meta`

| Aspecto | traffic-meta | traffic-google |
|---------|--------------|----------------|
| Hierarquia | Campaign → Ad Set → Ad | Campaign → Ad Group → Ad |
| Granularidade extra | — | Keyword (Search-only) |
| Publicação | CLI cria automático (`*publish-sales`) | MVP: usuário cria no UI; Phase 2: CLI automatizado |
| MCP de insights | ✅ `claude_ai_Facebook` | ❌ não disponível ainda |
| Token de auth | Expira em 60 dias | Refresh token longo prazo |

## Estrutura

```
squads/traffic-google/
├── config.yaml
├── agents/
│   ├── campaign-launcher.md
│   ├── campaign-publisher.md
│   ├── campaign-optimizer.md
│   └── performance-analyst.md
├── tasks/
│   ├── launch-campaign.md
│   ├── publish-campaign.md
│   ├── optimize-cycle.md
│   └── generate-report.md
├── workflows/
│   └── full-campaign-cycle.yaml
├── templates/
│   ├── campaign-brief.md
│   ├── optimization-log.md
│   └── performance-report.md
├── checklists/
│   ├── pre-launch.md
│   ├── optimization-rules.md
│   └── report-validation.md
├── data/
│   ├── platform-rules.md     ← regras Google Ads (Search/Display/PMax/YouTube)
│   ├── kpi-thresholds.md
│   └── utm-conventions.md
├── README.md
└── user-guide.md
```
