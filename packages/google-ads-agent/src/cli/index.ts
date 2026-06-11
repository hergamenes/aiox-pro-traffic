import { createRequire } from 'node:module';
import { Command } from 'commander';
import { authCommand } from './commands/auth.js';
import { accountsCommand } from './commands/accounts.js';
import { configCommand } from './commands/config.js';
import { reportCommand } from './commands/report.js';
import { updateCommand } from './commands/update.js';
import { pauseCommand, enableCommand } from './commands/pause-enable.js';
import { createCommand } from './commands/create.js';
import { keywordCommand, registerAdGroupSubcommand } from './commands/keyword.js';
import { registerAdSubcommands } from './commands/ad.js';
import { uploadCommand, listAssetsCommand } from './commands/upload.js';
import { removeCommand } from './commands/remove.js';
import { keywordResearchCommand } from './commands/keyword-research.js';

registerAdGroupSubcommand(createCommand);
registerAdSubcommands(createCommand);

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
program.addCommand(keywordResearchCommand);
program.addCommand(updateCommand);
program.addCommand(pauseCommand);
program.addCommand(enableCommand);
program.addCommand(createCommand);
program.addCommand(keywordCommand);
program.addCommand(uploadCommand);
program.addCommand(listAssetsCommand);
program.addCommand(removeCommand);

export function run(): void {
  program.parse();
}

export { program };
