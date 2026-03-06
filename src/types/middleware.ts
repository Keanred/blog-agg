import type { CommandHandler, UserCommandHandler } from "./commandTypes";

export type middlewareLoggedIn = (
  handler: UserCommandHandler,
) => CommandHandler;
