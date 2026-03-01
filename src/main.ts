import { readConfig } from './config';
import type { CommandsRegistry } from './types/command';

const commandRegistry: CommandsRegistry = {
};
function main() {
  const config = readConfig();
  console.log('Current configuration:', config);

}

main();
