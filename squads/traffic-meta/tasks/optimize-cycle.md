# Task: Optimize Cycle

## Metadata
- **Agent:** Campaign Optimizer
- **Tipo:** Workflow analítico
- **Elicit:** true

## Objetivo
Analisar dados de performance e gerar recomendações de otimização baseadas em frameworks de decisão pré-definidos.

## Inputs
- **Período de análise** (3, 7, 14 ou 30 dias)
- **Objetivo da campanha** (Vendas, Leads, Tráfego)
- **KPIs alvo** (CPA máximo, ROAS mínimo)
- **Thresholds de referência** (`data/kpi-thresholds.md`)
- **ID da campanha** (`campaign-id`) ou `account-id`
- **CLI meta-ads autenticada** (`meta-ads auth status` = OK)

> Dados de performance vêm em **tempo real via CLI** (`meta-ads report --format json`). Não é mais necessário colar CSV/screenshot.

## Veto Conditions
NÃO executar se:
- ❌ Período de dados < 3 dias (insuficiente para decisão estatística)
- ❌ KPIs alvo não definidos (CPA máximo ou ROAS mínimo ausentes)
- ❌ `meta-ads auth status` retornar expirado/não-configurado
- ❌ CLI `meta-ads report` retornar erro (rede, permissões, account-id inválido)
- ❌ Objetivo da campanha não declarado
- ❌ Recomendação de pausar/escalar sem 3+ dias consecutivos confirmando tendência

## Fluxo

### Step 0: Pré-validação Real-Time
Verificar infraestrutura antes de qualquer leitura:

```bash
node packages/meta-ads-agent/dist/bin/meta-ads.js auth status
```

- Se expirado → BLOQUEAR e guiar para `meta-ads auth setup`

### Step 1: Coleta de Dados em Tempo Real

Coletar parâmetros do usuário:

1. **Período:** 7d, 14d ou 30d (CLI aceita `--period 7d`)
2. **Objetivo da campanha:** Vendas, Leads, Tráfego
3. **KPIs alvo:** CPA máximo aceitável, ROAS mínimo desejado
4. **Escopo:** `campaign-id` específico OU `account-id` para análise da conta toda

**Puxar dados via CLI:**

```bash
# Por campanha específica
node packages/meta-ads-agent/dist/bin/meta-ads.js report \
  --campaign-id {id} --period 7d --level adset --format json

# Por conta inteira (todas as campanhas)
node packages/meta-ads-agent/dist/bin/meta-ads.js report \
  --period 14d --level campaign --format json
```

Capturar output JSON para parsing no Step 2.

### Step 2: Processamento
Parsear JSON do CLI e organizar em tabela padronizada:

| Campanha/Conjunto | Gasto | Impressões | Cliques | CTR | CPC | Conversões | CPA | ROAS | Frequência |
|-------------------|-------|-----------|---------|-----|-----|-----------|-----|------|-----------|

### Step 3: Diagnóstico
Para cada campanha/conjunto, classificar:

- **🟢 Escalar:** ROAS > meta por 3+ dias, CPA < meta, frequência < 3.0
- **🔴 Pausar:** CPA > 2x meta por 3+ dias, ROAS < 50% meta, frequência > 4.0
- **🟡 Ajustar:** CPA entre 1-2x meta, ROAS entre 50-100% meta
- **⚪ Manter:** Métricas dentro da meta, sem tendência clara

### Step 4: Recomendações
Para cada item classificado, detalhar a ação:

- **Escalar:** Quanto aumentar o budget (sugestão: 20-30% por vez)
- **Pausar:** Justificativa e sugestão de substituição
- **Ajustar:** O que ajustar (criativo, público, lance, copy)
- **Manter:** Por quanto tempo monitorar antes de reavaliar

### Step 5: Log de Otimização
Preencher template `templates/optimization-log.md` com:
- Data da análise
- Dados analisados
- Decisões tomadas
- Justificativas
- Resultados esperados

## Regras
- Mínimo 3 dias de dados para qualquer decisão
- Sempre comparar contra thresholds de `data/kpi-thresholds.md`
- Registrar TODA decisão no log

## Output
- Diagnóstico por campanha/conjunto
- Lista de ações recomendadas
- Log de otimização preenchido

## Acceptance Criteria
- [ ] `meta-ads auth status` verificado e OK (Step 0)
- [ ] Dados puxados via `meta-ads report --format json` com 3+ dias (Step 1)
- [ ] JSON parseado e tabela padronizada montada com todas as métricas (Step 2)
- [ ] Cada campanha/conjunto recebeu classificação (🟢/🔴/🟡/⚪) (Step 3)
- [ ] Recomendações detalham AÇÃO + JUSTIFICATIVA (Step 4)
- [ ] Log preenchido em `templates/optimization-log.md` (Step 5)
- [ ] Thresholds de `kpi-thresholds.md` foram referenciados explicitamente
- [ ] Output do CLI persistido como anexo do log (auditoria)

## Handoff
- **Próximo agente:** Performance Analyst (`*report`) para consolidar resultados
- **Artefato passado:** log de otimização + diagnóstico
