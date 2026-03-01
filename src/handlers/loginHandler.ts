import type { CommandHandler } from "../types/command";
import { setUser } from "../config"

export const handlerLogin: CommandHandler = (cmdName, ...args) => {
  if (args.length === 0) {
    throw new Error("Username is required for login.");
  }
  if (args.length > 1) {
    throw new Error("Too many arguments for login. Only username is required.");
  }
  if (typeof args[0] !== "string") {
    throw new Error("Username must be a string.");
  }
  setUser(args[0]);
  console.log(`Logged in as ${args[0]}`);
};
