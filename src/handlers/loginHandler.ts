import type { CommandHandler } from "../types/command";
import { setUser } from "../config"
import { getUserByName } from "../lib/db/queries/users";

export const loginHandler: CommandHandler = async (cmdName, ...args) => {
  if (args.length === 0) {
    throw new Error("Username is required for login.");
  }
  if (args.length > 1) {
    throw new Error("Too many arguments for login. Only username is required.");
  }
  if (typeof args[0] !== "string") {
    throw new Error("Username must be a string.");
  }
  const userExists = await getUserByName(args[0]);
  if (!userExists) {
    throw new Error(`User "${args[0]}" does not exist.`);
  }
  setUser(args[0]);
  console.log(`Logged in as ${args[0]}`);
  };
