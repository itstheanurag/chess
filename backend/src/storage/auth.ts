import { db } from "@/db/drizzle";
import { user, account } from "@/db/schema";
import { eq, or, and, ilike, count, not } from "drizzle-orm";
import { hashPassword } from "@/utils";
import { v4 as uuidv4 } from "uuid";

export const authStorage = {
  async findUserByEmail(email: string) {
    const result = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return result[0] || null;
  },

  async createUser({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    const userId = uuidv4();
    const now = new Date();

    // Create User
    const [newUser] = await db
      .insert(user)
      .values({
        id: userId,
        name: username,
        email: email,
        emailVerified: false,
        createdAt: now,
        updatedAt: now,
        username: username,
      })
      .returning();

    // Create Account for password
    await db.insert(account).values({
      id: uuidv4(),
      accountId: userId,
      providerId: "credential", // or "email-password" depending on Better Auth internals
      userId: userId,
      password: hashPassword(password),
      createdAt: now,
      updatedAt: now,
    });

    return newUser;
  },

  async searchUsers({
    userId,
    q,
    page = 1,
    size = 15,
  }: {
    userId: string;
    q: string;
    page?: number;
    size?: number;
  }) {
    const pageNum = +page || 1;
    const pageSize = +size || 15;
    const offset = (pageNum - 1) * pageSize;
    const query = q.trim();

    const conditions = [
      not(eq(user.id, userId)),
      or(ilike(user.username, `%${query}%`), ilike(user.email, `%${query}%`)),
    ];

    const whereClause = and(...conditions);

    const [totalResult] = await db
      .select({ count: count() })
      .from(user)
      .where(whereClause);

    const totalEntries = totalResult?.count ?? 0;

    const users = await db
      .select({
        id: user.id,
        username: user.username,
        email: user.email,
      })
      .from(user)
      .where(whereClause)
      .limit(pageSize)
      .offset(offset);

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.username,
      email: u.email,
    }));

    return {
      users: formatted,
      page: pageNum,
      size: pageSize,
      totalEntries,
    };
  },
};
