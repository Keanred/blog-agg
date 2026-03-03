import { registerCommand, runCommand } from './command';
import { loginHandler } from './handlers/loginHandler';
import { registerHandler } from './handlers/registerHandler';
import type { CommandsRegistry } from './types/command';
import { argv } from 'process';

const commandRegistry: CommandsRegistry = {};

async function main() {
  registerCommand(commandRegistry, 'login', loginHandler);
  registerCommand(commandRegistry, 'register', registerHandler);

  const [,, commandName, ...args] = argv;
  console.log(`Running command: ${commandName} with arguments: ${args.join(' ')}`);

  if (commandName) {
      await runCommand(commandRegistry, commandName, ...args);
  } else {
      console.log('No command provided. Please provide a command to run.');
      process.exit(1);
  }

  process.exit(0);
}

main();
