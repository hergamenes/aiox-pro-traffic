---
task: Load Workspace Context
responsável: @copy-chief
responsavel_type: Agente
atomic_layer: Config
Entrada: |
  - business_slug: slug do business alvo em workspace/businesses/{slug}/
  - product_slug: slug opcional do produto em L3-product/{product_slug}/
  - deliverable_type: sales-page | email-sequence | ad-copy | webinar | offer | outro
  - briefing: contexto do job e objetivo comercial
Saída: |
  - workspace_context_brief: resumo YAML com brand, offer, movement, sales-process e templates relevantes
  - blockers: lista de gaps reais de contexto que impedem copy de alta fidelidade
Checklist:
  - [ ] Validou se o business existe em workspace/businesses/{slug}/
  - [ ] Carregou offerbook estratégico ou offerbook do produto
  - [ ] Carregou assets de brand do business
  - [ ] Carregou assets de movement quando relevantes para a mensagem
  - [ ] Carregou sales-process do produto quando o deliverable depende de funil
  - [ ] Registrou assumptions e blockers sem inventar artefatos
Domain: Operational
pre_condition: |
  - briefing, oferta, canal e contexto mínimo carregados
  - restrições e assets necessários confirmados antes da execução
post_condition: |
  - entregável principal registrado com critérios de revisão e próximo passo explícito
  - handoff, bloqueio ou decisão comercial documentados quando aplicável
performance: |
  - sla_target: "PT24H"
  - error_handling: "registrar bloqueio, atualizar handoff e escalar para @copy-chief"
---

# Load Workspace Context

Task para carregar o contexto operacional real do `workspace` antes de executar qualquer task de copy.

---

## Objetivo

Garantir que o squad de copy use artefatos reais do business, do produto e da
campanha antes de escrever qualquer peça, respeitando a arquitetura atual do
workspace (`businesses/{slug}/L0-L4`) e o contract canônico de campanhas em
`workspace/businesses/{slug}/L4-operational/campaigns/{campaign_slug}/` (ADR-012).

---

## Fase 1: Snapshot de Governança

1. Ler `squads/copy/data/copy-governance.yaml`.
2. Ler `squads/copy/data/copy-information-architecture.yaml`.
3. Extrair:
   - regras de promoção `DRAFT` vs `FINAL`
   - source of truth por layer
   - critérios de revisão aplicáveis ao deliverable
   - path de planning (`workspace/.../L4-operational/campaigns/{campaign_slug}`) e de delivery (`outputs/copy/...`)
4. Registrar em `governance_constraints`.

---

## Fase 2: Seleção do Contexto Base

1. Validar `business_slug` em `workspace/businesses/{business_slug}/`.
2. Se `product_slug` existir, validar em `workspace/businesses/{business_slug}/L3-product/{product_slug}/`.
3. Registrar:
   - business selecionado
   - produto selecionado
   - tipo de deliverable
   - objetivo comercial do job
   - `campaign_slug` quando o trabalho for estratégico, multi-asset, high-ticket ou FINAL

---

## Fase 3: Snapshot de Brand Truth

1. Ler `workspace/businesses/{business_slug}/L1-strategy/icp.yaml` quando existir.
2. Ler `workspace/businesses/{business_slug}/L1-strategy/offerbook.yaml` como índice/shared offer truth.
3. Ler assets disponíveis em `workspace/businesses/{business_slug}/L2-tactical/brand/`.
4. Quando a peça depender de narrativa identitária, ler também `workspace/businesses/{business_slug}/L2-tactical/movement/`.
5. Usar `workspace/_templates/business-template/L1-strategy/` e `workspace/_templates/business-template/L2-tactical/` apenas como fallback estrutural.
6. Registrar:
   - posicionamento
   - linguagem de marca
   - ICP, dores e desejos
   - narrativa central
   - sinais de movimento/comunidade relevantes

---

## Fase 4: Snapshot de Product Truth

1. Se houver `product_slug`, priorizar:
   - `workspace/businesses/{business_slug}/L3-product/{product_slug}/offerbook.yaml`
   - `workspace/businesses/{business_slug}/L3-product/{product_slug}/proof.yaml`
   - `workspace/businesses/{business_slug}/L3-product/{product_slug}/testimonials.yaml`
   - `workspace/businesses/{business_slug}/L3-product/{product_slug}/curriculum.yaml` quando existir
   - `workspace/businesses/{business_slug}/L3-product/{product_slug}/narrative/*`
2. Se houver `sales-process.yaml`, carregar; se não houver, marcar como lacuna sem inventar funil.
3. Registrar:
   - oferta principal
   - prova disponível
   - objeções destruídas por narrativa/prova
   - trigger comercial
   - etapas do funil que impactam copy
   - pontos de handoff entre brand, oferta e vendas

---

## Fase 5: Snapshot de Campaign Truth

1. Se `campaign_slug` existir, carregar (ADR-012 Layout C — híbrido):
   - `workspace/businesses/{business_slug}/L4-operational/campaigns/{campaign_slug}/campaign-brief.yaml` (raiz cross-squad)
   - `workspace/businesses/{business_slug}/L4-operational/campaigns/{campaign_slug}/message-architecture.yaml` (raiz cross-squad)
   - `workspace/businesses/{business_slug}/L4-operational/campaigns/{campaign_slug}/copy/creative-brief.yaml` (copy subdir)
   - `workspace/businesses/{business_slug}/L4-operational/campaigns/{campaign_slug}/copy/assets/*.yaml` (copy subdir)
2. Se `campaign_slug` não existir:
   - marcar `campaign_context.status: implicit_draft_only`
   - impedir promoção para `FINAL`
3. Registrar:
   - escopo da campanha
   - promessa/mecanismo da campanha
   - assets requeridos
   - regras de promoção para FINAL

---

## Fase 6: Snapshot de Templates

1. Ler os templates canônicos relevantes em `workspace/_templates/business-template/`.
2. Ler os templates do squad quando houver campanha:
   - `squads/copy/templates/campaign-brief-template.md`
   - `squads/copy/templates/message-architecture-template.md`
   - `squads/copy/templates/creative-brief-template.md`
   - `squads/copy/templates/asset-brief-template.md`
3. Mapear quais campos do template estão cobertos pelos artefatos reais do business/produto/campanha.
4. Para cada template usado, registrar:
   - campos obrigatórios
   - campos opcionais
   - lacunas de input do usuário

---

## Output Contract

Salvar arquivo `outputs/workspace-context/campaign-context-brief.yaml` com:

```yaml
campaign_context_brief:
  generated_at: "YYYY-MM-DDTHH:mm:ssZ"
  request_type: "<sales-page|email-sequence|ad-copy|...>"
  business_slug: ""
  product_slug: ""
  campaign_slug: ""
  governance_constraints:
    final_allowed: false
    source_of_truth:
      - "L1-strategy"
      - "L2-tactical/brand"
      - "L3-product"
      - "copy/{campaign_slug}"
      - "outputs/copy/{business}"
    review_gates: []
  brand_truth:
    available_files: []
    missing_files: []
  product_truth:
    available_files: []
    missing_files: []
  campaign_context:
    status: "ready|missing|implicit_draft_only"
    available_files: []
    missing_files: []
  sales_process_context:
    has_sales_process: false
    source_path: ""
    trigger: ""
    key_steps: []
    handoff_points: []
  templates_loaded:
    - path: ""
      required_fields: []
      missing_inputs: []
  assumptions: []
  blockers: []
```

---

## Quality Checklist

- [ ] Leu `copy-governance.yaml` e `copy-information-architecture.yaml`.
- [ ] Validou o business e o produto alvo.
- [ ] Leu pelo menos 1 offerbook real do workspace.
- [ ] Mapeou brand, product e campaign truth sem inventar estrutura paralela.
- [ ] Mapeou sales-process quando a peça depende de funil.
- [ ] Carregou pelo menos 1 template de `business-template` ou de campaign planning.
- [ ] Registrou `assumptions` e `blockers` no output final.

---

## Fallback

Se algum arquivo obrigatório do workspace não existir:

1. Reportar exatamente o caminho faltante.
2. Não inventar schema/campos.
3. Se faltar `campaign_slug` ou `campaign-brief.yaml` em trabalho estratégico, marcar `implicit_draft_only`.
4. Pedir insumo mínimo faltante antes de continuar execução de copy.
