import { getUserById } from "../lib/db/queries/users";
import type { Feed, User } from "../lib/db/schema";

export function exitWithError(message: string): never {
  console.log(message);
  process.exit(1);
}

export function validateArgs(
  args: string[],
  expected: number,
  usage: string,
): void {
  if (args.length !== expected) {
    exitWithError(`Usage: ${usage}`);
  }
}

export function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

export async function printFeeds(feeds: Feed[]) {
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