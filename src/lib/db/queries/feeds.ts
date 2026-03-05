import { db } from "..";
import { feeds, feedFollows, users } from "../schema";
import { eq } from "drizzle-orm";

export const getFeeds = async () => {
  const result = await db.select().from(feeds);
  return result;
};

export const getFeedById = async (id: string) => {
  const [result] = await db.select().from(feeds).where(eq(feeds.id, id));
  return result;
};

export const getFeedByUrl = async (url: string) => {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
};

export const createFeed = async (name: string, url: string, id: string) => {
  const [result] = await db
    .insert(feeds)
    .values({
      userId: id,
      name: name,
      url: url,
    })
    .returning();
  return result;
};

export const createFeedFollow = async (feedId: string, userId: string) => {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({
      feedId: feedId,
      userId: userId,
    })
    .returning();
  if (!newFeedFollow) {
    console.log("Failed to create feed follow");
    process.exit(1);
  }
  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, newFeedFollow.id));
  return result;
};

export const getFeedFollowsForUser = async (userId: string) => {
  const result = await db
    .select({
      id: feedFollows.id,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));
  return result;
};
