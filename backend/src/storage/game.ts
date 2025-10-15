import prisma from "@/libs/db";

export const gameStorage = {
  create: async (data: any) => await prisma.game.create({ data }),

  findById: async (id: string) =>
    await prisma.game.findUnique({
      where: { id },
      include: { moves: { orderBy: { moveNumber: "asc" } } },
    }),

  update: async (id: string, data: any) =>
    await prisma.game.update({ where: { id }, data }),

  count: async (where: any) => await prisma.game.count({ where }),

  findMany: async (where: any, skip: number, take: number) =>
    await prisma.game.findMany({
      where,
      select: {
        id: true,
        status: true,
        type: true,
        fen: true,
        notes: true,
        name: true,
        isVisible: true,
        createdAt: true,
        whitePlayerId: true,
        blackPlayerId: true,
        whitePlayer: { select: { id: true, username: true, email: true } },
        blackPlayer: { select: { id: true, username: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),

  createMove: async (data: any) => await prisma.gameMove.create({ data }),

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
    const skip = (pageNum - 1) * pageSize;

    const where: any = {};

    if (status && typeof status === "string") {
      where.status = status.toUpperCase();
    }

    if (type && typeof type === "string") {
      where.type = type.toUpperCase();
    }

    if (q && typeof q === "string" && q.trim().length > 0) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { notes: { contains: q, mode: "insensitive" } },
      ];
    }

    const totalEntries = await prisma.game.count({ where });
    const games = await prisma.game.findMany({
      where,
      select: {
        id: true,
        status: true,
        type: true,
        fen: true,
        notes: true,
        name: true,
        isVisible: true,
        createdAt: true,
        whitePlayerId: true,
        blackPlayerId: true,
        whitePlayer: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        blackPlayer: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });

    return {
      games,
      page: pageNum,
      size: pageSize,
      total: totalEntries,
    };
  },
};
