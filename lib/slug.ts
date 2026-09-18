import { customAlphabet } from "nanoid";

// URL-safe alphanumeric, 8 chars — 36^8 = ~2.8 trillion combinations
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);

export function generateSlug(): string {
  return nanoid();
}
