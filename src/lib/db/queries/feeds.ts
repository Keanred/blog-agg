import { db } from "..";
import { feeds } from "../schema";

export const getFeeds = async () => {
  const result = await db.select().from(feeds);
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
