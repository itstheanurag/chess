-- CreateEnum
CREATE TYPE "public"."GameType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game" (
    "id" UUID NOT NULL,
    "white_player_id" UUID,
    "black_player_id" UUID,
    "status" VARCHAR(20) NOT NULL,
    "result" VARCHAR(20),
    "type" "public"."GameType" NOT NULL DEFAULT 'PUBLIC',
    "passcode" VARCHAR(20),
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "fen" TEXT NOT NULL,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_move" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "move_number" INTEGER NOT NULL,
    "player_id" UUID,
    "from_square" VARCHAR(5) NOT NULL,
    "to_square" VARCHAR(5) NOT NULL,
    "promotion" VARCHAR(5),
    "fen" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_spectator" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "spectator_id" UUID NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_spectator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "game_spectator_game_id_spectator_id_key" ON "public"."game_spectator"("game_id", "spectator_id");

-- AddForeignKey
ALTER TABLE "public"."game" ADD CONSTRAINT "game_white_player_id_fkey" FOREIGN KEY ("white_player_id") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game" ADD CONSTRAINT "game_black_player_id_fkey" FOREIGN KEY ("black_player_id") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_move" ADD CONSTRAINT "game_move_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_move" ADD CONSTRAINT "game_move_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_spectator" ADD CONSTRAINT "game_spectator_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_spectator" ADD CONSTRAINT "game_spectator_spectator_id_fkey" FOREIGN KEY ("spectator_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
