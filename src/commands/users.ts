import { getUsers } from "../lib/db/queries/users";
import type { CommandHandler } from "../types/commandTypes";
import { readConfig } from "../config";

export const usersCommand: CommandHandler = async (cmdName, ...args) => {
  const { currentUserName } = readConfig();
  if (args.length > 0) {
    throw new Error("The 'users' command does not take any arguments.");
  }
  const users = await getUsers();
  if (users.length === 0) {
    console.log("No users found.");
    return;
  }
  for (const user of users) {
    if (user.name === currentUserName) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
};
