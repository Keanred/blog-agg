import type { CommandHandler } from "../types/commandTypes";
import { deleteUsers } from "../lib/db/queries/users";

export const resetCommand: CommandHandler = async (cmdName, ...args) => {
  console.log(`Handling command: ${cmdName} with args: ${args.join(", ")}`);

  const result = await deleteUsers();
  console.log(`Result from deleteUsers: ${JSON.stringify(result)}`);
};
