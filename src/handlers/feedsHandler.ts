import { getFeeds } from "../lib/db/queries/feeds";
<<<<<<< HEAD
import type { CommandHandler } from "../types/command";
import { getUser } from "../config";
import { getUserById, getUserByName } from "../lib/db/queries/users";
=======
import type { CommandHandler, UserCommandHandler } from "../types/commands";
import { getUserById } from "../lib/db/queries/users";
>>>>>>> 3014526 (add middleware)
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
<<<<<<< HEAD
  if (result != undefined) {
    printFeed(result, user);
  } else {
    console.log("Failed to create feed");
    process.exit(1);
  }
  const followed = await createFeedFollow(result.id, user.id);
  if (!followed) {
    console.log("Failed to follow feed");
    process.exit(1);
  }
=======
  if (!result) exitWithError("Failed to create feed");
  printFeed(result, user);
  const followed = await createFeedFollow(result.id, user.id);
  if (!followed) exitWithError("Failed to follow feed");
>>>>>>> 3014526 (add middleware)
  printFeed(result, user);
};

export const readFeedsHandler: CommandHandler = async (cmdName, ...args) => {
  validateArgs(args, 0, "feeds");
  const feeds = await getFeeds();
  if (!feeds) exitWithError("No feeds found");
  await printFeeds(feeds);
};

<<<<<<< HEAD
export const feedFollowHandler: CommandHandler = async (cmdName, ...args) => {
  if (args.length !== 1) {
    console.log("Usage: follow url");
    process.exit(1);
  }
  const [url] = args;
  if (!url) {
    console.log("Usage: follow url");
    process.exit(1);
  }
  const loggedInUser = getUser();
  const user = await getUserByName(loggedInUser);
  if (!user) {
    console.log("User not found");
    process.exit(1);
  }
  const feed = await getFeedByUrl(url);
  if (!feed) {
    console.log("Feed not found");
    process.exit(1);
  }
  const follow = await createFeedFollow(feed.id, user.id);
  if (!follow) {
    console.log("Failed to create feed follow");
    process.exit(1);
  }
=======
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
>>>>>>> 3014526 (add middleware)
  console.log(
    `User ${follow.userName} is now following feed ${follow.feedName}`,
  );
};

<<<<<<< HEAD
export const followedFeedsHandler: CommandHandler = async (
  cmdName,
  ...args
) => {
  if (args.length !== 0) {
    console.log("Usage: followed");
    process.exit(1);
  }
  const loggedInUser = getUser();
  const user = await getUserByName(loggedInUser);
  if (!user) {
    console.log("User not found");
    process.exit(1);
  }
  const feedFollows = await getFeedFollowsForUser(user.id);
  if (!feedFollows) {
    console.log("No followed feeds found");
    process.exit(1);
  }
=======
export const followedFeedsHandler: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  validateArgs(args, 0, "followed");
  const feedFollows = await getFeedFollowsForUser(user.id);
  if (!feedFollows) exitWithError("No followed feeds found");
>>>>>>> 3014526 (add middleware)
  for (const follow of feedFollows) {
    console.log(`* ${follow.feedName}`);
  }
};
