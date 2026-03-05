import { getFeeds } from "../lib/db/queries/feeds";
import type { CommandHandler, UserCommandHandler } from "../types/commands";
import { getUserById } from "../lib/db/queries/users";
import {
  getFeedByUrl,
  createFeed,
  createFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feeds";
import type { Feed, User } from "../lib/db/schema";

function exitWithError(message: string): never {
  console.log(message);
  process.exit(1);
}

function validateArgs(args: string[], expected: number, usage: string): void {
  if (args.length !== expected) {
    exitWithError(`Usage: ${usage}`);
  }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

async function printFeeds(feeds: Feed[]) {
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      console.log(`User not found for feed ${feed.id}`);
      continue;
    }
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User ID:       ${user.name}`);
  }
}

export const addFeedHandler: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  validateArgs(args, 2, "addfeed name url");
  const [name, url] = args;
  if (!name || !url) exitWithError("Usage: addfeed name url");
  const result = await createFeed(name, url, user.id);
  if (!result) exitWithError("Failed to create feed");
  printFeed(result, user);
  const followed = await createFeedFollow(result.id, user.id);
  if (!followed) exitWithError("Failed to follow feed");
  printFeed(result, user);
};

export const readFeedsHandler: CommandHandler = async (cmdName, ...args) => {
  validateArgs(args, 0, "feeds");
  const feeds = await getFeeds();
  if (!feeds) exitWithError("No feeds found");
  await printFeeds(feeds);
};

export const feedFollowHandler: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  validateArgs(args, 1, "follow url");
  const [url] = args;
  if (!url) exitWithError("Usage: follow url");
  const feed = await getFeedByUrl(url);
  if (!feed) exitWithError("Feed not found");
  const follow = await createFeedFollow(feed.id, user.id);
  if (!follow) exitWithError("Failed to create feed follow");
  console.log(
    `User ${follow.userName} is now following feed ${follow.feedName}`,
  );
};

export const followedFeedsHandler: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  validateArgs(args, 0, "followed");
  const feedFollows = await getFeedFollowsForUser(user.id);
  if (!feedFollows) exitWithError("No followed feeds found");
  for (const follow of feedFollows) {
    console.log(`* ${follow.feedName}`);
  }
};
