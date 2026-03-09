import { createRequire } from 'node:module';
import { Command } from 'commander';
import { authCommand } from './commands/auth.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json') as { version: string; description: string };

const program = new Command();

program
  .name('meta-ads')
  .version(pkg.version)
  .description(pkg.description);

program.addCommand(authCommand);

export function run(): void {
  program.parse();
}

export { program };
