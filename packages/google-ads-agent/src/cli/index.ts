import { createRequire } from 'node:module';
import { Command } from 'commander';
import { authCommand } from './commands/auth.js';
import { accountsCommand } from './commands/accounts.js';
import { configCommand } from './commands/config.js';
import { reportCommand } from './commands/report.js';
import { updateCommand } from './commands/update.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json') as { version: string; description: string };

const program = new Command();

program
  .name('google-ads')
  .version(pkg.version)
  .description(pkg.description);

program.addCommand(authCommand);
program.addCommand(accountsCommand);
program.addCommand(configCommand);
program.addCommand(reportCommand);
program.addCommand(updateCommand);

export function run(): void {
  program.parse();
}

export { program };
