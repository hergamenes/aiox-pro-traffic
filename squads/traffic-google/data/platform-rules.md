# Regras da Plataforma Google Ads

> Referência rápida das regras técnicas e políticas do Google Ads que o squad deve respeitar antes/durante publicação.

## Tipos de Campanha

| Tipo | Quando usar | Granularidade do `--level` na CLI |
|------|-------------|-------------------------------------|
| **Search** | Intenção alta (usuário pesquisando algo) | campaign / ad_group / ad / keyword |
| **Display** | Brand awareness, remarketing visual | campaign / ad_group / ad |
| **Performance Max** | E-commerce, multi-channel automatizado | campaign (asset_group é POST-MVP) |
| **YouTube (Video)** | Awareness, consideration via vídeo | campaign / ad_group / ad |
| **Shopping** | E-commerce com feed de produtos | campaign / ad_group |
| **Discovery / Demand Gen** | Conteúdo descoberta cross-surface | campaign / ad_group |
| **App** | Promoção de app | campaign (asset_group POST-MVP) |

## Hierarquia (parity com CLI `--level`)

```
Customer (10-digit account-id, formato 123-456-7890)
└── Campaign (objetivo + budget + estratégia de lance)
    └── Ad Group (público + bid + keywords[Search])
        ├── Ad (criativos: títulos, descrições, URLs)
        └── Keyword (Search only — palavras-chave)
```

**IMPORTANTE:** `ad_group` na Google Ads = `adset` na Meta Ads. CLI exige `--level ad_group`.

## Formatos de Anúncios (Display & Discovery)

| Tipo | Formato | Dimensões |
|------|---------|-----------|
| **Responsive Display Ad** | Imagens + headlines + descrições | 1.91:1 (1200×628) + 1:1 (1200×1200) + logos 4:1 (1200×300) e 1:1 (1200×1200) |
| **Vídeo (YouTube)** | mp4 | 16:9 (1920×1080), 1:1 (1080×1080), 9:16 (1080×1920) |
| **Asset (Performance Max)** | Mix de imagens + vídeos + texto + logo | Mesmas specs acima |

## Limites de Texto

| Elemento | Máximo de caracteres |
|----------|----------------------|
| **Responsive Search — Headline** | 30 (até 15 headlines por anúncio) |
| **Responsive Search — Description** | 90 (até 4 descriptions por anúncio) |
| **Responsive Display — Headline curto** | 30 |
| **Responsive Display — Headline longo** | 90 |
| **Responsive Display — Description** | 90 |
| **Display path1/path2** | 15 (cada) |

## Estratégias de Lance

| Estratégia | Uso |
|-----------|-----|
| **Maximize Conversions** | Sem CPA target — usa todo o budget |
| **Target CPA (tCPA)** | CPA específico |
| **Target ROAS (tROAS)** | ROAS específico (precisa de conversion_value) |
| **Maximize Conversion Value** | Sem ROAS target |
| **Manual CPC** | Lance manual (POST-MVP — não recomendado iniciar com isso) |
| **Enhanced CPC** | Manual com ajuste automático |

## Restrições Críticas

### 🚫 Manager Account (MCC) NÃO suporta métricas
- A CLI retorna `REQUESTED_METRICS_FOR_MANAGER` se você apontar para uma MCC
- Sempre rode `report` contra uma **conta cliente** (sub-conta da MCC)
- Use `google-ads accounts` para listar contas acessíveis e identificar quais são clientes vs manager

### 🚫 Developer Token em modo "Test access only"
- Contas novas de developer começam com test access (só funciona contra contas próprias/test)
- Para acessar contas de clientes externos: solicitar **Basic Access** ou **Standard Access** ao Google
- Não bloqueia o uso pessoal

### ⏱️ Janela de propagação
- Mudanças no Google Ads UI (criar campanha, pausar, alterar budget) levam **~30 min** para aparecer na API
- Não esperar dados imediatos após publicar — aguardar pelo menos 30 min antes do primeiro `report`

### 💰 Budget mínimo
- Não há mínimo absoluto, mas para Display/YouTube costuma exigir budget significativo para sair do "limited by budget"
- Recomendação: pelo menos R$ 30/dia para Search com 10+ keywords

## Conversão e Atribuição

| Aspecto | Padrão Google Ads |
|---------|-------------------|
| **Atribuição padrão** | Data-driven (cross-channel, machine learning) |
| **Janela de conversão** | 30 dias para clique, 1 dia para view (Display) |
| **Conversion value** | Necessário para `roas` aparecer no `report` |
| **Tag de conversão** | Configurar via Google Ads UI → Tools & Settings → Measurement → Conversions |

## Diferenças críticas vs Meta Ads

| Aspecto | Meta Ads | Google Ads |
|---------|----------|-----------|
| Hierarquia | Campaign → Ad Set → Ad | Campaign → Ad Group → Ad |
| Intenção do usuário | Push (algoritmo decide) | Pull (Search) + Push (Display/PMax) |
| Keywords | Não existem | Search-only (granularidade única na CLI) |
| Estratégias de lance | Bid cap, target cost | Maximize, Target CPA, Target ROAS |
| Token de auth | Expira em 60 dias | Refresh token longo prazo |
| Page (Facebook) | Obrigatório por campanha | Não existe conceito (campanhas vivem direto na conta) |

## Onde olhar quando algo der errado

- **Auth issues:** `google-ads auth status`
- **Conta errada:** `google-ads accounts` → confirme qual é cliente vs manager
- **Sem dados:** verifique janela de 30min após criação; confirme conversion tag está disparando
- **Quality Score baixo (Search):** Google Ads UI → Keywords → coluna Quality Score; CLI não expõe isso ainda
