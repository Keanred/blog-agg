import { registerCommand, runCommand } from './command';
import { readConfig } from './config';
import { loginHandler } from './handlers/loginHandler';
import type { CommandsRegistry } from './types/command';
import { argv } from 'process';

const commandRegistry: CommandsRegistry = {};

function main() {
  const config = readConfig();
  registerCommand(commandRegistry, 'login', loginHandler);
  const [,, commandName, ...args] = argv;
  console.log(`Running command: ${commandName} with arguments: ${args.join(' ')}`);
  if (commandName) {
      runCommand(commandRegistry, commandName, ...args);
  } else {
      console.log('No command provided. Please provide a command to run.');
      process.exit(1);
  }
}

main();
