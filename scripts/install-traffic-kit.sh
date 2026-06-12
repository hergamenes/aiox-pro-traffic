#!/usr/bin/env bash
#
# install-traffic-kit.sh — Instalador portátil do Traffic Kit (Story 8.4)
#
# Copia os squads de tráfego (traffic-shared, traffic-meta, traffic-google),
# os shims de comandos Claude, configura allow rules de leitura e garante que
# os CLIs `meta-ads` / `google-ads` estejam disponíveis no PATH global.
#
# Uso:
#   ./scripts/install-traffic-kit.sh /caminho/projeto-destino [--yes]
#
#   --yes   Modo não-interativo: instala CLIs ausentes sem perguntar.
#
# Garantias de isolamento (Epic 8):
#   - NUNCA copia reports/ com conteúdo (cria pasta vazia com .gitkeep).
#   - NUNCA copia client-profiles que não sejam _TEMPLATE.md.
#   - Idempotente: rodar 2x não duplica squads nem allow rules.
#
set -euo pipefail

# ---------------------------------------------------------------------------
# Helpers de output
# ---------------------------------------------------------------------------
ok()    { printf '  \033[0;32m✓\033[0m %s\n' "$1"; }
fail()  { printf '  \033[0;31m✗\033[0m %s\n' "$1" >&2; }
info()  { printf '\033[0;36m▶\033[0m %s\n' "$1"; }
warn()  { printf '  \033[0;33m!\033[0m %s\n' "$1"; }

# ---------------------------------------------------------------------------
# Localização do repositório de origem (este script vive em <repo>/scripts/)
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_REPO="$(cd "$SCRIPT_DIR/.." && pwd)"

# ---------------------------------------------------------------------------
# Parse de argumentos
# ---------------------------------------------------------------------------
DESTINO=""
ASSUME_YES=0

usage() {
  cat <<EOF
Uso: $0 <destino> [--yes]

  <destino>   Pasta do projeto onde o Traffic Kit será instalado (deve existir).
  --yes       Modo não-interativo (instala CLIs ausentes sem perguntar).

Exemplo:
  $0 ~/projetos/cliente-novo
EOF
}

for arg in "$@"; do
  case "$arg" in
    --yes|-y) ASSUME_YES=1 ;;
    -h|--help) usage; exit 0 ;;
    -*) fail "Opção desconhecida: $arg"; usage; exit 1 ;;
    *)
      if [ -z "$DESTINO" ]; then
        DESTINO="$arg"
      else
        fail "Argumento extra ignorado: $arg"
      fi
      ;;
  esac
done

# ---------------------------------------------------------------------------
# Validações de entrada
# ---------------------------------------------------------------------------
info "Validando argumentos"

if [ -z "$DESTINO" ]; then
  fail "Argumento <destino> ausente."
  usage
  exit 1
fi

if [ ! -d "$DESTINO" ]; then
  fail "Destino não existe ou não é um diretório: $DESTINO"
  exit 1
fi

# Normaliza para caminho absoluto
DESTINO="$(cd "$DESTINO" && pwd)"

if [ "$DESTINO" = "$SOURCE_REPO" ]; then
  fail "O destino não pode ser o próprio repositório de origem."
  exit 1
fi
ok "Destino válido: $DESTINO"

# ---------------------------------------------------------------------------
# 1. Copiar squads (idempotente: limpa diretório de destino antes de copiar)
# ---------------------------------------------------------------------------
info "Copiando squads de tráfego"
mkdir -p "$DESTINO/squads"

copy_squad() {
  local squad="$1"
  local src="$SOURCE_REPO/squads/$squad"
  local dst="$DESTINO/squads/$squad"
  if [ ! -d "$src" ]; then
    fail "Squad de origem não encontrado: $src"
    return 1
  fi
  # Idempotência: remove versão anterior antes de copiar.
  rm -rf "$dst"
  cp -R "$src" "$dst"

  # Isolamento: remove qualquer client-profile real que não seja _TEMPLATE/README.
  local cp_dir="$dst/data/client-profiles"
  if [ -d "$cp_dir" ]; then
    find "$cp_dir" -type f ! -name '_TEMPLATE.md' ! -name 'README.md' -delete
  fi
  ok "squads/$squad"
}

copy_squad "traffic-shared"
copy_squad "traffic-meta"
copy_squad "traffic-google"

# ---------------------------------------------------------------------------
# 2. Copiar shims de comandos Claude (idempotente)
# ---------------------------------------------------------------------------
info "Copiando shims de comandos (.claude/commands)"
mkdir -p "$DESTINO/.claude/commands"

copy_commands() {
  local name="$1"
  local src="$SOURCE_REPO/.claude/commands/$name"
  local dst="$DESTINO/.claude/commands/$name"
  if [ ! -d "$src" ]; then
    warn "Shim de comando não encontrado (pulando): $src"
    return 0
  fi
  rm -rf "$dst"
  cp -R "$src" "$dst"
  ok ".claude/commands/$name"
}

copy_commands "trafficMeta"
copy_commands "trafficGoogle"

# ---------------------------------------------------------------------------
# 3. Criar reports/ vazio com .gitkeep (NUNCA copiar conteúdo de cliente)
# ---------------------------------------------------------------------------
info "Preparando pasta reports/ (vazia)"
mkdir -p "$DESTINO/reports"
if [ ! -f "$DESTINO/reports/.gitkeep" ]; then
  : > "$DESTINO/reports/.gitkeep"
fi
ok "reports/ pronto (sem dados de cliente)"

# ---------------------------------------------------------------------------
# 4. Verificar / instalar CLIs no PATH
# ---------------------------------------------------------------------------
info "Verificando CLIs no PATH (meta-ads, google-ads)"

install_cli() {
  local pkg_dir="$1"
  local cli_name="$2"
  local src="$SOURCE_REPO/packages/$pkg_dir"
  if [ ! -d "$src" ]; then
    fail "Pacote não encontrado para build: $src"
    return 1
  fi
  info "Instalando $cli_name a partir de packages/$pkg_dir"
  if ( cd "$src" && npm install && npm run build && npm install -g . ); then
    ok "$cli_name instalado globalmente"
  else
    fail "Falha ao instalar $cli_name. Veja a seção Troubleshooting do README-TRAFFIC-KIT.md (PATH/npm/nvm)."
    return 1
  fi
}

ensure_cli() {
  local cli_name="$1"
  local pkg_dir="$2"
  if command -v "$cli_name" >/dev/null 2>&1; then
    ok "$cli_name disponível: $(command -v "$cli_name")"
    return 0
  fi
  warn "$cli_name NÃO encontrado no PATH."
  if [ "$ASSUME_YES" -eq 1 ]; then
    install_cli "$pkg_dir" "$cli_name" || true
  else
    printf '    Instalar %s globalmente agora (build + npm install -g)? [s/N] ' "$cli_name"
    read -r resposta || resposta=""
    case "$resposta" in
      s|S|sim|Sim|y|Y) install_cli "$pkg_dir" "$cli_name" || true ;;
      *) warn "Instalação de $cli_name pulada. Os squads precisam dele no PATH para funcionar." ;;
    esac
  fi
}

ensure_cli "meta-ads"   "meta-ads-agent"
ensure_cli "google-ads" "google-ads-agent"

# ---------------------------------------------------------------------------
# 5. Merge de allow rules de LEITURA no settings.local.json (via node, idempotente)
# ---------------------------------------------------------------------------
info "Configurando allow rules de leitura (.claude/settings.local.json)"

SETTINGS_FILE="$DESTINO/.claude/settings.local.json"

# Backup do arquivo existente (mitiga risco E-R4).
if [ -f "$SETTINGS_FILE" ]; then
  cp "$SETTINGS_FILE" "$SETTINGS_FILE.bak"
  ok "Backup criado: settings.local.json.bak"
fi

node - "$SETTINGS_FILE" <<'NODE'
const fs = require('fs');
const file = process.argv[2];

const READ_RULES = [
  'Bash(meta-ads report:*)',
  'Bash(meta-ads accounts:*)',
  'Bash(meta-ads auth status)',
  'Bash(google-ads report:*)',
  'Bash(google-ads accounts:*)',
  'Bash(google-ads auth status)',
];

let settings = {};
if (fs.existsSync(file)) {
  try {
    settings = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('  settings.local.json inválido — não será sobrescrito. ' + e.message);
    process.exit(1);
  }
}

if (typeof settings !== 'object' || settings === null || Array.isArray(settings)) {
  console.error('  settings.local.json não é um objeto JSON — abortando para não corromper.');
  process.exit(1);
}

settings.permissions = settings.permissions || {};
const existing = Array.isArray(settings.permissions.allow) ? settings.permissions.allow : [];
const set = new Set(existing);

let added = 0;
for (const rule of READ_RULES) {
  if (!set.has(rule)) {
    existing.push(rule);
    set.add(rule);
    added++;
  }
}
settings.permissions.allow = existing;

fs.mkdirSync(require('path').dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(settings, null, 2) + '\n');
console.log('  allow rules: ' + added + ' adicionada(s), ' + (READ_RULES.length - added) + ' já presente(s).');
NODE
ok "allow rules de leitura aplicadas (regras existentes preservadas)"

# ---------------------------------------------------------------------------
# 6. Branding Solaro (cópia condicional — apenas se houver assets FORA de reports/)
# ---------------------------------------------------------------------------
info "Verificando assets de branding Solaro"

BRANDING_SRC=""
for candidate in "$SOURCE_REPO/branding" "$SOURCE_REPO/assets/branding" "$SOURCE_REPO/squads/traffic-shared/branding"; do
  if [ -d "$candidate" ]; then
    BRANDING_SRC="$candidate"
    break
  fi
done

if [ -n "$BRANDING_SRC" ]; then
  mkdir -p "$DESTINO/reports/branding-solaro"
  cp -R "$BRANDING_SRC/." "$DESTINO/reports/branding-solaro/"
  ok "Branding copiado de: $BRANDING_SRC"
else
  warn "Nenhum diretório de branding versionado encontrado."
  warn "As logos Solaro vivem em reports/ (gitignored, dados de cliente) e NÃO são copiadas."
  warn "Coloque manualmente solaro-logo-colorida.png ao lado do HTML antes de gerar PDF."
  warn "Detalhes na seção 'Branding Solaro' do README-TRAFFIC-KIT.md."
fi

# ---------------------------------------------------------------------------
# Resumo final
# ---------------------------------------------------------------------------
printf '\n\033[0;32m═══════════════════════════════════════════\033[0m\n'
info "Traffic Kit instalado em: $DESTINO"
ok "squads/: traffic-shared, traffic-meta, traffic-google"
ok ".claude/commands/: trafficMeta, trafficGoogle"
ok "reports/ vazio (sem dados de cliente)"
ok ".claude/settings.local.json com allow rules de leitura"
printf '\n'
info "Próximos passos:"
printf '  1. Autentique os CLIs: meta-ads auth status  /  google-ads auth status\n'
printf '  2. Crie um client-profile a partir de squads/traffic-meta/data/client-profiles/_TEMPLATE.md\n'
printf '  3. Veja README-TRAFFIC-KIT.md para o ciclo completo.\n'
printf '\033[0;32m═══════════════════════════════════════════\033[0m\n'
