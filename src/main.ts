import { registerCommand, runCommand } from "./command";
import { loginHandler } from "./handlers/loginHandler";
import { resetHandler } from "./handlers/resetHandler";
import { registerHandler } from "./handlers/registerHandler";
import { usersHandler } from "./handlers/userHandler";
import { aggHandler } from "./handlers/aggHandler";
import { addFeedHandler, readFeedsHandler } from "./handlers/feedsHandler";
import type { CommandsRegistry } from "./types/command";
import { argv } from "process";

const commandRegistry: CommandsRegistry = {};

async function main() {
  registerCommand(commandRegistry, "login", loginHandler);
  registerCommand(commandRegistry, "register", registerHandler);
  registerCommand(commandRegistry, "reset", resetHandler);
  registerCommand(commandRegistry, "users", usersHandler);
  registerCommand(commandRegistry, "agg", aggHandler);
  registerCommand(commandRegistry, "addfeed", addFeedHandler);
  registerCommand(commandRegistry, "feeds", readFeedsHandler);

  const [, , commandName, ...args] = argv;

  if (commandName) {
    await runCommand(commandRegistry, commandName, ...args);
  } else {
    console.log("No command provided. Please provide a command to run.");
    process.exit(1);
  }

  process.exit(0);
}

main();
