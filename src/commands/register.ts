import type { CommandHandler } from "../types/commandTypes";
import { createUser, getUserByName } from "../lib/db/queries/users";
import { setUser } from "../config";

export const registerUserCommand: CommandHandler = async (cmdName, ...args) => {
  console.log(`Handling command: ${cmdName} with args: ${args.join(", ")}`);
  if (args.length === 0) {
    throw new Error("Username is required for registration.");
  }
  if (args.length > 1) {
    throw new Error("Too many arguments for registration. Only username is required.");
  }
  const [rawUsername] = args;
  if (!rawUsername) {
    throw new Error("Username is required for registration.");
  }
  const username = rawUsername.trim();
  if (username.length === 0) {
    throw new Error("Username cannot be empty.");
  }
  const verifyUnique = await getUserByName(username);
  if (verifyUnique) {
    throw new Error(`Username "${username}" is already taken.`);
  }
  const result = await createUser(username);
  console.log(`Result from createUser: ${JSON.stringify(result)}`);
  if (!result) {
    throw new Error("Failed to create user.");
  }
  setUser(result.name);

  console.log(`Registered user: ${result.name}}`);
};
