import { db } from "..";
import { posts, feeds, feedFollows } from "../schema";
import { and, eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { Post } from "../schema";

export const createPost = async (
  feedId: string,
  title: string,
  url: string,
  description: string,
  publishedAt: Date,
): Promise<Post | undefined> => {
  const [existingPost] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.feedId, feedId), eq(posts.url, url)))
    .limit(1);

  if (existingPost) {
    return existingPost;
  }

  const [result] = await db
    .insert(posts)
    .values({
      feedId: feedId,
      title: title,
      url: url,
      description: description,
      publishedAt: publishedAt,
    })
    .returning();
  return result;
};

export const getPostsForUser = async (userId: string, limit: number = 2) => {
  const result = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(
      feedFollows,
      sql`${feedFollows.feedId} = ${feeds.id} AND ${feedFollows.userId} = ${userId}`,
    )
    .orderBy(sql`${posts.publishedAt} DESC`)
    .limit(limit);
  return result;
};
