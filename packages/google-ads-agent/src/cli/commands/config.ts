import { Command } from 'commander';
import { input } from '@inquirer/prompts';
import {
  getDefaults,
  setDefaults,
  isValidCustomerId,
  normalizeCustomerId,
} from '../../config/config-repository.js';
import { COLORS } from '../display.js';
import { printError } from '../../errors/error-handler.js';

export const configCommand = new Command('config').description(
  'Gerenciar configurações padrão (customer-id, login-customer-id)',
);

configCommand
  .command('set-default')
  .description('Definir conta de anúncio padrão (interativo)')
  .action(async () => {
    try {
      console.log(`${COLORS.bold}Configurar conta padrão Google Ads${COLORS.reset}\n`);

      const customerId = await input({
        message: 'Customer ID (10 dígitos, com ou sem traços):',
        validate: (raw) => {
          if (!raw.trim()) return 'Obrigatório';
          if (!isValidCustomerId(raw)) {
            return 'Customer ID deve ter exatamente 10 dígitos numéricos';
          }
          return true;
        },
      });

      const loginCustomerIdRaw = await input({
        message: 'Login Customer ID (MCC, opcional — Enter para pular):',
        default: '',
        validate: (raw) => {
          if (!raw.trim()) return true;
          if (!isValidCustomerId(raw)) {
            return 'Login Customer ID deve ter 10 dígitos ou ser deixado em branco';
          }
          return true;
        },
      });

      await setDefaults({
        customerId,
        ...(loginCustomerIdRaw.trim() ? { loginCustomerId: loginCustomerIdRaw } : {}),
      });

      console.log(`\n${COLORS.green}✓ Padrões persistidos no Keychain.${COLORS.reset}`);
      console.log(`  Customer ID:       ${normalizeCustomerId(customerId)}`);
      if (loginCustomerIdRaw.trim()) {
        console.log(`  Login Customer ID: ${normalizeCustomerId(loginCustomerIdRaw)}`);
      }
      console.log(
        `\n${COLORS.dim}Confirme com: google-ads auth status${COLORS.reset}`,
      );
    } catch (err) {
      printError(err);
      process.exitCode = 1;
    }
  });

configCommand
  .command('get-default')
  .description('Exibir conta padrão configurada')
  .action(async () => {
    try {
      const defaults = await getDefaults();
      console.log(`${COLORS.bold}Configuração padrão${COLORS.reset}`);
      console.log(
        `  Customer ID:       ${defaults.customerId ?? `${COLORS.dim}(não definido)${COLORS.reset}`}`,
      );
      console.log(
        `  Login Customer ID: ${defaults.loginCustomerId ?? `${COLORS.dim}(não definido)${COLORS.reset}`}`,
      );
      if (!defaults.customerId) {
        console.log(
          `\n${COLORS.dim}Defina com: google-ads config set-default${COLORS.reset}`,
        );
      }
    } catch (err) {
      printError(err);
      process.exitCode = 1;
    }
  });
