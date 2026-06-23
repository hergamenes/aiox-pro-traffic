# Changelog

All notable changes to `@aiox/meta-ads-agent` are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.1] - 2026-06-23

### Security
- **`access_token` movido da query string para o header `Authorization: Bearer`** (#5).
  Novo helper `authFetch` aplicado em todas as chamadas GET/DELETE do `adapter` e
  no `waitForVideoReady` do `uploader`. Evita o vazamento do token em logs de erro
  (a redaction do pino não cobre URLs). O upload em si já enviava o token no corpo
  (FormData) e permanece como estava.

### Fixed
- **Validação de `--delay` no `batch`**: um valor inválido virava `NaN` e desligava
  silenciosamente a pausa anti rate-limit entre campanhas; agora cai no default
  com aviso.
- **Guard de resposta de upload vazia**: quando a API Meta retorna `images: {}`,
  lança um `UploadError` claro em pt-BR em vez de um `TypeError` genérico.

### Changed
- Removidas ~150 linhas duplicadas em `create.ts`, reusando os helpers já
  existentes (`buildProgressCallbacks`, `printResult`) nas estratégias
  sales/leads/whatsapp. Comportamento inalterado.

### Tests
- +8 testes (token no header, guard de upload vazio, validação de delay).
