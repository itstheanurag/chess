-- CreateEnum
CREATE TYPE "public"."GameType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" BIGSERIAL NOT NULL,
    "white_player_id" BIGINT,
    "black_player_id" BIGINT,
    "status" VARCHAR(20) NOT NULL,
    "result" VARCHAR(20),
    "type" "public"."GameType" NOT NULL DEFAULT 'PUBLIC',
    "passcode" VARCHAR(20),
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameMove" (
    "id" BIGSERIAL NOT NULL,
    "game_id" BIGINT NOT NULL,
    "move_number" INTEGER NOT NULL,
    "player_id" BIGINT,
    "from_square" VARCHAR(5) NOT NULL,
    "to_square" VARCHAR(5) NOT NULL,
    "promotion" VARCHAR(5),
    "fen" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameMove_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameSpectator" (
    "id" BIGSERIAL NOT NULL,
    "game_id" BIGINT NOT NULL,
    "spectator_id" BIGINT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameSpectator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GameSpectator_game_id_spectator_id_key" ON "public"."GameSpectator"("game_id", "spectator_id");

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_white_player_id_fkey" FOREIGN KEY ("white_player_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_black_player_id_fkey" FOREIGN KEY ("black_player_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameMove" ADD CONSTRAINT "GameMove_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameMove" ADD CONSTRAINT "GameMove_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameSpectator" ADD CONSTRAINT "GameSpectator_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameSpectator" ADD CONSTRAINT "GameSpectator_spectator_id_fkey" FOREIGN KEY ("spectator_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
