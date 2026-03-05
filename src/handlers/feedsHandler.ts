import { getFeeds } from "../lib/db/queries/feeds";
import type { CommandHandler } from "../types/command";
import { getUser } from "../config";
import { getUserById, getUserByName } from "../lib/db/queries/users";
import {
  getFeedByUrl,
  createFeed,
  createFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feeds";
import type { Feed, User } from "../lib/db/schema";

const printFeed = (feed: Feed, user: User) => {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
};

const printFeeds = async (feeds: Feed[]) => {
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
};

export const addFeedHandler: CommandHandler = async (cmdName, ...args) => {
  if (args.length !== 2) {
    console.log("Usage: addfeed name url");
    process.exit(1);
  }
  const [name, url] = args;
  if (!name || !url) {
    console.log("Usage: feed name url");
    process.exit(1);
  }
  const loggedInUser = getUser();
  const user = await getUserByName(loggedInUser);
  if (!user) {
    console.log("User not found");
    process.exit(1);
  }
  const result = await createFeed(name, url, user.id);
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
  printFeed(result, user);
};

export const readFeedsHandler: CommandHandler = async (cmdName, ...args) => {
  if (args.length !== 0) {
    console.log("Usage: feeds");
    process.exit(1);
  }
  const feeds = await getFeeds();
  if (!feeds) {
    console.log("No feeds found");
    process.exit(1);
  }
  await printFeeds(feeds);
};

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
  console.log(
    `User ${follow.userName} is now following feed ${follow.feedName}`,
  );
};

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
  for (const follow of feedFollows) {
    console.log(`* ${follow.feedName}`);
  }
};
