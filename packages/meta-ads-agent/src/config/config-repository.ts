import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { parse, stringify } from 'yaml';
import { logger } from '../cli/logger.js';
import { appConfigSchema } from '../types/config.js';
import type { AppConfig } from '../types/config.js';

const CONFIG_DIR = join(homedir(), '.meta-ads');
const CONFIG_FILE = join(CONFIG_DIR, 'config.yaml');

function getDefaultConfig(): AppConfig {
  return appConfigSchema.parse({});
}

export async function load(): Promise<AppConfig> {
  try {
    await mkdir(CONFIG_DIR, { recursive: true });
    const content = await readFile(CONFIG_FILE, 'utf-8');
    const raw = parse(content) as unknown;
    return appConfigSchema.parse(raw);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      logger.debug('Config file not found, creating defaults');
      const config = getDefaultConfig();
      await save(config);
      return config;
    }
    throw error;
  }
}

export async function save(config: AppConfig): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  const content = stringify(config);
  await writeFile(CONFIG_FILE, content, 'utf-8');
  logger.debug('Config saved');
}

export async function getDefault(
  key: keyof AppConfig['defaults'],
): Promise<string | null> {
  const config = await load();
  return config.defaults[key];
}

export async function setDefault(
  key: keyof AppConfig['defaults'],
  value: string,
): Promise<void> {
  const config = await load();
  config.defaults[key] = value;
  await save(config);
  logger.debug({ key, value }, 'Default updated');
}
