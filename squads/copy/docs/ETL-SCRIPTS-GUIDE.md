# ETL Scripts Guide — Copy Squad

Scripts absorvidos do copywriter-os para aquisicao de fontes e enriquecimento de agents.

**Localizacao:** `squads/copy/scripts/`

---

## Categoria 1: Aquisicao de Fontes (Source Download)

Estes scripts baixam material fonte (livros, newsletters, transcricoes) para alimentar o pipeline de Mind DNA extraction.

| Script | O que faz | Dependencias | Quando usar |
|--------|-----------|-------------|-------------|
| `download-books.py` | Baixa livros via Z-Library API por tier (0/1/2/3/all) | Python3, requests | Quando precisar do livro de um expert para extração |
| `download-books.sh` | Wrapper bash do download-books.py | Bash, Python3 | Mesmo que acima (versão shell) |
| `download-halbert-letters.py` | Scrape das Halbert Letters + Boron Letters de thegaryhalbertletter.com | Python3, requests, BeautifulSoup | Para enriquecer Gary Halbert com newsletters |
| `download-bencivenga-maxims.py` | Scrape dos Marketing Maxims de marketingmaxims.com | Python3, requests | Para enriquecer Gary Bencivenga |
| `download-legends-content.py` | Scrape de conteudo publico de Makepeace, Lampropoulos, etc. | Python3, requests | Para experts sem livro disponivel |
| `download-swipe-files.sh` | Download de swipe files do Google Drive (Stefan Georgi) | Bash, curl | Para colecionar swipe files de experts |
| `download-swipe-gdrive-api.py` | Mesma funcao, via Google Drive API (melhor rate limiting) | Python3, google-api-python-client | Alternativa ao shell script |
| `extract-kortex.py` | Extrai posts da comunidade Kortex (Circle.so) | Python3, requests | Para conteudo de comunidades privadas |
| `youtube-etl.py` | Pipeline YouTube: Discovery -> Captions -> Transcription -> Clean | Python3, youtube_transcript_api | Para extrair transcricoes de experts no YouTube |
| `transcribe-seminars.py` | Transcreve audio de seminarios via AssemblyAI | Python3, assemblyai | Para material de audio/video |
| `pdf-to-markdown.py` | Converte PDFs em Markdown via Docling (IBM) | Python3, docling | Para converter livros PDF em texto processavel |

### Fluxo tipico de aquisicao

```
1. Identificar expert que precisa de enriquecimento
2. Verificar etl-material-map.yaml para fontes disponiveis
3. Rodar script apropriado (books, youtube, newsletters, etc.)
4. Material salvo em data/minds/{expert}/source-text/
5. Pronto para pipeline 7D extraction (ralph-7d.sh)
```

---

## Categoria 2: Pipeline de Extracao (Mind Enrichment)

| Script | O que faz | Dependencias | Quando usar |
|--------|-----------|-------------|-------------|
| `ralph-7d.sh` | Pipeline completo 7D Mind Extraction (Text -> 7D -> DNA -> QA) | Bash, Claude Code | Para extrair voice_dna + thinking_dna de um expert |
| `update-mind-batch.py` | Insere secao KNOWLEDGE BASE em agents existentes | Python3 | Para injetar KB em agents que ja existem |

### Fluxo 7D Extraction

```
1. Source text disponivel em data/minds/{expert}/source-text/
2. Rodar: ./scripts/ralph-7d.sh {expert-name}
3. Output:
   - data/minds/{expert}/7d-extraction-raw.md
   - data/minds/{expert}/voice_dna.yaml
   - data/minds/{expert}/thinking_dna.yaml
4. QA gate valida qualidade do DNA extraido
```

---

## Categoria 3: Monitoramento e Validacao

| Script | O que faz | Dependencias | Quando usar |
|--------|-----------|-------------|-------------|
| `etl-monitor.sh` | Dashboard minimalista do progresso das extrações RALPH-7D | Bash | Para acompanhar batch extractions |
| `etl-monitor-render.py` | Renderizador aesthetic do monitor | Python3 | Para visualizar progresso |
| `validate-squad-config.py` | Valida integridade do config.yaml vs filesystem | Python3, PyYAML | Apos adicionar novos componentes |
| `validate-copy-essentials.sh` | Valida pre-requisitos do copy squad | Bash | Health check do squad |

---

## Categoria 4: Runtime (Copy Squad Operation)

Estes scripts ja existiam ou apoiam a operacao do copy squad.

| Script | O que faz | Dependencias | Quando usar |
|--------|-----------|-------------|-------------|
| `generate-copy-greeting.cjs` | Gera greeting do copy-chief | Node.js, js-yaml | Ativacao do agent |
| `load-context.cjs` | Carrega contexto do workspace | Node.js, js-yaml | Pre-load na ativacao |
| `runtime-paths.cjs` | Resolve paths do workspace | Node.js | Utilitario |
| `set-active-context.cjs` | Define contexto ativo (business/product) | Node.js, js-yaml | Troca de contexto |
| `show-context.cjs` | Mostra contexto carregado | Node.js, js-yaml | Debug |
| `bootstrap-copy-workspace.sh` | Bootstrap inicial do workspace | Bash | Setup primeiro uso |

---

## Categoria 5: Workflows Externos (Multi-session)

| Script | O que faz | Dependencias | Quando usar |
|--------|-----------|-------------|-------------|
| `copy.sh` | Executa workflows de copy por fases com checkpoints | Bash, Claude Code | Producao de copy multi-sessao |
| `copy-discovery.sh` | Pipeline de discovery profundo | Bash, Claude Code | Research de fontes |
| `swipe.sh` | Pipeline de extracao de swipe files | Bash, Claude Code | Colecionar exemplos de copy |

---

## Dependencias Globais

```bash
# Python (para scripts de aquisicao)
pip3 install requests beautifulsoup4 youtube_transcript_api assemblyai docling pyyaml google-api-python-client

# Node.js (para scripts de runtime)
npm install js-yaml  # ja disponivel no projeto

# APIs necessarias
# - Z-Library: conta gratuita + cookie de sessao
# - YouTube: sem API key (captions publicas)
# - AssemblyAI: API key (para transcricao de audio)
# - Google Drive API: API key (para swipe files)
# - Docling: local, sem API key
```

---

## Prioridade de Uso

| Prioridade | Acao | Quando |
|-----------|------|--------|
| **1. Imediata** | Usar `data/minds/` existente como esta | Agents ja tem DNA pronto |
| **2. Quando precisar** | Rodar `ralph-7d.sh` para experts com source-text mas sem DNA | Se um expert precisa de refresh |
| **3. Expansao** | Rodar scripts de download para novos experts | Se adicionarmos novos copywriters |
| **4. Batch** | `etl-monitor.sh` para acompanhar | Se rodar multiplas extrações |
