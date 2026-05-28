# NAMING/BRANDING EXTRACTION PROMPT

You are extracting brand naming patterns and case studies for a swipe file library.

## SOURCE MATERIAL
{{SOURCE_CONTENT}}

## WHAT MAKES A GREAT BRAND NAME
- Simplicity (works in conversation, WhatsApp, billboard)
- Memorability (sticks after one hearing)
- Meaning (suggests benefit or positioning)
- Differentiation (stands out from competitors)
- Scalability (allows expansion)

## 7 NAMING ARCHETYPES (Brazilian Market)

1. **O Brasileiro Raiz** - Cultural connection (Havaianas, QuintoAndar)
2. **O Simplificador Radical** - Removes complexity (Nubank, PicPay)
3. **O Aspiracional Internacional** - Premium perception (Arezzo, Stone)
4. **O Explicativo Literal** - Educates while naming (PagSeguro, Dr. Consulta)
5. **O Personificado Amigo** - Human connection (Zé Delivery, Magazine Luiza)
6. **A Promessa Definitiva** - Final solution (Emagrecer de Vez)
7. **O Número Mágico** - Specific timeframe (99, Desafio 19 Dias)

## EXTRACTION RULES

1. For each brand name, capture:
   - Name and company
   - Category/industry
   - Valuation/revenue if known
   - Psychology behind the name
   - ICP (Ideal Customer Profile)
   - Why it works
   - Naming archetype
   - Lessons/patterns

2. YAML OUTPUT FORMAT:
```yaml
- id: "nm_{{SLUG}}_001"
  name: "Nubank"
  company: "Nu Pagamentos S.A."
  category: "fintech"
  numbers:
    valuation: "R$ 250 bilhões"
    customers: "90+ milhões"
  etymology:
    components: ["Nu (novo, despido)", "Bank"]
    meaning: "Banco despido de complexidade"
  psychology:
    primary: "Simplicidade radical"
    secondary: ["Transparência", "Modernidade"]
    brazilian_insight: "'Nu' sugere transparência em país traumatizado por taxas escondidas"
  icp:
    original: "Millennials com cartão negado"
    current: "Qualquer brasileiro"
  archetype: "simplificador_radical"
  visual_identity:
    color: "Roxo"
    differentiation: "Único roxo em setor de azul/amarelo"
  why_it_works:
    - "Nome curto, fácil de falar"
    - "Sugere despir o desnecessário"
    - "Internacional mas pronunciável"
  lessons:
    - "Simplicidade extrema em mercado complexo = dominância"
  score: 5
  tags: ["fintech", "unicornio", "simplificador", "brasil"]
```

## NAMING FORMULAS TO EXTRACT

- **Fintech:** [Ação] + Seguro, [Cor] + [Tech], Banco [Adjetivo]
- **E-commerce:** [Categoria] + [Channel], Mercado [Adjetivo], Verbo Coloquial
- **Educação:** Des[problema], [Resultado] + [Tempo], Método [Nome]
- **Saúde:** Dr. [Serviço], [Ação] + Saúde
- **Delivery:** Número Fácil, Nome Pessoa, [Velocidade] + [Categoria]
- **Infoproduto:** Fórmula [X], Método [Nome], [Número] Dias

## MAGIC WORDS (High Conversion in Brazil)

Aumentam conversão: "Método", "Fórmula", "Definitivo", "Completo", "Garantido", "Aprovado", "Revelado", "Grátis"
Criam confiança: "Seguro", "Original", "Brasileiro", "Natural", "Dr./Dra."
Geram urgência: "Últimas", "Hoje", "Agora", "Limitado"

## OUTPUT
Extract ALL qualifying brand names with full analysis. Output ONLY valid YAML array.
