import type { CommandHandler, UserCommandHandler } from "./command";
export type middlewareLoggedIn = (
  handler: UserCommandHandler,
) => CommandHandler;
