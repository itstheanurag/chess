import prisma from "@/libs/db";
import { paginatedSearchSchema } from "@/schema";
import { AuthenticatedRequest } from "@/types";
import { sendError, sendResponse } from "@/utils";
import type { Response } from "express";

export const searchUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, 400, "Not qualified to search");
    }
    const parsedResult = paginatedSearchSchema.safeParse(req.query);

    if (!parsedResult.success) {
      return sendError(res, 400, parsedResult.error);
    }

    const parsedData = parsedResult.data;

    const query = parsedData.q.trim();
    const pageNum = +parsedData.page || 1;
    const pageSize = +parsedData.size || 15;
    const skip = (pageNum - 1) * pageSize;

    const totalEntries = await prisma.user.count({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
          { NOT: { id: BigInt(userId) } },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
          { NOT: { id: BigInt(userId) } },
        ],
      },
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

    return sendResponse(
      res,
      200,
      {
        users: formatted,
        page: pageNum,
        size: pageSize,
        totalEntries,
      },
      "Users fetched successfully"
    );
  } catch (err) {
    console.error("Search user error:", err);
    return sendError(res, 500, "Failed to search users");
  }
};
