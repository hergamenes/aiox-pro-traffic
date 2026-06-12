# Task: Launch Campaign

## Metadata
- **Agent:** Campaign Launcher
- **Tipo:** Workflow interativo (PRIMEIRO no fluxo da squad)
- **Elicit:** true
- **Modo:** Read-only (NÃO executa publicação)

## Objetivo
Validar (read-only) o briefing, a infraestrutura CLI e o plano de campanha ANTES de qualquer execução. O Launcher é o primeiro agente da squad e produz um **plano validado** que será consumido pelo Campaign Publisher (que executa autonomamente via CLI).

## Inputs
- **Briefing do cliente/gestor** (objetivo, público, budget, prazo)
- **Criativos** (caminhos para imagens, vídeos, copies — referenciados por ID/nome de asset já existente)
- **Links de destino** (landing pages, formulários, WhatsApp)
- **Regras de UTM** do cliente (se houver convenção específica)
- **Plataforma alvo** (Google Ads)
- **CLI google-ads autenticada** (`google-ads auth status` = OK)

## Veto Conditions
NÃO aprovar o plano (bloquear avanço para o Publisher) se:
- Briefing sem objetivo claro (Vendas/Leads/Tráfego/Reconhecimento)
- Orçamento ausente ou impreciso
- Criativos referenciados não encontrados em `google-ads list-assets`
- Links sem definição de UTM e o cliente exige rastreio
- Checklist `pre-launch.md` com qualquer item FAIL
- `google-ads auth status` retornar expirado/não-configurado
- Conta padrão não configurada (`google-ads config get-default` vazio)

## Fluxo

### Step 0: Pré-validação Real-Time (read-only)
Antes do briefing, confirmar infraestrutura via CLI (somente leitura):

```bash
# Autenticação
google-ads auth status

# Conta padrão configurada
google-ads config get-default

# Árvore de contas MCC (Story 5.4)
google-ads accounts --tree

# Baseline de performance dos últimos 7 dias
google-ads report --period 7d --level campaign --format json
```

- Se `auth status` expirado → BLOQUEAR e guiar para `google-ads auth setup`
- Se `config get-default` vazio → BLOQUEAR e guiar para `google-ads config set-default`
- Mostrar ao usuário a árvore de contas (MCC → clientes) para escolha consciente
- Registrar baseline de performance (CTR/CPA/ROAS médios) para comparação posterior

### Step 1: Briefing
Coletar informações essenciais da campanha:

1. **Objetivo:** Qual o objetivo? (Vendas, Leads, Tráfego, Reconhecimento)
2. **Plataforma:** Onde será veiculada? (Google Ads)
3. **Público-alvo:** Quem é o público? (idade, gênero, interesses, localização)
4. **Orçamento:** Quanto será investido? (diário ou total, período)
5. **Criativos:** Quais assets serão usados? (IDs/nomes já presentes na conta)
6. **Links:** Para onde o tráfego será direcionado? (landing page, WhatsApp, site)
7. **Prazo:** Quando começa e quando termina?

### Step 2: Estruturação (somente em arquivo, sem publicar)
Com base no briefing, montar a estrutura no plano:

- **Campanha:** Nome seguindo convenção, objetivo configurado
- **Grupos de anúncios:** Segmentação, orçamento, posicionamento
- **Anúncios:** Criativos vinculados, copies, CTAs, links com UTM

### Step 3: Validação de Assets (read-only via CLI — Story 6.6)
Verificar se todos os assets referenciados no briefing existem na conta:

```bash
# Listar todos os assets disponíveis
google-ads list-assets --type ALL

# Ou filtrar por tipo específico
google-ads list-assets --type IMAGE
google-ads list-assets --type VIDEO
google-ads list-assets --type TEXT
```

Para cada asset referenciado no plano:
- Confirmar que aparece na listagem (por ID ou nome)
- Se algum asset estiver ausente → BLOQUEAR e solicitar upload prévio

### Step 4: Validação do Plano
Checklist obrigatório:

- [ ] UTMs corretos em todos os links (source, medium, campaign, content)
- [ ] Segmentação coerente com o objetivo
- [ ] Assets referenciados encontrados via `list-assets`
- [ ] Orçamento distribuído de forma lógica
- [ ] Naming convention seguida
- [ ] Políticas da plataforma respeitadas

### Step 5: Checklist Pré-Launch
Executar `checklists/pre-launch.md` completo.

- Se 100% PASS → Gerar plano validado
- Se qualquer FAIL → Listar correções e BLOQUEAR

### Step 6: Plano Validado
Gerar `campaign-plan.md` usando template `templates/campaign-brief.md` com toda a estrutura aprovada, marcado como **VALIDATED** e pronto para o Publisher consumir.

## Output
- `campaign-plan.md` (status: VALIDATED) — plano completo e validado
- Relatório de validação (Steps 3–5)
- Checklist `pre-launch.md` preenchido (100% PASS)
- Baseline de performance (`report --period 7d`) registrado para comparação pós-launch

## Output Example

```markdown
# Campaign Plan — STATUS: VALIDATED ✅
**Conta:** Grupo Prestarh (9631900143) · **Objetivo:** Leads · **Tipo:** Search

## Estrutura
- Campanha: SOL_LEADS_GRUPOPRESTARH_SERVIÇOS · budget R$ 30/dia · tCPA R$ 12
- Ad Group "Consultoria de RH": keywords [consultoria de rh para empresas (PHRASE),
  consultoria em gestão de pessoas (PHRASE)]
- RSA: 5 headlines / 4 descriptions · URL final com utm_source=google&utm_medium=cpc

## Validação
| Item | Status |
|------|--------|
| auth status / config get-default | ✅ OK |
| Assets via list-assets | ✅ encontrados |
| UTMs (source/medium/campaign/content) | ✅ |
| pre-launch.md (27 itens) | ✅ 100% PASS |

**Baseline 7d:** CTR 9,7% · CPC R$ 2,52 · CPA R$ 10,60 (registrado p/ comparação)
→ Pronto para handoff ao Campaign Publisher (`*publish`).
```

## Acceptance Criteria
- [ ] `auth status`, `config get-default` e `accounts --tree` executados e OK
- [ ] Briefing capturado nos 7 campos (Step 1)
- [ ] Estrutura montada com campanha + grupos de anúncios + anúncios
- [ ] Assets referenciados confirmados via `list-assets` (Step 3)
- [ ] Todos os 6 itens da seção "Validação do Plano" (Step 4) marcados como PASS
- [ ] Checklist `pre-launch.md` com 100% PASS
- [ ] Arquivo `campaign-plan.md` gerado a partir do template `campaign-brief.md` com status VALIDATED
- [ ] UTMs verificados (source/medium/campaign/content) em todos os links
- [ ] Baseline de métricas dos últimos 7 dias salvo junto ao plano

## Handoff
- **Modo:** Launcher é **read-only** — NÃO executa publicação.
- **Próximo agente:** Campaign Publisher (`*publish`)
- **Artefato passado:** `campaign-plan.md` com status `VALIDATED` + baseline de performance
- **Contrato:** O Publisher confiará que o plano está validado e executará autonomamente via CLI (sem UI). Qualquer dúvida sobre estrutura, assets ou autenticação deve ser resolvida pelo Launcher ANTES do handoff — não pelo Publisher durante a execução.
