import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export const createUser = async (name: string) => {
  const [result] = await db.insert(users).values({ name: name }).returning();
  console.log(`Created user`);
  return result;
}

export const getUserByName = async (name: string) => {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  return result;
}
