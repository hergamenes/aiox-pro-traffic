# Squad de Tráfego Google (traffic-google)

Squad especializado em operações de tráfego pago focado em Google Ads (Search, Display, Performance Max, YouTube) para gestores de tráfego e media buyers.

> ⚡ **Real-time + execução autônoma (pós-Epic 6):** Os 4 agentes estão conectados à **CLI `google-ads`** (em `packages/google-ads-agent/`). Leituras (`accounts`, `report` nos 5 níveis) são em tempo real e a **publicação é autônoma via CLI** — `create campaign/ad-group/ad`, `keyword add`, `upload`, `enable`, `pause`, `update`, `remove`. Não há mais necessidade do Google Ads UI para operar.
>
> **MCP Google Ads:** ❌ não disponível neste projeto. Diferente do `traffic-meta` que usa `claude_ai_Facebook` MCP, o traffic-google opera apenas com CLI + análise manual.

## Pré-requisitos

### Instalação global do CLI (obrigatória)

Este squad invoca o CLI como `google-ads ...` via **PATH global**. Por isso o binário precisa estar instalado globalmente — sem isso, os agentes, tasks e workflows não funcionam (nem dentro nem fora deste repositório).

A partir da raiz do repositório, instale o CLI globalmente:

```bash
# 1. Build do pacote
cd packages/google-ads-agent
npm install
npm run build

# 2. Instalar o binário globalmente (registra `google-ads` no PATH)
npm install -g .
# Alternativa em ambiente de desenvolvimento: `npm link`

# 3. Verificar a instalação (de qualquer diretório)
google-ads --version
```

> ⚠️ **Permissões (`npm install -g`):** em algumas máquinas (nvm, instalação de Node via sudo) o install global pode falhar por permissão. Nesses casos use `npm link`, configure um prefixo de npm gravável, ou consulte o `README-TRAFFIC-KIT.md` (criado na Story 8.4) para troubleshooting completo.

### Configuração da CLI

Antes de usar o squad, a CLI precisa estar configurada:

```bash
# 1. Autenticar via OAuth (uma vez)
google-ads auth setup

# 2. Definir conta de anúncios padrão (uma vez)
google-ads config set-default

# 3. Verificar status (sempre que abrir uma sessão)
google-ads auth status
```

> ⚠️ **Conta padrão NÃO pode ser MCC** (Manager Account). Google rejeita métricas em MCC. Use uma conta cliente.
>
> Todos os agentes vão BLOQUEAR execução se `auth status` retornar inválido.

## Agentes

| Agente | Icon | Função |
|--------|------|--------|
| **Campaign Launcher** | 🚀 | Estrutura e valida campanhas antes da publicação (briefing → plano → pré-launch checklist) |
| **Campaign Publisher** | 🎯 | Executa publicação autônoma via CLI (cria hierarquia PAUSED → `enable` com GO explícito) |
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
- `*publish` — Executar publicação autônoma completa via CLI (cria hierarquia PAUSED)
- `*enable {campaign-id}` — Ativar campanha PAUSED após GO explícito do operador
- `*pause {campaign-id}` — Pausar campanha ativa (safety stop)
- `*accounts` — Listar contas de anúncio acessíveis (árvore MCC → clientes)

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
| Publicação | CLI cria automático (`*publish-sales`) | CLI cria automático (`*publish` → PAUSED → `*enable`) |
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
