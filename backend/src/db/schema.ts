import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const gameTypeEnum = pgEnum("game_type", ["PUBLIC", "PRIVATE"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),

  // Custom fields
  username: text("username").unique(),
  rating: integer("rating").default(1200).notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  whiteGames: many(game, { relationName: "whitePlayer" }),
  blackGames: many(game, { relationName: "blackPlayer" }),
  moves: many(gameMove),
  spectating: many(gameSpectator),
  messages: many(gameMessage),
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// Game Tables

export const game = pgTable("game", {
  id: uuid("id").defaultRandom().primaryKey(),
  whitePlayerId: text("white_player_id").references(() => user.id, {
    onDelete: "set null",
  }),
  blackPlayerId: text("black_player_id").references(() => user.id, {
    onDelete: "set null",
  }),
  status: text("status").notNull(), // e.g. "waiting", "playing", "finished"
  result: text("result"), // e.g. "white_won", "draw"
  type: gameTypeEnum("type").default("PUBLIC"),
  passcode: text("passcode"),
  isVisible: boolean("is_visible").default(false),
  fen: text("fen").notNull(),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  notes: text("notes"),
  name: text("name").default(""),
});

export const gameRelations = relations(game, ({ one, many }) => ({
  whitePlayer: one(user, {
    fields: [game.whitePlayerId],
    references: [user.id],
    relationName: "whitePlayer",
  }),
  blackPlayer: one(user, {
    fields: [game.blackPlayerId],
    references: [user.id],
    relationName: "blackPlayer",
  }),
  moves: many(gameMove),
  spectators: many(gameSpectator),
  messages: many(gameMessage),
}));

export const gameMove = pgTable("game_move", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id")
    .notNull()
    .references(() => game.id, { onDelete: "cascade" }),
  moveNumber: integer("move_number").notNull(),
  playerId: text("player_id").references(() => user.id, {
    onDelete: "set null",
  }),
  fromSquare: text("from_square").notNull(),
  toSquare: text("to_square").notNull(),
  promotion: text("promotion"),
  fen: text("fen").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameMoveRelations = relations(gameMove, ({ one }) => ({
  game: one(game, {
    fields: [gameMove.gameId],
    references: [game.id],
  }),
  player: one(user, {
    fields: [gameMove.playerId],
    references: [user.id],
  }),
}));

export const gameSpectator = pgTable("game_spectator", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id")
    .notNull()
    .references(() => game.id, { onDelete: "cascade" }),
  spectatorId: text("spectator_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const gameSpectatorRelations = relations(gameSpectator, ({ one }) => ({
  game: one(game, {
    fields: [gameSpectator.gameId],
    references: [game.id],
  }),
  spectator: one(user, {
    fields: [gameSpectator.spectatorId],
    references: [user.id],
  }),
}));

export const gameMessage = pgTable("game_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id")
    .notNull()
    .references(() => game.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const gameMessageRelations = relations(gameMessage, ({ one }) => ({
  game: one(game, {
    fields: [gameMessage.gameId],
    references: [game.id],
  }),
  user: one(user, {
    fields: [gameMessage.userId],
    references: [user.id],
  }),
}));
