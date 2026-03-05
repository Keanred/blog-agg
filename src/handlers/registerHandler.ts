import type { CommandHandler } from "../types/commands";
import { createUser, getUserByName } from "../lib/db/queries/users";
import { setUser } from "../config";

export const registerHandler: CommandHandler = async (cmdName, ...args) => {
  console.log(`Handling command: ${cmdName} with args: ${args.join(", ")}`);
  if (args.length === 0) {
    throw new Error("Username is required for registration.");
  }
  if (args.length > 1) {
    throw new Error("Too many arguments for registration. Only username is required.");
  }
  if (typeof args[0] !== "string") {
    throw new Error("Username must be a string.");
  }
  const username = args[0].trim();
  if (username.length === 0) {
    throw new Error("Username cannot be empty.");
  }
  const verifyUnique = await getUserByName(username);
  if (verifyUnique) {
    throw new Error(`Username "${username}" is already taken.`);
  }
  const result = await createUser(args[0]);
  console.log(`Result from createUser: ${JSON.stringify(result)}`);
  if (!result) {
    throw new Error("Failed to create user.");
  }
  setUser(result.name);

  console.log(`Registered user: ${result.name}}`);
};
