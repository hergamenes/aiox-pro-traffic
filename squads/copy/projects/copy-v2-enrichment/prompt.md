# Copy Framework v2.0 - Source Enrichment

## MISSION

Enriquecer agents e tasks com conteúdo EXTRAÍDO DIRETAMENTE das fontes locais.

**REGRA:** LER os arquivos fonte ANTES de fazer updates. NÃO use conhecimento geral.

---

## FONTES DISPONÍVEIS CONFIRMADAS

```yaml
eugene_schwartz:
  pdf_disponivel: true
  path: "outputs/minds/eugene_schwartz/sources/books/Breakthrough Advertising How to Write.pdf"
  artifacts: "outputs/minds/eugene_schwartz/artifacts/"

dan_kennedy:
  pdfs_disponiveis: true
  path: "outputs/minds/dan_kennedy/sources/books/"
  livros:
    - "Dan Kennedys Chinese Menu Copywriting.pdf"
    - "No B.S. Marketing to the Affluent.pdf"
    - "No B.S. Price Strategy The Ultimate.pdf"
    - "No B.S. Sales Success The Ultimate.pdf"
    - "No B.S. Time Management for Entrepreneurs.pdf"
    - "No B.S. Wealth Attraction in the New.pdf"
    - "The Direct Mail Solution A Business.pdf"
    - "The Ultimate Marketing Plan.pdf"
    - "The Ultimate Success Secret.pdf"
    - "My Unfinished Business.pdf"
    - "Power Points Vol 1 & 2.pdf"
    - "The Phenomenon.pdf"

gary_halbert:
  pdf_boron: false  # NÃO DISPONÍVEL
  swipe_disponivel: true
  swipe_path: "outputs/minds/gary_halbert/sources/swipe/PDF/"
  swipe_count: "90+ sales letters"
  knowledge_extract: "outputs/minds/gary_halbert/sources/gary_halbert_knowledge_extract.md"

alex_hormozi:
  pdfs_livros: false  # Pastas vazias
  artifacts_disponivel: true
  artifacts_path: "outputs/minds/alex_hormozi/artifacts/"
  artifacts:
    - "01_FRAMEWORKS_OPERACIONAIS.md"
    - "02_VALUE_EQUATION_ENGINE.md"
    - "03_OFFER_CREATION_SYSTEM.md"
    - "04_COMMUNICATION_DNA.md"
    - "06_CASE_LIBRARY_DENSE.md"
    - "07_TESTING_OPTIMIZATION.md"

jon_benson:
  path: "outputs/minds/jon_benson/sources/"
  verificar: "Listar conteúdo antes de extrair"
```

---

## WORKFLOW

### 1. LISTAR CONTEÚDO DISPONÍVEL

Antes de extrair, liste o que existe:
```bash
ls -la outputs/minds/{mind}/sources/
ls -la outputs/minds/{mind}/artifacts/
```

### 2. LER OS ARQUIVOS

Para PDFs: Use o Read tool (Claude Code lê PDFs)
Para .md: Use o Read tool normalmente

### 3. EXTRAIR COM REFERÊNCIA

Formato obrigatório:
```markdown
> "Citação exata do texto aqui"
> [Fonte: Nome do Arquivo, Capítulo/Seção X]
```

### 4. ADICIONAR AO ARQUIVO DESTINO

Adicione no FINAL do arquivo existente:
```markdown
# ═══════════════════════════════════════════════════════════════════════════
# CONTEÚDO EXTRAÍDO DAS FONTES PRIMÁRIAS
# Data: 2026-01-23 | Enrichment Phase
# ═══════════════════════════════════════════════════════════════════════════

## Citações Diretas de [Fonte]

> "Texto exato..."
> [Fonte: Arquivo, Seção]

## [Framework] - Extraído de [Fonte]

[Detalhes completos]

Fonte: [Arquivo, Seção/Página]
```

---

## CRITÉRIOS DE QUALIDADE

### OBRIGATÓRIO:
- Citações diretas entre aspas
- Referência de arquivo/fonte em cada item
- Frameworks COMPLETOS (não resumir)
- Exemplos reais do material

### NÃO ACEITÁVEL:
- "Baseado em..." sem citação
- Frameworks incompletos
- Conteúdo genérico sem fonte

---

## COMPLETION

Quando terminar:
1. Verificar acceptance criteria
2. Verificar citações com fonte
3. Update prd.json: `passes: true`

```bash
jq --arg id "ENR-XXX" --arg notes "Completed: X citações, Y frameworks extraídos de Z arquivos" \
  '.userStories = [.userStories[] | if .id == $id then .passes = true | .notes = $notes else . end]' \
  squads/copy/projects/copy-v2-enrichment/prd.json > tmp.json && mv tmp.json squads/copy/projects/copy-v2-enrichment/prd.json
```

---

## GO!

1. Identifique sua story no PRD
2. Liste os arquivos fonte disponíveis
3. Leia os arquivos
4. Extraia conteúdo com referências
5. Atualize o arquivo destino
6. Marque como completo
