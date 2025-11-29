import { db } from "@/db/drizzle";
import { game, gameMove, user } from "@/db/schema";
import { eq, and, or, ilike, desc, count, sql } from "drizzle-orm";

export const gameStorage = {
  create: async (data: any) => {
    const [newGame] = await db.insert(game).values(data).returning();
    return newGame;
  },

  findById: async (id: string) => {
    const result = await db.query.game.findFirst({
      where: eq(game.id, id),
      with: {
        moves: {
          orderBy: (moves, { asc }) => [asc(moves.moveNumber)],
        },
        whitePlayer: {
          columns: {
            id: true,
            username: true,
            email: true,
          },
        },
        blackPlayer: {
          columns: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    return result;
  },

  update: async (id: string, data: any) => {
    const [updatedGame] = await db
      .update(game)
      .set(data)
      .where(eq(game.id, id))
      .returning();
    return updatedGame;
  },

  createMove: async (data: any) => {
    const [newMove] = await db.insert(gameMove).values(data).returning();
    return newMove;
  },

  async paginatedGames(query: {
    q?: string;
    page?: number;
    size?: number;
    status?: string;
    type?: string;
  }) {
    const { q, page, size, status, type } = query;

    const pageNum = +(page ?? 1);
    const pageSize = +(size ?? 15);
    const offset = (pageNum - 1) * pageSize;

    const conditions = [];

    if (status && typeof status === "string") {
      conditions.push(eq(game.status, status)); // Case sensitive or normalize if needed
    }

    if (type && typeof type === "string") {
      // @ts-ignore - enum handling might need casting or exact match
      conditions.push(eq(game.type, type.toUpperCase()));
    }

    if (q && typeof q === "string" && q.trim().length > 0) {
      conditions.push(
        or(ilike(game.name, `%${q}%`), ilike(game.notes, `%${q}%`))
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db
      .select({ count: count() })
      .from(game)
      .where(whereClause);

    const totalEntries = totalResult?.count ?? 0;

    const games = await db.query.game.findMany({
      where: whereClause,
      with: {
        whitePlayer: {
          columns: {
            id: true,
            username: true,
            email: true,
          },
        },
        blackPlayer: {
          columns: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: [desc(game.createdAt)],
      limit: pageSize,
      offset: offset,
    });

    return {
      games,
      page: pageNum,
      size: pageSize,
      total: totalEntries,
    };
  },

  async getGameStats(userId: string) {
    const [result] = await db
      .select({
        total: sql<number>`
        COUNT(*) FILTER (WHERE ${game.whitePlayerId} = ${userId} OR ${game.blackPlayerId} = ${userId})
      `,
        wins: sql<number>`
        COUNT(*) FILTER (
          WHERE 
            (${game.whitePlayerId} = ${userId} AND ${game.result} = 'white_win')
            OR
            (${game.blackPlayerId} = ${userId} AND ${game.result} = 'black_win')
        )
      `,
        losses: sql<number>`
        COUNT(*) FILTER (
          WHERE 
            (${game.whitePlayerId} = ${userId} AND ${game.result} = 'black_win')
            OR
            (${game.blackPlayerId} = ${userId} AND ${game.result} = 'white_win')
        )
      `,
        draws: sql<number>`
        COUNT(*) FILTER (
          WHERE 
            (${game.whitePlayerId} = ${userId} OR ${game.blackPlayerId} = ${userId})
            AND ${game.result} = 'draw'
        )
      `,
      })
      .from(game);

    return {
      total: Number(result.total),
      wins: Number(result.wins),
      losses: Number(result.losses),
      draws: Number(result.draws),
    };
  },
};
