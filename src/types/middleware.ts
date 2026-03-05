<<<<<<< HEAD
import type { CommandHandler, UserCommandHandler } from "./command";
=======
import type { CommandHandler, UserCommandHandler } from "./commands";

>>>>>>> 3014526 (add middleware)
export type middlewareLoggedIn = (
  handler: UserCommandHandler,
) => CommandHandler;
