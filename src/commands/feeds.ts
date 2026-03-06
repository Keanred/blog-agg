import { getFeeds } from "../lib/db/queries/feeds";
import type { CommandHandler } from "../types/commandTypes";
import { exitWithError, printFeeds, validateArgs } from "./feedHelpers";

export const feedsCommand: CommandHandler = async (cmdName, ...args) => {
  validateArgs(args, 0, "feeds");
  const feeds = await getFeeds();
  if (!feeds) {
    exitWithError("No feeds found");
  }

  await printFeeds(feeds);
};
