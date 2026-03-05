import type { CommandHandler, UserCommandHandler } from "./commands";

export type middlewareLoggedIn = (
  handler: UserCommandHandler,
) => CommandHandler;
