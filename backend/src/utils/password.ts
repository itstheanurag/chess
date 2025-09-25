import crypto from "crypto";

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

/**
 * Hash a password securely using PBKDF2.
 * Returns a string containing salt + hash in format: salt:hash
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return `${salt}:${hash}`;
}

/**
 * Compare a plain password with the stored salt+hash.
 */
export function comparePassword(password: string, dbPassword: string): boolean {
  const [salt, originalHash] = dbPassword.split(":");

  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(originalHash, "hex"),
    Buffer.from(hash, "hex")
  );
}
