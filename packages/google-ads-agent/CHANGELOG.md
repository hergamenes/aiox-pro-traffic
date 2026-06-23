# Changelog

All notable changes to `@aiox/google-ads-agent` are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.2] - 2026-06-23

### Security
- **IDs numéricos agora são validados antes de qualquer query GAQL** (#5).
  Novo módulo `id-validator` (`assertNumericId`/`assertCustomerId`) aplicado no
  chokepoint das funções de mutação, cobrindo `customer/campaign/criterion/ad-group id`.
  Barreira anti-injeção: IDs malformados são rejeitados com erro em pt-BR.
- **Escape de GAQL completo** em `checkCampaignNameExists`: agora escapa a barra
  invertida antes da aspa simples (`escapeGaqlString`), fechando o vetor de quebra
  de query via `--name` com caracteres especiais.

### Fixed
- **Orçamento rejeita `<= 0`** e passa a impor um teto de sanidade
  (`MAX_BUDGET_VALUE_UNITS`). Antes, `--daily 0` criava campanha inválida e não
  havia limite superior por valor unitário.
- **`update budget` agora respeita o controle de sessão anti-rombo** (consistente
  com `create`) e veta mutações no-op (novo valor igual ao atual).
- **`remove`: contagem de cascade real** em vez de `{0,0}` hardcoded; quando a
  contagem falha, o resultado é marcado como `uncertain` e logado, em vez de
  afirmar silenciosamente que nada seria removido em cascata.

### Tests
- +32 testes (id-validator, budget, escape GAQL, update session, cascade).

## [0.1.1] - 2026-06-23

### Fixed
- **`remove` mutations now pass the resource_name as a bare string** (#4).
  `removeKeyword`, `removeCampaign` and `removeAdGroup` were sending
  `{ resource_name }` objects where the Google Ads API expects a string for
  the `remove` operation. The object serialized to `"[object Object]"`,
  causing every removal to fail with `RESOURCE_NAME_MALFORMED`.
  `removeKeyword` was the reported bug; the other two were latent (same defect).

### Tests
- Added regression tests asserting `remove` operations carry a bare
  resource_name string (the prior mock returned `{}` without inspecting args,
  so it never caught the bug).
