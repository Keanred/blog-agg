import { createFeed, createFeedFollow } from "../lib/db/queries/feeds";
import type { UserCommandHandler } from "../types/commandTypes";
import { exitWithError, printFeed, validateArgs } from "./feedHelpers";

export const addFeedCommand: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  validateArgs(args, 2, "addfeed name url");
  const [name, url] = args;
  if (!name || !url) {
    exitWithError("Usage: addfeed name url");
  }

  const result = await createFeed(name, url, user.id);
  if (!result) {
    exitWithError("Failed to create feed");
  }

  const followed = await createFeedFollow(result.id, user.id);
  if (!followed) {
    exitWithError("Failed to follow feed");
  }

  printFeed(result, user);
};