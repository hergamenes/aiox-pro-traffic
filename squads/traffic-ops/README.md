# Squad de Tráfego Pago (traffic-ops)

Squad especializado em operações de tráfego pago para gestores de tráfego e media buyers.

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
/trafficOps:agents:campaign-launcher    → Lançar/validar campanhas
/trafficOps:agents:campaign-optimizer   → Otimizar campanhas ativas
/trafficOps:agents:performance-analyst  → Gerar relatórios
```

## Comandos Principais

### Campaign Launcher
- `*launch` — Fluxo completo de lançamento
- `*validate` — Validar campanha existente
- `*checklist` — Checklist pré-lançamento

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
squads/traffic-ops/
├── config.yaml
├── agents/
│   ├── campaign-launcher.md
│   ├── campaign-optimizer.md
│   └── performance-analyst.md
├── tasks/
│   ├── launch-campaign.md
│   ├── optimize-cycle.md
│   └── generate-report.md
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
