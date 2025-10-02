-- CreateTable
CREATE TABLE "public"."game_messages" (
    "id" UUID NOT NULL,
    "gameId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,

    CONSTRAINT "game_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."game_messages" ADD CONSTRAINT "game_messages_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_messages" ADD CONSTRAINT "game_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
