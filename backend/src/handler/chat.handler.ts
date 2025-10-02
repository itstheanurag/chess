import prisma from "@/libs/db";

export const handleBulkChatMessages = async (
  messages: {
    gameId: string;
    userId?: string;
    message: string;
    sentAt?: Date;
  }[]
) => {
  try {
    const payloads = messages.map((m) => ({
      gameId: m.gameId,
      userId: m.userId || null,
      message: m.message,
      sentAt: m.sentAt || new Date(),
    }));

    await prisma.gameMessage.createMany({ data: payloads });
    console.log(`${messages.length} chat messages saved.`);
  } catch (err) {
    console.error("Failed to save chat messages:", err);
  }
};
