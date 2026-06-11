# Feature Spec — `google-ads keyword-research`

> **Autor:** Performance Analyst (📊) · **Status:** Draft (input para @sm criar story) · **Data:** 2026-06-11
> **Origem:** Demanda real — pesquisa de volume de busca para Bento Ghostwriting (customer-id 4507487307)

## 1. Problema

A CLI `google-ads` hoje só lê **performance de keywords já ativas** (`report --level keyword`, via `keyword_view`). Não existe forma de descobrir **volume de busca** e **ideias de palavras novas** antes de criar campanha. O gestor precisa hoje abrir o Planejador de Palavras-chave manualmente na interface web.

## 2. Objetivo

Adicionar um comando que consulta a API **`KeywordPlanIdeaService.GenerateKeywordIdeas`** do Google Ads e devolve, por palavra: volume médio mensal de buscas, concorrência, faixa de CPC (topo/fundo de página) e ideias relacionadas.

## 3. Interface do comando (proposta)

```bash
google-ads keyword-research \
  --seeds "escrever livro com IA, criar ebook com inteligência artificial" \
  --geo BR \
  --lang pt \
  --customer-id 4507487307 \
  --format json|table
```

| Flag | Obrigatório | Default | Descrição |
|------|-------------|---------|-----------|
| `--seeds` | Sim | — | Palavras-semente separadas por vírgula (ou `--seeds-file path.txt`, uma por linha) |
| `--geo` | Não | `BR` | País/região (geo target constant). BR = `2076` |
| `--lang` | Não | `pt` | Idioma (language constant). pt = `1014` |
| `--customer-id` | Não | default config | Conta usada para autenticar a chamada |
| `--login-customer-id` | Não | — | MCC, se a conta estiver sob um |
| `--format` | Não | `table` | `json` ou `table` |
| `--page-url` | Não | — | (opcional) URL de site para gerar ideias a partir da página |

## 4. Saída esperada (por keyword)

| Campo | Fonte na API |
|-------|--------------|
| `keyword` | `text` |
| `avg_monthly_searches` | `keyword_idea_metrics.avg_monthly_searches` |
| `competition` | `keyword_idea_metrics.competition` (LOW/MEDIUM/HIGH) |
| `competition_index` | `keyword_idea_metrics.competition_index` (0-100) |
| `low_top_of_page_bid_micros` | `keyword_idea_metrics.low_top_of_page_bid_micros` → dividir por 1.000.000 = R$ |
| `high_top_of_page_bid_micros` | `keyword_idea_metrics.high_top_of_page_bid_micros` → dividir por 1.000.000 = R$ |
| `monthly_search_volumes` | tendência mês a mês (opcional, últimos 12 meses) |

Ordenar tabela por `avg_monthly_searches` desc por padrão.

## 5. Notas técnicas para implementação

- **Boundary rule:** TODA chamada ao SDK `google-ads-api` passa por `src/google-ads-api/` (ver `client.ts` cabeçalho). Criar um módulo novo aqui, ex.: `keyword-ideas.ts`, que exporta a função de pesquisa. NÃO importar `google-ads-api` em outro lugar.
- O SDK `google-ads-api` expõe o serviço via `customer.keywordPlanIdeas.generateKeywordIdeas({...})` (confirmar nome exato do método na versão instalada).
- Request mínimo: `customer_id`, `language` (resource name `languageConstants/1014`), `geo_target_constants` (`["geoTargetConstants/2076"]`), `keyword_plan_network` (`GOOGLE_SEARCH` ou `GOOGLE_SEARCH_AND_PARTNERS`), e `keyword_seed.keywords` = lista de seeds.
- Reaproveitar o padrão de auth/config dos comandos existentes (`getCustomer` em `client.ts`, leitura de credenciais como em `report.ts`).
- Reaproveitar o renderer de tabela/JSON já usado em `report.ts` (REUSE > CREATE — ver ids-principles).
- Validar seeds (não vazias, máx. ~20 por chamada — limite da API) num `keyword-research-validator.ts`, seguindo o padrão dos outros validators.

## 6. Critérios de aceite (rascunho — @sm refina)

1. `google-ads keyword-research --seeds "x, y" --geo BR --lang pt` retorna tabela com volume, concorrência e faixa de CPC.
2. `--format json` retorna JSON estruturado consumível por relatório.
3. Micros convertidos para R$ na saída `table`.
4. Erro claro se seeds vazias, conta sem acesso, ou developer token sem permissão de Keyword Planner.
5. Testes unitários do parser de resposta + validator (mock do SDK, padrão dos `.test.ts` existentes).
6. `--login-customer-id` suportado para contas sob MCC.

## 7. Primeira pesquisa a rodar (assim que o comando existir)

**Conta:** Bento Ghostwriting (4507487307) · **Geo:** BR · **Lang:** pt

Seeds:
```
escrever livro com IA
escrever livro com inteligência artificial
criar livro com IA
fazer livro com IA
como escrever um livro com IA
IA para escrever livro
inteligência artificial para escrever livros
chatgpt para escrever livro
como usar chatgpt para escrever livro
escrever autobiografia com IA
escrever biografia com IA
transformar história em livro com IA
criar ebook com inteligência artificial
fazer ebook com IA
IA que escreve livro
programa para escrever livro com IA
```

> ⚠️ A API quase sempre devolve **ideias relacionadas** além das seeds — ótimo para descobrir termos que não pensamos (ex.: "ghostwriter IA", "escrever livro automático"). Vale capturar todas.
