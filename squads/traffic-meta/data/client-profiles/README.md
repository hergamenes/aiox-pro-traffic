# Client Profiles — Convenção por Projeto

> **Regra inegociável (isolamento por construção):** nenhum dado de cliente real pode residir dentro de `squads/`. Os squads são copiados entre projetos de clientes diferentes — um perfil real aqui vazaria dados de um cliente para outro.

## Onde vivem os perfis de cliente

Os perfis de cliente (a "régua" de KPIs que classifica cada métrica 🟢/🟡/🔴) vivem **no projeto de cada cliente**, não no squad:

```
reports/{cliente-plataforma-id}/client-profile.md
```

**Exemplos (placeholders):**
- `reports/{cliente}-meta-{accountId}/client-profile.md`

O sufixo de plataforma (`-meta`, `-google`) e o `accountId` são **obrigatórios** quando o mesmo cliente roda em mais de uma plataforma — os dados de conta são diferentes e não podem se misturar.

## O que fica aqui (no squad)

| Arquivo | Papel |
|---------|-------|
| `_TEMPLATE.md` | **Único** arquivo permitido aqui. Modelo genérico (só `{{placeholders}}`) para gerar novos perfis. |
| `README.md` | Este arquivo (documenta a convenção). |

## Como criar um perfil novo

1. Copie `_TEMPLATE.md` para `reports/{cliente-plataforma-id}/client-profile.md` no projeto do cliente.
2. Preencha os `{{placeholders}}` com os dados reais da conta.
3. **Nunca** salve o perfil preenchido de volta dentro de `squads/`.

## Como o agente resolve o perfil

A task `generate-report.md` busca `reports/{cliente-plataforma-id}/client-profile.md` (o `{cliente-plataforma-id}` vem do contexto de ativação do agente). Se o perfil não existir, usa `_TEMPLATE.md` como ponto de partida.

---
*Convenção formalizada na Story 8.3 (Epic 8 — Traffic Kit Export).*
