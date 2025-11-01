import type { Square } from "chess.js";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const SQUARE_REGEX = /^[a-h][1-8]$/;

/**
 * Convert board indices to an algebraic Square (strict).
 * @param row - 0 (top) to 7 (bottom)
 * @param col - 0 (left) to 7 (right)
 * @throws Error if indices are out of range
 */
export function convertToSquare(row: number, col: number): Square {
  if (!Number.isInteger(row) || !Number.isInteger(col))
    throw new Error("row and col must be integers");

  if (row < 0 || row > 7 || col < 0 || col > 7)
    throw new Error("row and col must be between 0 and 7");

  const file = FILES[col];
  const rank = 8 - row; // ranks 8..1
  const square = `${file}${rank}`;

  if (!SQUARE_REGEX.test(square))
    throw new Error(`Converted square "${square}" is invalid`);

  return square as Square;
}

/**
 * Convert algebraic Square to board indices.
 * @param square - must be a valid Square (chess.js type)
 */
export function squareToIndices(square: Square): { row: number; col: number } {
  if (!SQUARE_REGEX.test(square))
    throw new Error(`"${square}" is not a valid square`);

  const file = square[0];
  const rank = parseInt(square[1], 10);

  const col = FILES.indexOf(file);
  const row = 8 - rank;

  return { row, col };
}

/**
 * Safe converter from arbitrary string to Square type.
 * Returns the Square when valid, otherwise null (no throw).
 */
export function safeSquareFromString(s: string): Square | null {
  if (typeof s !== "string") return null;
  const normalized = s.trim().toLowerCase();
  return SQUARE_REGEX.test(normalized) ? (normalized as Square) : null;
}
