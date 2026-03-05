import { db } from "..";
import { feeds, feedFollows, users } from "../schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { Feed } from "../schema";

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

export const deleteFeedFollow = async (feedId: string, userId: string) => {
  const [result] = await db
    .delete(feedFollows)
    .where((eq(feedFollows.feedId, feedId), eq(feedFollows.userId, userId)))
    .returning();
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

export const markFeedFetched = async (feedId: string) => {
  const [result] = await db
    .update(feeds)
    .set({ last_fetched_at: new Date(), updatedAt: new Date() })
    .where(eq(feeds.id, feedId))
    .returning();
  return result;
};

export const getNextFeedToFetch = async (): Promise<Feed | undefined> => {
  const [result] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.last_fetched_at} ASC NULLS FIRST`)
    .limit(1);
  return result;
};
