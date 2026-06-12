# traffic-shared

Biblioteca de **conteúdo compartilhado** entre os squads `traffic-meta` e `traffic-google`.

## Propósito

Os squads de tráfego pago (Meta Ads e Google Ads) são deliberadamente **separados**: cada um tem
seus próprios agentes, tasks, CLIs e regras específicas de plataforma. Porém uma parte do conteúdo
é **100% comum** às duas plataformas — convenções universais que não mudam entre Meta e Google.

Este squad existe para abrigar esse conteúdo em **uma única fonte de verdade**, de modo que uma
correção ou melhoria seja feita em um único lugar e os dois squads nunca divirjam silenciosamente.

## O que NÃO é

- **Não é um squad com agentes.** Não há `agents/`, `tasks/`, `workflows/` nem `slashPrefix`.
- **Não unifica os squads de tráfego.** `traffic-meta` e `traffic-google` continuam separados e
  completos; apenas o conteúdo duplicado idêntico foi extraído para cá.

## Conteúdo

```
traffic-shared/
├── config.yaml
├── README.md
└── data/
    ├── action-prioritization.md   ← framework universal de priorização de ações de otimização
    └── utm-conventions.md         ← convenções de rastreamento UTM (multi-plataforma)
```

> Arquivos com **diferenças substantivas de plataforma** (terminologia Conjunto/Grupo de Anúncios,
> formatos de criativo, Pixel, Impression Share, WhatsApp/MCC etc.) **permanecem em cada squad** —
> não foram movidos para cá. Ver Story 8.2 para a classificação completa.

## Como é referenciado

Agentes, tasks e workflows dos squads `traffic-meta` e `traffic-google` referenciam estes arquivos
pelo path `../traffic-shared/data/{arquivo}.md` (relativo à raiz do respectivo squad).
