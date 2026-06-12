# Traffic Kit — Guia de Instalação e Uso

Este guia explica como levar o **Traffic Kit** (os squads de gestão de tráfego pago)
para qualquer projeto novo de cliente, em poucos minutos e com um único comando.

> Linguagem direta, passo a passo. Você não precisa saber programar para usar.

---

## 1. O que é o Traffic Kit

O Traffic Kit é o conjunto de ferramentas que você usa para gerir campanhas de
tráfego (Meta Ads e Google Ads) dentro do AIOX. Ele tem três partes:

| Componente | O que faz |
|------------|-----------|
| **squad `traffic-meta`** | Agentes e tasks para campanhas no Meta (Facebook/Instagram): lançar, publicar, analisar e otimizar. |
| **squad `traffic-google`** | O mesmo, para o Google Ads (Search, etc.). |
| **squad `traffic-shared`** | Conhecimento comum aos dois: priorização de ações, convenções de UTM. |
| **CLIs `meta-ads` e `google-ads`** | Os programas de linha de comando que falam com as APIs do Meta e do Google. Ficam instalados no seu computador (PATH global). |
| **Shims `.claude/commands/trafficMeta` e `trafficGoogle`** | Atalhos que ativam os agentes do squad dentro do Claude Code. |

**Importante:** os squads são "limpos" — não trazem nenhum dado de cliente real.
Cada projeto cria seu próprio `client-profile` (veja a seção 5).

---

## 2. Instalação em projeto novo (1 comando)

Pré-requisito: a pasta do projeto de destino já deve existir.

```bash
bash /Users/hergamenessouza/aiox-pro-traffic/scripts/install-traffic-kit.sh /caminho/do/projeto-novo
```

Exemplo real:

```bash
mkdir -p ~/projetos/cliente-novo
bash /Users/hergamenessouza/aiox-pro-traffic/scripts/install-traffic-kit.sh ~/projetos/cliente-novo
```

O que o comando faz, em ordem:

1. Copia `squads/traffic-shared`, `squads/traffic-meta`, `squads/traffic-google`.
2. Copia os shims `.claude/commands/trafficMeta` e `.claude/commands/trafficGoogle`.
3. Cria a pasta `reports/` **vazia** (nunca copia relatórios de outros clientes).
4. Verifica se `meta-ads` e `google-ads` estão instalados; se não, oferece instalar.
5. Configura as permissões de **leitura** dos CLIs no `.claude/settings.local.json`.

### Modo automático (sem perguntas)

Se quiser que ele instale os CLIs ausentes sem perguntar, adicione `--yes`:

```bash
bash /Users/hergamenessouza/aiox-pro-traffic/scripts/install-traffic-kit.sh ~/projetos/cliente-novo --yes
```

> Rodar o comando duas vezes no mesmo destino é seguro: ele **não duplica** nada
> e **não apaga** permissões que você já tenha adicionado.

---

## 3. Setup em máquina nova (autenticação dos CLIs)

Quando você troca de computador (ou formata o atual), os squads e o script vão
junto pelo Git, mas os CLIs e as credenciais **não**. Faça este setup uma vez:

### 3.1. Instalar os CLIs

O próprio installer faz isso quando detecta que faltam. Para instalar manualmente:

```bash
# Meta Ads CLI
cd /Users/hergamenessouza/aiox-pro-traffic/packages/meta-ads-agent
npm install && npm run build && npm install -g .

# Google Ads CLI
cd /Users/hergamenessouza/aiox-pro-traffic/packages/google-ads-agent
npm install && npm run build && npm install -g .
```

Confirme que ficaram disponíveis:

```bash
meta-ads --help
google-ads --help
```

### 3.2. Autenticar o Meta Ads CLI

As credenciais ficam guardadas com segurança no **Keychain do macOS** (não em
arquivos de texto). Para verificar o status e autenticar:

```bash
meta-ads auth status      # mostra se já está autenticado
meta-ads auth login       # inicia o login (siga as instruções na tela)
```

### 3.3. Autenticar o Google Ads CLI

Mesmo princípio — credenciais no Keychain:

```bash
google-ads auth status    # mostra se já está autenticado
google-ads auth login     # inicia o login (siga as instruções na tela)
```

> Lembre-se: cada conta de anúncios pertence a UM cliente. Nunca misture dados
> de clientes diferentes na mesma análise.

---

## 4. Conector MCP `claude_ai_Facebook` (nada a instalar)

O AIOX usa um conector chamado **`claude_ai_Facebook`**. Ele é um conector da sua
**conta claude.ai** (não do projeto). Por isso:

- **Não há nada para instalar** no projeto de destino.
- Ele já fica disponível porque está ligado à sua conta claude.ai.

Como confirmar que está ativo:

1. Acesse `claude.ai` no navegador, logado na sua conta.
2. Vá em **Configurações → Conectores** (ou "Connectors").
3. Verifique se **Facebook** aparece como conectado.

Se aparecer conectado, está tudo certo — o installer não toca nisso de propósito.

---

## 5. Como criar o `client-profile` de cada projeto

Cada cliente tem um perfil próprio que descreve nicho, contas, objetivos e regras.
Você cria a partir de um modelo (`_TEMPLATE.md`) que vem nos squads:

1. Abra o modelo:
   `squads/traffic-meta/data/client-profiles/_TEMPLATE.md`
   (ou o equivalente em `traffic-google`).

2. Copie para a pasta de relatórios do cliente, dando o nome do cliente:

   ```bash
   cp squads/traffic-meta/data/client-profiles/_TEMPLATE.md \
      reports/cliente-novo/client-profile.md
   ```

3. Preencha os campos do perfil (nicho, ID da conta, objetivo de campanha, etc.).

**Convenção de nomenclatura das pastas de relatório:**
`reports/{empresa}-{plataforma}-{id}/` — por exemplo
`reports/verbo-feminino-meta-884611416502961/`.

> A pasta `reports/` é ignorada pelo Git (`.gitignore`). Os dados de cliente ficam
> só no seu computador — nunca vão para o repositório nem para outro projeto.

---

## Branding Solaro (logos)

As logos da agência Solaro (`solaro-logo-colorida.png`, `solaro-logo-branca.png`)
vivem dentro de `reports/`, que é uma pasta **gitignored com dados de cliente**.
Por isso o installer **não copia as logos automaticamente** — copiar `reports/`
violaria o isolamento entre clientes.

Os templates `client-presentation.html` (que vão junto com os squads) já esperam
encontrar `solaro-logo-colorida.png` **ao lado do HTML** na hora de gerar o PDF.

Para usar o branding em um projeto novo:

1. Pegue `solaro-logo-colorida.png` de um relatório anterior seu (em `reports/`).
2. Copie-a para a pasta onde está o `client-presentation.html` que você vai gerar.
3. Gere o PDF normalmente (Chrome headless) — a logo aparecerá.

---

## 6. Troubleshooting

### `meta-ads: command not found` (ou `google-ads: command not found`)

O CLI não está no PATH. Causas comuns:

- **Não foi instalado globalmente.** Rode o `npm install -g .` da seção 3.1.
- **Usa nvm e trocou de versão do Node.** Pacotes globais são por versão do Node.
  Reinstale o CLI na versão atual: `node -v` para ver a versão e repita o
  `npm install -g .`.
- **PATH não inclui a pasta global do npm.** Veja onde o npm instala globais:
  ```bash
  npm config get prefix
  ```
  A subpasta `bin` desse caminho precisa estar no seu `PATH` (geralmente já está).

### Erro de permissão no `npm install -g` (macOS)

Se aparecer `EACCES`, **evite usar `sudo`**. O recomendado é usar nvm (que instala
globais na sua pasta de usuário, sem permissões de administrador). Se já usa nvm e
mesmo assim deu erro, confirme que está na versão certa do Node com `nvm use`.

### Token expirado / autenticação falhou

Se um relatório falhar com erro de autenticação:

```bash
meta-ads auth status      # ou: google-ads auth status
meta-ads auth login       # refaça o login se aparecer "não autenticado"
```

### O installer disse que faltam as logos Solaro

Comportamento esperado — veja a seção **Branding Solaro** acima. As logos não são
copiadas porque ficam em `reports/` (dados de cliente). Copie a logo manualmente.
