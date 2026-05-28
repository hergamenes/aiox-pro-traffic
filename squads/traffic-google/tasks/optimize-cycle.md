# Task: Optimize Cycle

## Metadata
- **Agent:** Campaign Optimizer
- **Tipo:** Workflow analítico + mutacional (post-Epic 6)
- **Elicit:** true
- **Modos:** `--analyze` (default SAFE, somente leitura) | `--apply` (executa mutações via CLI)

## Objetivo
Analisar dados de performance e gerar recomendações de otimização baseadas em frameworks de decisão pré-definidos. Em modo `--apply`, executar as mutações aprovadas diretamente via CLI `google-ads` com guardrails anti-runaway/anti-bid-shock.

## SAFE-by-default
- `*optimize` ou `*optimize --analyze` → **modo padrão**: apenas lê dados e gera recomendações em texto. Nada é alterado na conta.
- `*optimize --apply` → **opt-in explícito do operador**: executa os comandos de mutação correspondentes às recomendações aprovadas. Requer confirmação humana antes de cada lote.

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

### Veto adicional para modo `--apply`
NÃO executar mutação se:
- ❌ Operador não confirmou explicitamente `--apply` (default é `--analyze`)
- ❌ Aumento de budget > 50% sem flag `--max-budget-increase` explícita (anti-runaway built-in)
- ❌ Aumento de lance de keyword > 50% sem confirmação explícita (anti-bid-shock)
- ❌ Pausar campanha com gasto < 3 dias de histórico
- ❌ Mutação em massa (>5 entidades) sem confirmação humana lote-a-lote
- ❌ Audit log (`~/.aiox/google-ads-mutations.log`) não-gravável

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

| Campanha/Grupo de Anúncios | Gasto | Impressões | Cliques | CTR | CPC | Conversões | CPA | ROAS |
|-------------------|-------|-----------|---------|-----|-----|-----------|-----|------|

### Step 2.5: Análise Manual de Tendência (sem MCP)

> ⚠️ Diferente do `traffic-meta` que usa `claude_ai_Facebook` MCP para anomaly detection / opportunity score / auction benchmarks, **NÃO há MCP de Google Ads ativo neste projeto**. Esta análise é feita manualmente a partir dos dados do CLI.

**Para cada campanha/grupo de anúncios candidato a pausar/escalar:**

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

### Step 6: Execução de Mutações (apenas modo `--apply`)

> ⚠️ Esta etapa SÓ roda quando o operador invocou `*optimize --apply`. No modo default (`--analyze`), pule direto para o Handoff.

#### 6.1 — Comandos de mutação (modo `--apply`)

Comandos CLI que o Optimizer pode executar quando autorizado:

```bash
# Escalar budget (anti-runaway built-in: bloqueia aumento > +50% sem override)
google-ads update budget {id} --daily {amount}

# Override do threshold anti-runaway (uso consciente; aumenta até o limite passado)
google-ads update budget {id} --daily {amount} --max-budget-increase 100

# Troca de estratégia de lances
google-ads update bidding {id} --strategy {strategy}

# Pausar campanha inteira (kill underperformer)
google-ads pause campaign {id}

# Pausar ad group (kill granular)
google-ads pause ad-group {id}

# Re-ativar campanha previamente pausada
google-ads enable campaign {id}

# Ajustar lance de keyword (anti-bid-shock built-in: bloqueia +50% sem override)
google-ads keyword update-bid {criterion-id} --cpc-bid {amount}

# Remover keyword de baixa performance
google-ads keyword remove {criterion-id}
```

#### 6.2 — Mapa decisão → comando

| Classificação | Condição | Comando CLI |
|---|---|---|
| 🟢 **Escalar** | ROAS > meta por 3+ dias | `google-ads update budget {id} --daily {atual * 1.2-1.3}` |
| 🔴 **Pausar** | CPA > 2x meta por 3+ dias | `google-ads pause campaign {id}` (ou `pause ad-group {id}` se granular) |
| 🟡 **Ajustar (lance)** | CPA entre 1-2x meta | `google-ads update bidding {id} --strategy {nova}` ou `google-ads keyword update-bid {criterion-id} --cpc-bid {ajustado}` |
| 🟡 **Ajustar (keyword)** | Keyword puxa CPA p/ cima sem converter | `google-ads keyword remove {criterion-id}` |
| ⚪ **Manter** | Métricas dentro da meta | **não executa nada** — só registra observação |

#### 6.3 — Protocolo de execução

1. **Apresentar plano** ao operador: lista de comandos que serão executados, agrupados por entidade
2. **Aguardar confirmação humana** lote-a-lote (não executar em massa sem aprovação)
3. **Executar comando** via Bash
4. **Capturar stdout/stderr** e validar exit code
5. **Registrar no audit log** (passo automático, ver 6.4)
6. **Se falhar:** abortar lote, reportar erro, não tentar rollback automático (operador decide)

#### 6.4 — Audit log automático

Todas as mutações são gravadas em `~/.aiox/google-ads-mutations.log` automaticamente pela CLI. Formato JSON-lines com:
- timestamp ISO-8601
- comando completo executado
- entidade afetada (campaign/ad-group/keyword + id)
- valor antes / valor depois
- exit code + resposta da API
- operador (usuário do sistema)

Este log é a fonte de verdade para auditoria pós-execução e rollback manual.

## Regras
- Mínimo 3 dias de dados para qualquer decisão
- Sempre comparar contra thresholds de `data/kpi-thresholds.md`
- Registrar TODA decisão no log
- **SAFE-by-default:** modo `--analyze` é o padrão; `--apply` requer opt-in explícito do operador
- **Anti-runaway:** aumentos de budget > 50% só com `--max-budget-increase` explícito
- **Anti-bid-shock:** aumentos de lance > 50% só com confirmação adicional
- **Audit trail obrigatório:** todas as mutações vão para `~/.aiox/google-ads-mutations.log`

## Output
- Diagnóstico por campanha/grupo de anúncios
- Lista de ações recomendadas
- Log de otimização preenchido
- **Modo `--apply`:** plano de execução + resultados das mutações + linhas adicionadas ao audit log

## Output Example

```markdown
# Optimize Cycle — Grupo Prestarh (9631900143) · 7d · modo --analyze
Meta: CPA ≤ R$ 12 · Objetivo: Leads

| Campanha | Gasto | CPC | Conv. | CPA | Classificação |
|----------|-------|-----|-------|-----|---------------|
| INSTITUCIONAL | R$ 58,12 | R$ 2,08 | 8 | R$ 7,27 | 🟢 Escalar |
| SERVIÇOS | R$ 75,09 | R$ 5,01 | 6 | R$ 12,52 | 🟡 Ajustar |

## Recomendações
- 🟢 INSTITUCIONAL: ROAS/CPA dentro da meta 3+ dias → subir budget +25%
  (R$ 30 → R$ 37,50). Comando (--apply): `google-ads update budget {id} --daily 37.50`
- 🟡 SERVIÇOS: keyword "consultoria de rh para empresas" tem CPC R$ 5,07 e puxa
  o CPA. Ação: adicionar negativas + revisar lance. NÃO pausar (dentro de 2x meta).

Modo: --analyze (nada foi alterado). Para executar: reenviar com --apply.
```

## Acceptance Criteria
- [ ] `google-ads auth status` verificado e OK (Step 0)
- [ ] Dados puxados via `google-ads report --format json` com 3+ dias (Step 1)
- [ ] JSON parseado e tabela padronizada montada com todas as métricas (Step 2)
- [ ] Análise manual de tendência (14 dias) executada (Step 2.5)
- [ ] Para campanhas Search: análise por keyword executada (Step 2.5)
- [ ] Cross-check com Google Ads UI documentado (Step 2.5)
- [ ] Cada campanha/grupo de anúncios recebeu classificação (🟢/🔴/🟡/⚪) (Step 3)
- [ ] Recomendações detalham AÇÃO + JUSTIFICATIVA + EVIDÊNCIA (dados CLI + análise manual) (Step 4)
- [ ] Log preenchido em `templates/optimization-log.md` (Step 5)
- [ ] Thresholds de `kpi-thresholds.md` foram referenciados explicitamente
- [ ] Output do CLI (JSONs por nível) persistido como anexo do log (auditoria)
- [ ] Modo de execução declarado explicitamente (`--analyze` ou `--apply`)

### Acceptance Criteria adicionais — modo `--apply`
- [ ] Operador confirmou opt-in explícito para `--apply`
- [ ] Plano de execução apresentado e aprovado lote-a-lote antes de rodar
- [ ] Mapa decisão → comando aplicado conforme tabela 6.2
- [ ] Guardrails anti-runaway / anti-bid-shock respeitados (sem overrides não-autorizados)
- [ ] Toda mutação gravada em `~/.aiox/google-ads-mutations.log`
- [ ] Falhas de execução reportadas com exit code + resposta da API
- [ ] Log de otimização atualizado com resultado real das mutações (não só recomendações)

## Handoff
- **Próximo agente:** Performance Analyst (`*report`) para consolidar resultados
- **Artefato passado:** log de otimização + diagnóstico
