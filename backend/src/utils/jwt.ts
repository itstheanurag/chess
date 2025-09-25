import jwt, { JwtPayload } from "jsonwebtoken";
import { REDIS_KEYS, redisClient } from "@/libs/redis";
import { Tokens, JwtPayloadOptions } from "@/types";

export async function generateToken(
  payload: JwtPayloadOptions
): Promise<Tokens> {
  const accessSecret: jwt.Secret = process.env.JWT_ACCESS_SECRET ?? "";
  const refreshSecret: jwt.Secret = process.env.JWT_REFRESH_SECRET ?? "";

  const accessExpiresIn =
    process.env.JWT_ACCESS_EXPIRES_IN ?? ("15m" as unknown as any);
  const refreshExpiresIn =
    process.env.JWT_REFRESH_EXPIRES_IN ?? ("7d" as unknown as any);

  const accessToken = jwt.sign({ ...payload }, accessSecret, {
    expiresIn: accessExpiresIn,
    algorithm: "HS256",
  });

  const refreshToken = jwt.sign({ ...payload }, refreshSecret, {
    expiresIn: refreshExpiresIn,
    algorithm: "HS256",
  });

  const accessTtlSeconds = 15 * 60;
  const refreshTtlSeconds = 7 * 24 * 60 * 60;

  await redisClient.set(
    `${REDIS_KEYS.accessTokenKey}:${payload.id}`,
    accessToken,
    {
      EX: accessTtlSeconds,
    }
  );

  await redisClient.set(
    `${REDIS_KEYS.refreshTokenKey}:${payload.id}`,
    refreshToken,
    {
      EX: refreshTtlSeconds,
    }
  );

  return { accessToken, refreshToken };
}

export async function generateAccessToken(
  payload: JwtPayloadOptions
): Promise<string> {
  const accessSecret: jwt.Secret = process.env.JWT_ACCESS_SECRET ?? "";

  await redisClient.del(`${REDIS_KEYS.accessTokenKey}:${payload.id}`);

  const accessExpiresIn =
    process.env.JWT_ACCESS_EXPIRES_IN ?? ("15m" as unknown as any);
  const accessToken = jwt.sign({ ...payload }, accessSecret, {
    expiresIn: accessExpiresIn,
    algorithm: "HS256",
  });

  const accessTtlSeconds = 15 * 60;

  await redisClient.set(
    `${REDIS_KEYS.accessTokenKey}:${payload.id}`,
    accessToken,
    {
      EX: accessTtlSeconds,
    }
  );

  return accessToken;
}

export function validateAccessToken(
  token: string
): JwtPayload & JwtPayloadOptions {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? "") as JwtPayload &
    JwtPayloadOptions;
}

export function validateRefreshToken(
  token: string
): JwtPayload & JwtPayloadOptions {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? "") as JwtPayload &
    JwtPayloadOptions;
}
