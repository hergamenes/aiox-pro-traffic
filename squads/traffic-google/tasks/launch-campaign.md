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
- **Plataforma alvo** (Google Ads, Google Ads, ambas)
- **CLI google-ads autenticada** (`google-ads auth status` = OK)

## Veto Conditions
NÃO executar (ou bloquear avanço) se:
- ❌ Briefing sem objetivo claro (Vendas/Leads/Tráfego/Reconhecimento)
- ❌ Orçamento ausente ou impreciso
- ❌ Criativos não disponíveis no formato exigido pela plataforma
- ❌ Links sem definição de UTM e o cliente exige rastreio
- ❌ Checklist `pre-launch.md` com qualquer item FAIL
- ❌ `google-ads auth status` retornar expirado/não-configurado (para plataforma Google Ads)

## Fluxo

### Step 0: Pré-validação Real-Time (Google Ads)
Antes do briefing, confirmar infraestrutura via CLI:

```bash
node packages/google-ads-agent/dist/bin/google-ads.js auth status
node packages/google-ads-agent/dist/bin/google-ads.js accounts
node packages/google-ads-agent/dist/bin/google-ads.js pages
```

- Se auth expirado → BLOQUEAR e guiar usuário para `google-ads auth setup`
- Se conta padrão não definida → BLOQUEAR e guiar para `google-ads config set-default`
- Mostrar ao usuário as contas e páginas disponíveis para escolha consciente

### Step 1: Briefing
Coletar informações essenciais da campanha:

1. **Objetivo:** Qual o objetivo? (Vendas, Leads, Tráfego, Reconhecimento)
2. **Plataforma:** Onde será veiculada? (Google Ads, Google Ads, ambos)
3. **Público-alvo:** Quem é o público? (idade, gênero, interesses, localização)
4. **Orçamento:** Quanto será investido? (diário ou total, período)
5. **Criativos:** Quais peças serão usadas? (imagens, vídeos, copies)
6. **Links:** Para onde o tráfego será direcionado? (landing page, WhatsApp, site)
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
node packages/google-ads-agent/dist/bin/google-ads.js creatives {path-dos-criativos}
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
- **Próximo agente:** Campaign Publisher (`*publish-sales` ou `*publish-leads`)
- **Artefato passado:** `campaign-plan.md` aprovado pelo Launcher
