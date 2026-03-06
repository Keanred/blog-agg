import { deleteFeedFollow, getFeedByUrl } from "../lib/db/queries/feeds";
import type { UserCommandHandler } from "../types/commandTypes";
import { exitWithError, validateArgs } from "./feedHelpers";

export const unfollowCommand: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  validateArgs(args, 1, "unfollow url");
  const [url] = args;
  if (!url) {
    exitWithError("Usage: unfollow url");
  }

  const feed = await getFeedByUrl(url);
  if (!feed) {
    exitWithError("Feed not found");
  }

  const result = await deleteFeedFollow(feed.id, user.id);
  if (!result) {
    exitWithError("Failed to unfollow feed");
  }

  console.log(`User ${user.name} has unfollowed feed ${feed.name}`);
};