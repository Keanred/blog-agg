import type { CommandsRegistry, CommandHandler } from "./types/command";

export const registerCommand = (registry: CommandsRegistry, cmdName: string, handler: CommandHandler) => {
  if (registry === undefined) {
    throw new Error("No registry");
  }
  if (registry[cmdName]) {
    throw new Error(`Command "${cmdName}" is already registered.`);
  }
  registry[cmdName] = handler;
};

export const runCommand = async (registry: CommandsRegistry, cmdName: string, ...args: string[]) => {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Command "${cmdName}" not found.`);
  }
  await handler(cmdName, ...args);
};
