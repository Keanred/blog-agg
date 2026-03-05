import { registerCommand, runCommand } from "./commands";
import { loginHandler } from "./handlers/loginHandler";
import { resetHandler } from "./handlers/resetHandler";
import { registerHandler } from "./handlers/registerHandler";
import { usersHandler } from "./handlers/userHandler";
import { aggHandler } from "./handlers/aggHandler";
import {
  addFeedHandler,
  readFeedsHandler,
  feedFollowHandler,
  followedFeedsHandler,
} from "./handlers/feedsHandler";
import type { CommandsRegistry } from "./types/commands";
import { argv } from "process";
import { loggedInMiddleware } from "./middleware";

const commandRegistry: CommandsRegistry = {};

async function main() {
  registerCommand(commandRegistry, "login", loginHandler);
  registerCommand(commandRegistry, "register", registerHandler);
  registerCommand(commandRegistry, "reset", resetHandler);
  registerCommand(commandRegistry, "users", usersHandler);
  registerCommand(commandRegistry, "agg", aggHandler);
  registerCommand(
    commandRegistry,
    "addfeed",
    loggedInMiddleware(addFeedHandler),
  );
  registerCommand(commandRegistry, "feeds", readFeedsHandler);
  registerCommand(
    commandRegistry,
    "follow",
    loggedInMiddleware(feedFollowHandler),
  );
  registerCommand(
    commandRegistry,
    "following",
    loggedInMiddleware(followedFeedsHandler),
  );

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
