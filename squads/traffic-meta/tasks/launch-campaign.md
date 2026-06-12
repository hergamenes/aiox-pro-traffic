# Task: Launch Campaign

## Metadata
- **Agent:** Campaign Launcher
- **Tipo:** Workflow interativo
- **Elicit:** true

## Objetivo
Guiar o usuário através do processo completo de estruturação e validação de uma campanha antes da publicação.

## Inputs
- **Briefing do cliente/gestor** (objetivo, público, budget, prazo)
- **Criativos** (caminhos para imagens, vídeos, copies)
- **Links de destino** (landing pages, formulários, WhatsApp)
- **Regras de UTM** do cliente (se houver convenção específica)
- **Plataforma alvo** (Meta Ads, Google Ads, ambas)
- **CLI meta-ads autenticada** (`meta-ads auth status` = OK)

## Veto Conditions
NÃO executar (ou bloquear avanço) se:
- ❌ Briefing sem objetivo claro (um dos 8: Vendas, Leads, Reconhecimento, Tráfego, Engajamento, WhatsApp/Click-to-WhatsApp, Lead Ads, Promoção de App)
- ❌ Orçamento ausente ou impreciso
- ❌ Criativos não disponíveis no formato exigido pela plataforma
- ❌ Links sem definição de UTM e o cliente exige rastreio
- ❌ Checklist `pre-launch.md` com qualquer item FAIL
- ❌ `meta-ads auth status` retornar expirado/não-configurado (para plataforma Meta Ads)

## Fluxo

### Step 0: Pré-validação Real-Time (Meta Ads)
Antes do briefing, confirmar infraestrutura via CLI:

```bash
meta-ads auth status
meta-ads accounts
meta-ads pages
```

- Se auth expirado → BLOQUEAR e guiar usuário para `meta-ads auth setup`
- Se conta padrão não definida → BLOQUEAR e guiar para `meta-ads config set-default`
- Mostrar ao usuário as contas e páginas disponíveis para escolha consciente

### Step 1: Briefing
Coletar informações essenciais da campanha:

1. **Objetivo:** Qual dos 8? (sales, leads, awareness, traffic, engagement, whatsapp, leadform, app)
2. **Plataforma/placement:** Onde veicular? Meta Ads/Google. Em Meta, placement: automático (padrão), só Instagram ou só Facebook (`--plataforma`)
3. **Público-alvo:** Quem é o público? (idade, gênero, interesses, localização)
4. **Orçamento:** Quanto será investido? (diário ou total, período)
5. **Criativos:** Quais peças serão usadas? (imagens, vídeos, copies)
6. **Destino (depende do objetivo):** site/LP (sales/leads/awareness/traffic/engagement), número de WhatsApp (whatsapp), política de privacidade (leadform), app-id+loja (app)
7. **Prazo:** Quando começa e quando termina?

### Step 2: Estruturação
Com base no briefing, montar:

- **Campanha:** Nome seguindo convenção, objetivo configurado
- **Conjuntos de anúncios:** Segmentação, orçamento, posicionamento
- **Anúncios:** Criativos vinculados, copies, CTAs, links com UTM

### Step 3: Validação
Executar validações obrigatórias:

- [ ] UTMs corretos em todos os links (source, medium, campaign, content)
- [ ] Segmentação coerente com o objetivo
- [ ] Criativos nos formatos corretos da plataforma
- [ ] Orçamento distribuído de forma lógica
- [ ] Naming convention seguida
- [ ] Políticas da plataforma respeitadas

**Validação de criativos via CLI** (quando criativos disponíveis):
```bash
meta-ads creatives {path-dos-criativos}
```
Se retornar erros → corrigir antes de prosseguir.

### Step 4: Checklist Pré-Launch
Executar `checklists/pre-launch.md` completo.

- Se 100% PASS → Gerar plano final
- Se qualquer FAIL → Listar correções e BLOQUEAR

### Step 5: Plano Final
Gerar documento `campaign-plan.md` usando template `templates/campaign-brief.md` com toda a estrutura aprovada.

## Output
- Plano de campanha completo e validado
- Relatório de validação
- Checklist pré-lançamento preenchido

## Acceptance Criteria
- [ ] Briefing capturado nos 7 campos (Step 1)
- [ ] Estrutura montada com campanha + conjuntos + anúncios
- [ ] Todos os 6 itens da seção "Validação" (Step 3) marcados como PASS
- [ ] Checklist `pre-launch.md` com 100% PASS
- [ ] Arquivo `campaign-plan.md` gerado a partir do template `campaign-brief.md`
- [ ] UTMs verificados (source/medium/campaign/content) em todos os links

## Handoff
- **Próximo agente:** Campaign Publisher (`*publish {tipo}` — ex.: `*publish-sales`, `*publish-leads`, `*publish-whatsapp`, ou `*publish {awareness|traffic|engagement|leadform|app}`)
- **Artefato passado:** `campaign-plan.md` aprovado pelo Launcher (incluindo objetivo, placement e destino específico)
