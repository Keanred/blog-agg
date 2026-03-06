import { registerCommand, runCommand } from "./commandRegistry";
import { loginCommand } from "./commands/login";
import { resetCommand } from "./commands/reset";
import { registerUserCommand } from "./commands/register";
import { usersCommand } from "./commands/users";
import { aggregateCommand } from "./commands/aggregate";
import { addFeedCommand } from "./commands/addFeed";
import { feedsCommand } from "./commands/feeds";
import { followCommand } from "./commands/follow";
import { followingCommand } from "./commands/following";
import { unfollowCommand } from "./commands/unfollow";
import { browseCommand } from "./commands/browse";
import type { CommandsRegistry } from "./types/commandTypes";
import { argv } from "process";
import { loggedInMiddleware } from "./middleware";

const commandRegistry: CommandsRegistry = {};

async function main() {
  registerCommand(commandRegistry, "login", loginCommand);
  registerCommand(commandRegistry, "register", registerUserCommand);
  registerCommand(commandRegistry, "reset", resetCommand);
  registerCommand(commandRegistry, "users", usersCommand);
  registerCommand(commandRegistry, "agg", aggregateCommand);
  registerCommand(
    commandRegistry,
    "addfeed",
    loggedInMiddleware(addFeedCommand),
  );
  registerCommand(commandRegistry, "feeds", feedsCommand);
  registerCommand(
    commandRegistry,
    "follow",
    loggedInMiddleware(followCommand),
  );
  registerCommand(
    commandRegistry,
    "following",
    loggedInMiddleware(followingCommand),
  );
  registerCommand(
    commandRegistry,
    "unfollow",
    loggedInMiddleware(unfollowCommand),
  );
  registerCommand(
    commandRegistry,
    "browse",
    loggedInMiddleware(browseCommand),
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
