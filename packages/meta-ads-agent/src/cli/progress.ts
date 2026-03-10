export const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BOLD: '\x1b[1m',
  RESET: '\x1b[0m',
} as const;

export const STEP_LABELS: Record<string, string> = {
  validate: '[1/5] Validando criativos...',
  upload: '[2/5] Fazendo upload...',
  campaign: '[3/5] Criando campanha...',
  adset: '[4/5] Configurando anúncio...',
  activate: '[5/5] Ativando...',
};

export const STEP_SUCCESS: Record<string, string> = {
  validate: '[1/5] Criativos validados',
  upload: '[2/5] Upload concluído',
  campaign: '[3/5] Campanha criada',
  adset: '[4/5] Anúncio configurado',
  activate: '[5/5] Campanha ativada!',
};

export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  const totalSeconds = ms / 1000;
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}
