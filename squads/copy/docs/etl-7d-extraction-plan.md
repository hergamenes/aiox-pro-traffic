---
version: "1.2"
date: "2026-03-10"
updated: "2026-03-10"
author:
  agent: "squad-chief"
  squad: "squad-creator"
  reviewed_by: "pedro-valerio"
  methodology_by: "oalanicolas"
aiox: true
project: "copy"
---

# ETL 7D Extraction Plan — CopywriterOS

> Plano completo para extração de conhecimento dos 25 agentes do CopywriterOS.
> Executor: **RALPH ETL v2** (adaptado para 7D extraction)
> Baseado em: `wf-extraction-pipeline.yaml` + prompt 7D + ralph-etl-v2.sh + modelo alex-hormozi
> Metodologia: `docs/frameworks/extraction-methodology-7d.md` (reutilizavel para outros squads)
> Specialists: @pedro-valerio (processo), @oalanicolas (DNA extraction), squad-chief (arquitetura)
> Reviewed: @pedro-valerio — 6 vetos aplicados (v1.1)
> Methodology: @oalanicolas — 4 ajustes de curadoria aplicados (v1.2)

---

## 1. VISAO GERAL

### Problema
25 agentes com `frameworks_inventory.yaml` (extracao lightweight DONE) mas sem:
- `voice_dna.yaml` — como comunicam
- `thinking_dna.yaml` — frameworks profundos, heuristicas, decision trees
- Quality gates e cases empiricos

### Objetivo
Enriquecer cada agente com KB profundo extraido dos livros (22 disponiveis, 458MB),
mantendo self-contained no squad e sem duplicar o que ja existe inline.

### Executor: RALPH ETL v2 (Adaptado)
**Source:** `squads/branding/scripts/ralph-etl-v2.sh` (1,761 linhas, battle-tested)
**Adaptacao:** Criar `squads/copy/scripts/ralph-7d.sh` baseado no ralph-etl-v2
**Por que RALPH:**
- State machine com resume (pode parar e continuar)
- Circuit breaker (3 no-progress → STOP automatico)
- Dual exit gate (2/3 sinais de completude)
- Model tiering (Haiku para mecanico, Opus para sintese)
- progress.txt com aprendizado acumulado entre iteracoes
- CLI com --phase, --resume, --skip-download, --dry-run

### Modelo de Referencia (GOLDEN STANDARD)
```
squads/copy/data/minds/alex-hormozi/
├── voice_dna.yaml          (151 linhas — como comunica)
├── thinking_dna.yaml       (178 linhas — frameworks + heuristicas)
├── offer-quality-gate.yaml (193 linhas — validation gates condensados)
└── offer-cases.yaml        (120 linhas — prova empirica)
```
Total: 642 linhas. Token cost: ~4K. Benchmark de qualidade e tamanho.

---

## 2. ARQUITETURA DE OUTPUT

### Por agente, produzir:

| Arquivo | Obrigatorio? | Conteudo | Target |
|---------|-------------|----------|--------|
| `voice_dna.yaml` | SIM | Identity, vocabulario, tokens, tone, patterns | 100-200 linhas |
| `thinking_dna.yaml` | SIM | Frameworks, heuristicas, decision trees, veto conditions | 150-250 linhas |
| `{specialty}-quality-gate.yaml` | SOMENTE T0/T1 | Gates de validacao condensados | 100-200 linhas |
| `cases.yaml` | OPCIONAL | Cases empiricos do autor | 80-120 linhas |

### Localizacao
```
squads/copy/data/minds/{agent-slug}/
├── 7d-extraction-raw.md    (intermediario — RALPH Phase 6 output)
├── voice_dna.yaml           (final — RALPH Phase 7 output)
├── thinking_dna.yaml        (final — RALPH Phase 7 output)
├── [optional: quality-gate.yaml]
└── [optional: cases.yaml]
```

### Token Budget por Tier

| Tier | Model | Max KB tokens | Max linhas total |
|------|-------|--------------|-----------------|
| T0 Diagnostic (Opus) | opus | 5K | 800 |
| T1 Masters (Opus) | opus | 5K | 800 |
| T2 Systematizers (Sonnet) | sonnet | 3K | 500 |
| T3 Specialists (Sonnet) | sonnet | 2.5K | 400 |
| T4 Tool (Haiku) | haiku | 1.5K | 250 |

---

## 3. ESTRATEGIA DE DEDUP (Evitar Conflito com Existente)

### O que JA existe por agente:

| Artefato | Onde | Status |
|----------|------|--------|
| `frameworks_inventory.yaml` | `data/books/{slug}/` | DONE — lightweight, 30-60 frameworks |
| Inline knowledge | `agents/{slug}.md` | DONE — core principles, heuristics, voice inline |
| Hormozi SOPs/checklists | `squads/hormozi/docs/sops/` | EXISTE — mas e do squad Hormozi, nao CopywriterOS |

### Regras de Dedup:

1. **frameworks_inventory.yaml → INPUT, nao output.**
   Usar como fonte para enriquecer thinking_dna.yaml. Nao duplicar.

2. **Inline knowledge no .md → MANTER como resumo.**
   O .md fica como "versao compacta". thinking_dna.yaml e a "versao profunda".
   Agent carrega .md sempre + thinking_dna.yaml sob demanda (via dependencies).

3. **Hormozi SOPs → EXTRAIR e CONDENSAR (como fizemos com alex-hormozi).**
   Nunca copiar inteiro. Nunca referenciar cross-squad.

4. **7D extraction → FILTRAR dimensoes relevantes ao papel.**
   Nem toda dimensao e util para todo agente. Ver secao 5.

### Merge Protocol (Decision Tree — FIX VETO 2 + FIX AN-3):
```
PARA CADA framework no 7D output:

  STEP 0: FILTRO DE AUTENTICIDADE (FIX AN-3 — executar ANTES do merge)
     "Este framework e PROPRIETARIO desse expert?"

     Sinais de PROPRIETARIO:
     - Expert criou o NOME do framework
     - Expert e a referencia primaria citada por outros
     - Framework tem terminologia especifica do expert
     - Aparece em 3+ fontes DO MESMO expert (triangulacao)

     Sinais de GENERICO:
     - Qualquer expert da area diz algo parecido
     - Nao tem nome proprio
     - E "boa pratica" da industria
     - Expert esta REPETINDO outro expert

     SE GENERICO → DESCARTAR imediatamente
        → Log: "DESCARTADO: {nome} — generico, nao proprietario"
     SE PROPRIETARIO → continuar para Steps 1-4

  1. BUSCAR por NOME EXATO em frameworks_inventory.yaml
     SE match exato:
       → MANTER o mais profundo (7D tem mais profundidade)
       → ADICIONAR citacoes novas do 7D ao existente
       → NUNCA duplicar — 1 entry por framework

  2. SE nome diferente mas conceito similar (>80% overlap):
     → FLAG para review humano via progress.txt
     → RALPH pausa e pede decisao: "merge ou manter separado?"

  3. SE framework NOVO (nao existia no lightweight):
     → VERIFICAR: tem [SOURCE: pagina/capitulo]?
       SIM → ADICIONAR ao thinking_dna.yaml
       NAO → DESCARTAR (anti-invention gate)

  4. SE framework GENERICO (catch-all — redundante com Step 0):
     → DESCARTAR imediatamente
     → Log: "DESCARTADO: {nome} — generico, sem fonte do autor"
```

---

## 4. PIPELINE RALPH-7D (7 Fases)

### Mapeamento RALPH → CopywriterOS 7D

| RALPH Phase | CopywriterOS Phase | Model | Acao |
|-------------|-------------------|-------|------|
| Phase 0: INIT | Fase 0: Source Validation | bash | Validar fontes, criar state |
| Phase 1: DISCOVER | SKIP | — | Fontes ja adquiridas |
| Phase 2: DOWNLOAD | SKIP | — | Livros ja baixados |
| Phase 3: TRANSCRIBE | SKIP | — | Livros ja em texto |
| Phase 4: EXTRACT | Fase 1: Text Extraction | Haiku | Limpar PDFs, extrair texto puro |
| Phase 5: SOCIAL | SKIP | — | N/A para livros |
| Phase 6: SYNTHESIZE | Fase 2: 7D Extraction | Opus | Prompt 7D → raw extraction |
| **Phase 7: NEW** | Fase 3: DNA Synthesis | Opus | 7D raw → voice_dna + thinking_dna |

**CLI adaptado:**
```bash
./scripts/ralph-7d.sh --mind andre-chaperon --phase 4 --skip-download --skip-social --skip-discover
```

### Owner Matrix (FIX VETO 1)

| Fase | Owner Humano | Owner AI | Decisao | Automacao |
|------|-------------|----------|---------|-----------|
| 0: Init/Validation | Lucas (configura queue) | RALPH (valida) | GO/NO-GO binario | State machine |
| 1: Text Extraction | — | RALPH + Haiku | Automatico | Phase transition |
| 2: 7D Extraction | — | RALPH + Opus | Anti-invention check | progress.txt |
| 3: DNA Synthesis | — | RALPH + Opus | Merge protocol | Circuit breaker |
| 4: Quality Gate | — | RALPH + Opus | T0/T1 filter | Condicional |
| 5: Integration | Lucas (review) | Claude | Smoke test PASS/FAIL | Commit manual |

### Fase 0: Init + Source Validation (BLOCKING)
**Executor:** RALPH (bash) + humano
**Input:** `etl-queue.yaml` (lista de agentes + fontes)
**Output:** `etl-state.json` com coverage score por agente

```yaml
# etl-queue.yaml (exemplo)
mind: "copy-7d"
agents:
  - slug: "andre-chaperon"
    tier: 3
    sources:
      - path: "data/books/andre-chaperon/"
        type: "web-content"
    frameworks_inventory: "data/books/andre-chaperon/frameworks_inventory.yaml"
    agent_file: "agents/andre-chaperon.md"
    priority: "P0"  # pilot
```

**Veto Conditions (FIX):**
- Source score < 3/4 → NO-GO. RALPH nao avanca.
- Livro nao existe em data/books/{slug}/ → PARAR.
- frameworks_inventory.yaml nao existe → FLAG warning (pode prosseguir sem dedup)

### Fase 1: Text Extraction (Haiku — Machine Speed)
**Executor:** RALPH + Haiku
**Input:** PDFs/HTMLs em data/books/{slug}/
**Output:** Texto limpo em data/minds/{slug}/source-text/

**Veto Conditions:**
- Output < 5K palavras → material insuficiente, FLAG
- Texto corrompido (encoding issues) → PARAR, fix manual

### Fase 2: 7D Extraction (Opus — Synthesis)
**Executor:** RALPH + Opus
**Input:** Texto limpo + prompt 7D (`docs/frameworks/Extracao de Frameworks e Checklist.md`)
**Output:** `data/minds/{slug}/7d-extraction-raw.md` (~5-15K palavras)

**Dimensoes filtradas por papel no squad:**

| Dimensao 7D | Voice DNA | Thinking DNA | Quality Gate | Cases |
|-------------|-----------|-------------|-------------|-------|
| D1: Framework Completo | - | CORE | parcial | - |
| D2: Insights Revolucionarios | - | SIM | - | - |
| D3: Contra-Intuitivos | - | SIM (anti-patterns) | - | - |
| D4: Historias/Cases | - | - | - | CORE |
| D5: Numeros/Formulas | - | SIM (heuristics) | SIM | - |
| D6: Aplicacoes Imediatas | - | parcial | - | - |
| D7: Citacoes/Mantras | CORE | - | - | - |

**Prompt Modifiers por Tier (FIX AN-1):**
O prompt 7D generico nao funciona igual para todo tier. Adicionar modifier ao prompt:

```yaml
prompt_modifiers:
  T0_diagnostic:
    amplify: [D1_frameworks, D5_numeros, D3_contra_intuitivos]
    reduce: [D7_citacoes, D4_historias]
    instruction: "Priorize frameworks de DIAGNOSTICO e DECISAO. Como esse expert AVALIA antes de agir?"

  T1_masters:
    amplify: [D1_frameworks, D4_historias, D5_numeros]
    reduce: [D6_aplicacoes]
    instruction: "Priorize frameworks COMPLETOS com cases de resultado. Como esse expert EXECUTA copy de alto impacto?"

  T2_systematizers:
    amplify: [D1_frameworks, D6_aplicacoes, D5_numeros]
    reduce: [D4_historias, D7_citacoes]
    instruction: "Priorize SISTEMAS replicaveis e formulas. Como esse expert SISTEMATIZA o processo?"

  T3_specialists:
    amplify: [D7_citacoes, D1_frameworks, D6_aplicacoes]
    reduce: [D4_historias, D5_numeros]
    instruction: "Priorize VOZ e ESTILO especifico do formato. Como esse expert SONA diferente dos outros?"

  T4_tool:
    amplify: [D6_aplicacoes, D5_numeros]
    reduce: [D4_historias, D7_citacoes, D3_contra_intuitivos]
    instruction: "Priorize CHECKLISTS e TRIGGERS aplicaveis. O que o executor verifica mecanicamente?"
```

RALPH deve injetar o modifier correspondente ao tier do agente ANTES do prompt 7D.

**Anti-invention gate + Gradacao de Evidencia (FIX AN-4):**
Nem toda citacao tem o mesmo peso. Hierarquia de evidencia:

```yaml
evidence_hierarchy:
  tier_1_gold:
    format: "[SOURCE: Livro, p.47]"
    description: "Citacao direta com pagina/capitulo"
    weight: 1.0

  tier_2_silver:
    format: "[SOURCE: Livro, cap.3]"
    description: "Parafrase com capitulo (sem pagina exata)"
    weight: 0.8

  tier_3_bronze:
    format: "[SOURCE: Livro]"
    description: "Conceito do livro sem localizacao"
    weight: 0.6

  tier_4_inferred:
    format: "[INFERRED: pattern across cap.2-4]"
    description: "Inferencia marcada com base"
    weight: 0.3

  tier_5_unmarked:
    format: "(sem marcacao)"
    description: "Afirmacao sem fonte"
    weight: 0.0
    veto: "DESCARTAR imediatamente"

quality_gate:
  minimum_weighted_score: 0.7
  formula: "soma(weight x count) / total_items"
  rule: "SE score < 0.7 → REJEITAR e re-extrair com foco em citacoes"
```

**Veto Conditions:**
- 7D output < 2K palavras → material insuficiente, re-extrair com prompt ajustado
- Evidence quality score < 0.7 → REJEITAR output, re-extrair com foco em citacoes
- Qualquer afirmacao sem marcacao (tier_5) → DESCARTAR item imediatamente
- Circuit breaker: 3 tentativas sem progresso → STOP, flag para review humano

### Fase 3: DNA Synthesis (Opus — Merge + Compress)
**Executor:** RALPH + Opus
**Input:** 7D raw + frameworks_inventory + agent.md (carregados SEQUENCIALMENTE — FIX VETO 3)
**Output:** voice_dna.yaml + thinking_dna.yaml

**Sequencia obrigatoria de carregamento (FIX VETO 3):**
```
STEP 1: Ler agent.md → extrair SOMENTE secoes:
        - core_principles (linhas X-Y)
        - thinking_dna inline (linhas X-Y)
        - voice_dna inline (linhas X-Y)
        → Salvar em context como "agent_summary" (~200 linhas max)

STEP 2: Ler frameworks_inventory.yaml → extrair SOMENTE:
        - Lista de nomes de frameworks
        - Count total
        → Salvar em context como "existing_frameworks" (~50 linhas max)

STEP 3: Ler 7d-extraction-raw.md (completo)
        → Com agent_summary + existing_frameworks ja em contexto
        → Aplicar merge protocol (secao 3)
        → Gerar voice_dna.yaml + thinking_dna.yaml
```

**Filtro de Curadoria Pareto ao Cubo (FIX AN-2):**
Compressao ≠ curadoria. Cada item extraido passa por 3 testes ANTES de entrar no output:

```
PARA CADA framework/heuristica no 7D raw:

  TESTE 1: Singularidade
  "Outro expert de copywriting diria isso com essas EXATAS palavras?"
  → SIM = generico, candidato a DESCARTE
  → NAO = proprietario do expert, MANTER

  TESTE 2: Operacionalidade
  "Um copywriter consegue APLICAR isso em 5 minutos?"
  → SIM = pratico, MANTER
  → NAO = teorico, CONDENSAR ou DESCARTAR

  TESTE 3: Fonte verificavel
  "Tem [SOURCE: pagina/capitulo]?"
  → SIM = rastreavel, MANTER
  → NAO = inferencia, MARCAR [INFERRED] ou DESCARTAR

  RESULTADO:
  - 3/3 PASS → 0,8% (zona de genialidade) → PRIMEIRO no output
  - 2/3 PASS → 4% (excelencia) → INCLUIR se caber no budget
  - 1/3 PASS → 20% (impacto) → SO se sobrar espaco
  - 0/3 PASS → 80% (merda) → DESCARTAR
```

**Veto Conditions:**
- voice_dna > 250 linhas → CURAR (nao so comprimir) antes de salvar
- thinking_dna > 300 linhas → CURAR antes de salvar
- Nenhum framework do autor (so genericos) → VETO, re-extrair
- Token budget do tier excedido → aplicar Pareto ao Cubo para cortar 80% merda primeiro
- \> 30% do thinking_dna e zona 20% ou pior → COMPRIMIR mais, budget desperdicado

### Fase 4: Quality Gate + Cases (SOMENTE T0/T1)
**Executor:** RALPH + Opus
**Input:** 7D raw (D4, D5)
**Output:** quality-gate.yaml + cases.yaml (opcional)

**Regra:** So executar se tier_definitions.yaml marca agente como T0 ou T1.
T2/T3 → SKIP automatico para Fase 5.

**Veto Conditions:**
- Quality gate sem resultado+prazo+condicao → REJEITAR
- Cases sem [SOURCE:] → DESCARTAR

### Fase 5: Integration + Validation (FIX VETO 5)
**Executor:** Claude (sessao humana) + validate-agent
**Input:** Arquivos gerados em data/minds/{slug}/
**Output:** Agent.md atualizado + smoke test result

**Checklist INLINE (BLOQUEANTE — FIX VETO 4):**
```
Antes de marcar agente como DONE:
- [ ] voice_dna.yaml salvo em data/minds/{slug}/
- [ ] thinking_dna.yaml salvo em data/minds/{slug}/
- [ ] Dependencies atualizadas no agent.md
- [ ] git add feito para todos arquivos novos
- [ ] Smoke test executado e PASS
```

**Smoke Test Concreto (FIX VETO 5):**
```
INPUT:  Ativar agente via /copywriterOs:agents:{slug}
PROMPT: "Aplique seu framework principal ao seguinte brief:
         Produto: curso online de fotografia para iniciantes, R$497.
         Objetivo: sales page. Publico: mulheres 25-40."

VALIDACAO (3 checks — 3/3 para PASS):
- [ ] Output contem >= 3 termos do voice_dna.yaml (vocabulary.always_use)
- [ ] Output aplica >= 1 framework do thinking_dna.yaml (by name)
- [ ] Output NAO contem termos de voice_dna.yaml.never_use

SE < 3/3: FAIL → investigar qual KB nao esta sendo carregado
```

---

## 5. FASES DE EXECUCAO (Cronograma)

### Fase A: PILOT (3 agentes leves) — PRIMEIRO
**Agentes:** chaperon, deutsch, rutz
**Por que:** T3 Specialists, menor token budget, mais rapido para validar pipeline
**Material:** frameworks_inventory.yaml ja existe (36-42 frameworks cada)
**Estimativa:** 3-4h total (1-1.5h/agente)

**CLI:**
```bash
./scripts/ralph-7d.sh --mind andre-chaperon --skip-download --skip-social --skip-discover
./scripts/ralph-7d.sh --mind david-deutsch --skip-download --skip-social --skip-discover
./scripts/ralph-7d.sh --mind jim-rutz --skip-download --skip-social --skip-discover
```

**Gate:** Se 3/3 passam smoke test → pipeline validado → avancar para Fase B.

### Fase B: T0 DIAGNOSTIC (3 agentes) — Alta prioridade
**Agentes:** hopkins, schwartz, collier
**Por que:** T0 roda em Opus, fundamentais para diagnostico pre-copy
**Material:** 2 livros cada (Scientific Advertising, Breakthrough Advertising, etc.)
**Estimativa:** 5-6h total (mais profundo, mais material)
**Extra:** quality-gate.yaml para cada (papel diagnostico)

### Fase C: T1 MASTERS (6 agentes) — Core
**Agentes:** halbert, bencivenga, ogilvy, makepeace, carlton, lampropoulos
**Por que:** T1 roda em Opus, copy de alto impacto
**Material:** Varia (newsletters, livros, seminarios)
**Estimativa:** 8-10h total
**Extra:** quality-gate.yaml + cases.yaml para masters com cases documentados

### Fase D: T2 SYSTEMATIZERS (6 agentes) — Medio
**Agentes:** kennedy, brown, walker, georgi, brunson, kern
**Nota:** alex-hormozi JA FEITO (referencia)
**Material:** Mix de livros e YouTube transcripts
**Estimativa:** 6-8h total

### Fase E: REMAINING T3 + T4 (3 agentes) — Final
**Agentes:** benson, ry-schwartz, dan-koe (T3) + sugarman tool update (T4)
**Nota:** chaperon, deutsch, rutz feitos no pilot
**Estimativa:** 3-4h total

### Timeline Total

| Fase | Agentes | Horas | Semana |
|------|---------|-------|--------|
| A: Pilot | 3 | 3-4h | Semana 1 |
| B: T0 | 3 | 5-6h | Semana 1-2 |
| C: T1 | 6 | 8-10h | Semana 2-3 |
| D: T2 | 6 | 6-8h | Semana 3-4 |
| E: T3/T4 | 3 | 3-4h | Semana 4 |
| **Total** | **21** | **25-32h** | **4-5 semanas** |

**Early-exit (FIX VETO 6):**
SE 2 agentes consecutivos falham quality gate → PARAR batch.
Investigar pipeline. Nao continuar cegamente.
RALPH circuit breaker ativo: 3 no-progress → STOP automatico.

---

## 6. COMANDOS DE EXECUCAO

### CLI RALPH-7D:
```bash
# Pilot — 1 agente
./scripts/ralph-7d.sh --mind andre-chaperon --skip-download --skip-social --skip-discover

# Pilot — com dry-run primeiro
./scripts/ralph-7d.sh --mind andre-chaperon --dry-run

# Resumir de onde parou
./scripts/ralph-7d.sh --mind andre-chaperon --resume

# Forcar fase especifica
./scripts/ralph-7d.sh --mind andre-chaperon --phase 6

# Batch (futuro — apos pilot validado)
for slug in hopkins schwartz collier; do ./scripts/ralph-7d.sh --mind $slug --skip-download --skip-social; done
```

### Integracao pos-RALPH (manual):
```bash
# 1. Review outputs
ls squads/copy/data/minds/{slug}/

# 2. Atualizar agent dependencies
# Edit agents/{slug}.md → adicionar minds: section

# 3. Smoke test
# Ativar agente e rodar prompt padrao (ver secao 4, Fase 5)

# 4. Commit (via @devops)
git add squads/copy/data/minds/{slug}/ squads/copy/agents/{slug}.md
```

---

## 7. RISCOS E MITIGACOES

| Risco | Probabilidade | Mitigacao | Owner |
|-------|--------------|-----------|-------|
| 7D output generico (invencao) | Alta | Anti-invention gate: [SOURCE:] obrigatorio | RALPH (auto) |
| Token budget estourado | Media | Compression pass na Fase 3 + veto > max linhas | RALPH (auto) |
| Duplicata com inline | Alta | Merge protocol com decision tree (secao 3) | RALPH + humano |
| Livro nao disponivel | Baixa (2/25) | Z-Library retry ou YouTube fallback | Lucas (manual) |
| Inconsistencia voice entre agents | Media | Cada agente tem voice UNICA — nao padronizar | By design |
| Rate limit em batch | Alta se paralelo | 1 agente por vez via RALPH | RALPH (auto) |
| Context overflow na sintese | Media | Carregamento sequencial em 3 steps (FIX V3) | RALPH (auto) |
| Pipeline quebrado em batch | Media | Early-exit: 2 falhas consecutivas → STOP | RALPH (circuit breaker) |

---

## 8. VETO CONDITIONS POR FASE (Compilado @pedro-valerio)

```yaml
veto_conditions:
  fase_0_init:
    - "Source score < 3/4 → NO-GO. RALPH nao avanca."
    - "Livro nao existe em data/books/{slug}/ → PARAR."
    - "frameworks_inventory.yaml nao existe → WARNING (prossegue sem dedup)"

  fase_1_extract:
    - "Output < 5K palavras → material insuficiente, FLAG"
    - "Texto corrompido → PARAR, fix manual"

  fase_2_7d:
    - "7D output < 2K palavras → re-extrair com prompt ajustado"
    - "Evidence quality score < 0.7 → REJEITAR output, re-extrair (FIX AN-4)"
    - "Afirmacao sem marcacao (tier_5) → DESCARTAR item imediatamente (FIX AN-4)"
    - "Circuit breaker: 3 tentativas sem progresso → STOP"
    - "Prompt modifier do tier nao injetado → PARAR, corrigir (FIX AN-1)"

  fase_3_synthesis:
    - "voice_dna > 250 linhas → CURAR (Pareto ao Cubo), nao so comprimir (FIX AN-2)"
    - "thinking_dna > 300 linhas → CURAR antes de salvar (FIX AN-2)"
    - "Nenhum framework do autor (so genericos) → VETO, re-extrair"
    - "Token budget do tier excedido → Pareto ao Cubo: cortar 80% merda primeiro (FIX AN-2)"
    - "> 30% do thinking_dna e zona 20% ou pior → COMPRIMIR mais (FIX AN-2)"
    - "Framework generico passou pelo merge → VETO, Step 0 falhou (FIX AN-3)"

  fase_4_quality_gate:
    - "Quality gate sem resultado+prazo+condicao → REJEITAR"
    - "Cases sem [SOURCE:] → DESCARTAR"
    - "Tier != T0/T1 → SKIP fase inteira"

  fase_5_integration:
    - "Dependencies nao atualizadas no .md → BLOQUEAR commit"
    - "Smoke test < 3/3 checks → FAIL, investigar KB loading"

  batch:
    - "2 agentes consecutivos falham quality gate → PARAR batch"
    - "RALPH circuit breaker: 3 no-progress → STOP automatico"
```

---

## 9. DEFINICAO DE "DONE"

### Por agente:
- [ ] voice_dna.yaml existe e tem 100-250 linhas
- [ ] thinking_dna.yaml existe e tem 150-250 linhas
- [ ] Nenhuma afirmacao sem [SOURCE:]
- [ ] Dependencies atualizadas no agent.md (minds: section)
- [ ] Smoke test PASS (3/3 checks — ver secao 4, Fase 5)
- [ ] Token budget do tier respeitado
- [ ] git add + commit feito

### Por squad (final):
- [ ] 21+ agentes com minds/ completo
- [ ] Committed e pushed
- [ ] MEMORY.md atualizado com status
- [ ] Nenhum cross-squad dependency
- [ ] Todos smoke tests PASS

---

## 10. PROXIMO PASSO IMEDIATO

### Pre-requisito: Criar ralph-7d.sh
1. Copiar `squads/branding/scripts/ralph-etl-v2.sh` como base
2. Adaptar para CopywriterOS:
   - Phase 6 prompt → usar `docs/frameworks/Extracao de Frameworks e Checklist.md`
   - Adicionar Phase 7 (DNA Synthesis)
   - Skip phases 1-3, 5 por default (fontes ja adquiridas)
   - Output path → `squads/copy/data/minds/{slug}/`
3. Criar `squads/copy/data/etl-queue.yaml` com 3 agentes pilot

### Pilot: Andre Chaperon
```bash
./scripts/ralph-7d.sh --mind andre-chaperon --dry-run  # Preview
./scripts/ralph-7d.sh --mind andre-chaperon             # Execute
```

### Validacao pos-pilot:
SE 3/3 agentes pilot PASS smoke test → pipeline validado → avancar para Fase B.
SE < 3/3 → ajustar prompt/pipeline antes de batch.

---

## FLUXO UNIDIRECIONAL (Confirmado @pedro-valerio)

```
Fase 0 (Init) → Fase 1 (Extract) → Fase 2 (7D) → Fase 3 (Synthesis)
                                                         ↓
                                                   Fase 4 (T0/T1 only)
                                                         ↓
                                                   Fase 5 (Integration)
                                                         ↓
                                                       DONE

SE qualquer fase FALHA → re-executar MESMA fase. NUNCA voltar.
```

— A melhor coisa e voce impossibilitar caminhos.
— Nada volta num fluxo. NUNCA.
