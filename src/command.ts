import type { CommandsRegistry, CommandHandler } from "./types/command";

export const registerCommand = (registry: CommandsRegistry, cmdName: string, handler: CommandHandler) => {
};

export const runCommand = (registry: CommandsRegistry, cmdName: string, ...args: string[]) => {
};
