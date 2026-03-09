import { createRequire } from 'node:module';
import { Command } from 'commander';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json') as { version: string; description: string };

const program = new Command();

program
  .name('meta-ads')
  .version(pkg.version)
  .description(pkg.description);

export function run(): void {
  program.parse();
}

export { program };
