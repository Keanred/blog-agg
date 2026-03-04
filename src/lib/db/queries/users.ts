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

export const getUsers = async () => {
  const result = await db.select().from(users);
  const allUsers = result.map((row) => {
    return {
      id: row.id,
      name: row.name,
    }
  });
  return allUsers;
}

export const deleteUsers = async () => {
  const [result] = await db.delete(users).returning();
  console.log(`Deleted users`);
  return result;
}

