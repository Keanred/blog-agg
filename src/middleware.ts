import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";
import type { CommandHandler, UserCommandHandler } from "./types/commands";
import type { middlewareLoggedIn } from "./types/middleware";

export const loggedInMiddleware: middlewareLoggedIn = (
  handler: UserCommandHandler,
): CommandHandler => {
  return async (cmdName, ...args) => {
    const config = readConfig();
    if (!config.currentUserName) {
      throw new Error("User not found");
    }
    const user = await getUserByName(config.currentUserName);
    if (!user) {
      throw new Error("User not found in database");
    }
    await handler(cmdName, user, ...args);
  };
};
