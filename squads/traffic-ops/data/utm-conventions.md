# Convenções de UTM — Padrão de Rastreamento

## Estrutura UTM

```
https://seusite.com/pagina?utm_source=FONTE&utm_medium=TIPO&utm_campaign=CAMPANHA&utm_content=VARIACAO
```

---

## Parâmetros

### utm_source (Obrigatório)
De onde vem o tráfego.

| Valor | Quando Usar |
|-------|------------|
| `facebook` | Anúncios no Facebook |
| `instagram` | Anúncios no Instagram |
| `meta` | Quando não diferencia FB/IG (Advantage+) |
| `google` | Google Ads (Search, Display, YouTube) |
| `tiktok` | TikTok Ads |
| `email` | Campanhas de e-mail |
| `organic` | Tráfego orgânico rastreado |

### utm_medium (Obrigatório)
Tipo de mídia/canal.

| Valor | Quando Usar |
|-------|------------|
| `cpc` | Anúncios pagos com custo por clique |
| `cpm` | Anúncios pagos com custo por mil |
| `social` | Social media orgânico |
| `email` | E-mail marketing |
| `display` | Banners display |
| `video` | Anúncios em vídeo |
| `remarketing` | Campanhas de remarketing |

### utm_campaign (Obrigatório)
Nome identificador da campanha.

**Formato:** `[objetivo]-[produto/oferta]-[data]`

| Exemplo | Descrição |
|---------|-----------|
| `vendas-curso-python-mar26` | Venda do curso Python, março 2026 |
| `leads-ebook-marketing-fev26` | Captação de leads, ebook marketing |
| `remarketing-carrinho-abandonado` | Remarketing de carrinho |
| `awareness-marca-lancamento` | Reconhecimento de marca |

### utm_content (Recomendado)
Diferencia variações de anúncio (para teste A/B).

**Formato:** `[tipo-criativo]-[variacao]`

| Exemplo | Descrição |
|---------|-----------|
| `video-depoimento-v1` | Vídeo de depoimento, versão 1 |
| `imagem-oferta-v2` | Imagem com oferta, versão 2 |
| `carrossel-beneficios` | Carrossel de benefícios |
| `stories-urgencia` | Stories com gatilho de urgência |

### utm_term (Opcional)
Usado principalmente em Google Ads para identificar a palavra-chave.

| Exemplo | Descrição |
|---------|-----------|
| `curso+python+online` | Palavra-chave comprada |
| `melhor+crm` | Termo de busca |

---

## Regras

1. **Sempre minúsculo** — Nunca use maiúsculas (evita duplicação no analytics)
2. **Sem espaços** — Use `-` (hífen) para separar palavras
3. **Sem acentos** — Use versão sem acento (ex: `vendas` não `vendás`)
4. **Sem caracteres especiais** — Apenas letras, números e hífens
5. **Consistente** — Use os mesmos valores sempre (não alterne entre `facebook` e `fb`)
6. **Obrigatórios** — source, medium e campaign SEMPRE preenchidos
7. **Content por variação** — Cada anúncio diferente deve ter utm_content diferente

---

## Exemplo Completo

```
https://meusite.com/curso-python?utm_source=facebook&utm_medium=cpc&utm_campaign=vendas-curso-python-mar26&utm_content=video-depoimento-v1
```

## Ferramenta de Geração

Use o Google Campaign URL Builder ou gere manualmente seguindo o padrão acima.
