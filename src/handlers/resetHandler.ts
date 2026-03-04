import type { CommandHandler } from "../types/command";
import { deleteUsers } from "../lib/db/queries/users";

export const resetHandler: CommandHandler = async (cmdName, ...args) => {
  console.log(`Handling command: ${cmdName} with args: ${args.join(", ")}`);

  const result = await deleteUsers();
  console.log(`Result from deleteUsers: ${JSON.stringify(result)}`);
};
