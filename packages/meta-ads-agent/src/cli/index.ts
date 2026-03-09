import { createRequire } from 'node:module';
import { Command } from 'commander';
import { authCommand } from './commands/auth.js';
import { accountsCommand } from './commands/accounts.js';
import { pagesCommand } from './commands/pages.js';
import { configCommand } from './commands/config.js';
import { creativesCommand } from './commands/creatives.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json') as { version: string; description: string };

const program = new Command();

program
  .name('meta-ads')
  .version(pkg.version)
  .description(pkg.description);

program.addCommand(authCommand);
program.addCommand(accountsCommand);
program.addCommand(pagesCommand);
program.addCommand(configCommand);
program.addCommand(creativesCommand);

export function run(): void {
  program.parse();
}

export { program };
