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
- **CLI google-ads autenticada** (`google-ads auth status` = OK)

> Dados de performance vêm em **tempo real via CLI** (`google-ads report --format json`). Não é mais necessário colar CSV/screenshot.

## Veto Conditions
NÃO executar se:
- ❌ Período de dados < 3 dias (insuficiente para decisão estatística)
- ❌ KPIs alvo não definidos (CPA máximo ou ROAS mínimo ausentes)
- ❌ `google-ads auth status` retornar expirado/não-configurado
- ❌ CLI `google-ads report` retornar erro (rede, permissões, account-id inválido)
- ❌ Objetivo da campanha não declarado
- ❌ Recomendação de pausar/escalar sem 3+ dias consecutivos confirmando tendência

## Fluxo

### Step 0: Pré-validação Real-Time
Verificar infraestrutura antes de qualquer leitura:

```bash
node packages/google-ads-agent/dist/bin/google-ads.js auth status
```

- Se expirado → BLOQUEAR e guiar para `google-ads auth setup`

### Step 1: Coleta de Dados em Tempo Real

Coletar parâmetros do usuário:

1. **Período:** 7d, 14d ou 30d (CLI aceita `--period 7d`)
2. **Objetivo da campanha:** Vendas, Leads, Tráfego
3. **KPIs alvo:** CPA máximo aceitável, ROAS mínimo desejado
4. **Escopo:** `campaign-id` específico OU `account-id` para análise da conta toda

**Puxar dados via CLI:**

```bash
# Por campanha específica
node packages/google-ads-agent/dist/bin/google-ads.js report \
  --campaign-id {id} --period 7d --level ad_group --format json

# Por conta inteira (todas as campanhas)
node packages/google-ads-agent/dist/bin/google-ads.js report \
  --period 14d --level campaign --format json
```

Capturar output JSON para parsing no Step 2.

### Step 2: Processamento
Parsear JSON do CLI e organizar em tabela padronizada:

| Campanha/Conjunto | Gasto | Impressões | Cliques | CTR | CPC | Conversões | CPA | ROAS | Frequência |
|-------------------|-------|-----------|---------|-----|-----|-----------|-----|------|-----------|

### Step 2.5: Análise Manual de Tendência (sem MCP)

> ⚠️ Diferente do `traffic-meta` que usa `claude_ai_Facebook` MCP para anomaly detection / opportunity score / auction benchmarks, **NÃO há MCP de Google Ads ativo neste projeto**. Esta análise é feita manualmente a partir dos dados do CLI.

**Para cada conjunto candidato a pausar/escalar:**

1. **Verificação de tendência:** Puxar histórico de 14 dias e plotar curva mental — se houver pico/queda abrupto recente, marcar como suspeita de anomalia (investigar antes de agir)
2. **Análise por palavra-chave (Google-only):** Para campanhas Search, rodar `report --level keyword` e identificar quais keywords carregam o gasto/conversão. Decisões granulares por keyword.
3. **Cross-check com Google Ads UI:** Para diagnóstico mais profundo (Quality Score, posição no leilão), abrir Google Ads UI — esses dados não estão na CLI atual.

### Step 3: Diagnóstico
Para cada campanha/grupo, classificar:

- **🟢 Escalar:** ROAS > meta por 3+ dias, CPA < meta, conversões crescentes
- **🔴 Pausar:** CPA > 2x meta por 3+ dias, ROAS < 50% meta, conversões caindo
- **🟡 Ajustar:** CPA entre 1-2x meta, ROAS entre 50-100% meta (ajustar keywords/lances/copies)
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
- [ ] `google-ads auth status` verificado e OK (Step 0)
- [ ] Dados puxados via `google-ads report --format json` com 3+ dias (Step 1)
- [ ] JSON parseado e tabela padronizada montada com todas as métricas (Step 2)
- [ ] Análise manual de tendência (14 dias) executada (Step 2.5)
- [ ] Para campanhas Search: análise por keyword executada (Step 2.5)
- [ ] Cross-check com Google Ads UI documentado (Step 2.5)
- [ ] Cada campanha/conjunto recebeu classificação (🟢/🔴/🟡/⚪) (Step 3)
- [ ] Recomendações detalham AÇÃO + JUSTIFICATIVA + EVIDÊNCIA (dados CLI + análise manual) (Step 4)
- [ ] Log preenchido em `templates/optimization-log.md` (Step 5)
- [ ] Thresholds de `kpi-thresholds.md` foram referenciados explicitamente
- [ ] Output do CLI (JSONs por nível) persistido como anexo do log (auditoria)

## Handoff
- **Próximo agente:** Performance Analyst (`*report`) para consolidar resultados
- **Artefato passado:** log de otimização + diagnóstico
