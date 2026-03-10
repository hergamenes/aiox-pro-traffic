import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { listPages, getInstagramAccount } from '../meta-api/adapter.js';
import { ValidationError } from '../errors/types.js';
import type { AppConfig } from '../types/config.js';

export interface PageResolveOptions {
  pageFlag?: string;
  config: AppConfig;
}

export interface ResolvedPage {
  pageId: string;
  instagramAccountId: string | null;
}

const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

export async function resolvePageId(options: PageResolveOptions): Promise<ResolvedPage> {
  let pageId: string;

  if (options.pageFlag) {
    pageId = options.pageFlag;
  } else if (options.config.defaults.pageId) {
    pageId = options.config.defaults.pageId;
  } else {
    pageId = await selectPageInteractively();
  }

  const igAccount = await getInstagramAccount(pageId);
  const instagramAccountId = igAccount?.id ?? null;

  return { pageId, instagramAccountId };
}

async function selectPageInteractively(): Promise<string> {
  const pages = await listPages();

  if (pages.length === 0) {
    throw new ValidationError(
      'Nenhuma página encontrada. Configure uma página no Meta Business Suite.',
    );
  }

  if (pages.length === 1) {
    return pages[0].id;
  }

  console.log(`\n${BOLD}Selecione uma página:${RESET}\n`);
  for (let i = 0; i < pages.length; i++) {
    const ig = pages[i].instagramAccountId ? ' (Instagram conectado)' : '';
    console.log(`  ${i + 1}. ${pages[i].name} (${pages[i].id})${ig}`);
  }
  console.log('');

  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await rl.question(`${BOLD}Número da página:${RESET} `);
    const index = parseInt(answer.trim(), 10) - 1;

    if (isNaN(index) || index < 0 || index >= pages.length) {
      throw new ValidationError('Seleção inválida. Execute o comando novamente.');
    }

    return pages[index].id;
  } finally {
    rl.close();
  }
}
