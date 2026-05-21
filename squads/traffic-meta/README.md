# Squad de Tráfego Meta (traffic-meta)

Squad especializado em operações de tráfego pago focado em Meta Ads (Facebook + Instagram) para gestores de tráfego e media buyers.

## Agentes

| Agente | Icon | Função |
|--------|------|--------|
| **Campaign Launcher** | 🚀 | Estrutura e valida campanhas antes da publicação |
| **Campaign Publisher** | 🎯 | Cria campanhas REAIS na Meta Ads via CLI meta-ads |
| **Campaign Optimizer** | ⚡ | Otimiza campanhas com frameworks de decisão baseados em dados |
| **Performance Analyst** | 📊 | Consolida dados e gera relatórios de performance |

## Como Usar

Ative os agentes usando slash commands:

```
/trafficMeta:agents:campaign-launcher    → Lançar/validar campanhas
/trafficMeta:agents:campaign-publisher   → Publicar campanhas via CLI meta-ads
/trafficMeta:agents:campaign-optimizer   → Otimizar campanhas ativas
/trafficMeta:agents:performance-analyst  → Gerar relatórios
```

## Comandos Principais

### Campaign Launcher
- `*launch` — Fluxo completo de lançamento
- `*validate` — Validar campanha existente
- `*checklist` — Checklist pré-lançamento

### Campaign Publisher
- `*publish-sales` — Publicar campanha de vendas
- `*publish-leads` — Publicar campanha de leads
- `*quick-publish` — Publicação rápida com defaults

### Campaign Optimizer
- `*optimize` — Ciclo de otimização
- `*analyze` — Diagnóstico sem ação
- `*scale-check` — Verificar se pode escalar

### Performance Analyst
- `*report` — Relatório completo
- `*compare` — Comparar períodos
- `*funnel` — Análise de funil

## Estrutura

```
squads/traffic-meta/
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
│   ├── platform-rules.md
│   ├── kpi-thresholds.md
│   └── utm-conventions.md
├── README.md
└── user-guide.md
```
