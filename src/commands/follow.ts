import { createFeedFollow, getFeedByUrl } from "../lib/db/queries/feeds";
import type { UserCommandHandler } from "../types/commandTypes";
import { exitWithError, validateArgs } from "./feedHelpers";

export const followCommand: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  validateArgs(args, 1, "follow url");
  const [url] = args;
  if (!url) {
    exitWithError("Usage: follow url");
  }

  const feed = await getFeedByUrl(url);
  if (!feed) {
    exitWithError("Feed not found");
  }

  const follow = await createFeedFollow(feed.id, user.id);
  if (!follow) {
    exitWithError("Failed to create feed follow");
  }

  console.log(
    `User ${follow.userName} is now following feed ${follow.feedName}`,
  );
};