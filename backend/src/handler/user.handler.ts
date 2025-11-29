import { paginatedSearchSchema } from "@/schema";
import { authStorage } from "@/storage/auth";
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
    const data = await authStorage.searchUsers({ userId, ...parsedData });

    return sendResponse(
      res,
      200,
      {
        ...data,
      },
      "Users fetched successfully"
    );
  } catch (err) {
    console.error("Search user error:", err);
    return sendError(res, 500, "Failed to search users");
  }
};
