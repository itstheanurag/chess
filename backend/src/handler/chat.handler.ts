import { db } from "@/db/drizzle";
import { gameMessage } from "@/db/schema";

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

    await db.insert(gameMessage).values(payloads);
    console.log(`${messages.length} chat messages saved.`);
  } catch (err) {
    console.error("Failed to save chat messages:", err);
  }
};
