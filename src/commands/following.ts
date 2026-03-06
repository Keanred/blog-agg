import { getFeedFollowsForUser } from "../lib/db/queries/feeds";
import type { UserCommandHandler } from "../types/commandTypes";
import { exitWithError, validateArgs } from "./feedHelpers";

export const followingCommand: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  validateArgs(args, 0, "following");

  const feedFollows = await getFeedFollowsForUser(user.id);
  if (!feedFollows) {
    exitWithError("No followed feeds found");
  }

  for (const follow of feedFollows) {
    console.log(`* ${follow.feedName}`);
  }
};