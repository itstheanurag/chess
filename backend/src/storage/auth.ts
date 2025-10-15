import prisma from "@/libs/db";
import { hashPassword } from "@/utils";
import { Prisma, User } from "@prisma/client";

export const authStorage = {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async createUser({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashPassword(password),
      },
    });
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
    const skip = (pageNum - 1) * pageSize;
    const query = q.trim();

    const where: Prisma.UserWhereInput = {
      AND: [
        {
          OR: [
            {
              username: { contains: query, mode: Prisma.QueryMode.insensitive },
            },
            { email: { contains: query, mode: Prisma.QueryMode.insensitive } },
          ],
        },
        { NOT: { id: userId } },
      ],
    };

    const totalEntries = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
      },
      skip,
      take: pageSize,
    });

    const formatted = users.map((u) => ({
      id: u.id.toString(),
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
