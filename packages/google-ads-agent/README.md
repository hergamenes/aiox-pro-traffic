# @aiox/google-ads-agent

CLI agent for automating Google Ads campaign operations.

> Espelho da `meta-ads-agent` para Google Ads. Adapter port isola a SDK
> (`google-ads-api` da Opteo), credenciais ficam no macOS Keychain.

## Status

**Story 5.1 (this package's foundation):** Phase 1 MVP — `auth` subcommands only.
Stories 5.2 (`accounts` + `config set-default`) and 5.3 (`report`) follow.

## Pré-requisitos

| Item | Onde obter |
|------|-----------|
| Developer Token | https://developers.google.com/google-ads/api/docs/first-call/dev-token |
| OAuth Client ID + Secret | Google Cloud Console → APIs & Services → Credentials |
| Scope autorizado | `https://www.googleapis.com/auth/adwords` |
| Redirect URI no OAuth client | `http://localhost:8765/oauth/callback` (porta configurável via `GOOGLE_ADS_OAUTH_PORT`) |

## Quickstart

```bash
# 1. Build
npm install
npm run build

# 2. Autenticar (interativo OAuth)
node dist/bin/google-ads.js auth setup

# 3. Verificar
node dist/bin/google-ads.js auth status
```

## Comandos disponíveis (Story 5.1)

| Comando | Descrição |
|---------|-----------|
| `google-ads auth setup` | Fluxo OAuth interativo (URL → loopback → token) |
| `google-ads auth manual` | Fallback: cola refresh_token diretamente (quando OAuth loopback bloqueado) |
| `google-ads auth status` | Valida token chamando `listAccessibleCustomers` |

## Variáveis de ambiente

| Variável | Default | Função |
|----------|---------|--------|
| `GOOGLE_ADS_DEBUG` | (off) | Set para `1` ou `true` para ativar logs `debug` |
| `GOOGLE_ADS_OAUTH_PORT` | `8765` | Porta do loopback server durante `auth setup` |
| `NODE_ENV` | (varies) | `production` desativa pino-pretty |

## Onde as credenciais ficam

macOS Keychain — service name `google-ads-agent`. Inspecione via:

```bash
security find-generic-password -s google-ads-agent
```

6 chaves:
- `developer-token`
- `client-id`
- `client-secret`
- `refresh-token`
- `customer-id` (opcional — Story 5.2 popula via `config set-default`)
- `login-customer-id` (opcional — MCC)

## Boundary Rule (importante para contribuidores)

`src/google-ads-api/` é o **único** diretório autorizado a importar o pacote npm `google-ads-api`. Demais módulos consomem apenas as funções do adapter port.

Motivo: se a SDK upstream mudar, queremos uma única superfície de troca.

## Desenvolvimento

```bash
npm install
npm run dev          # watch mode
npm test             # unit tests
npm run test:coverage
npm run lint
```

## Próximas stories

- **5.2** — comando `accounts` + `config set-default`
- **5.3** — comando `report` (espelho do `meta-ads report --format json`)
- **Phase 2** (épico futuro) — `create`, `up`, `batch`, `upload`

## Licença

UNLICENSED (parity com `meta-ads-agent`).
