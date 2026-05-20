import { createHash } from "crypto";
import { readFile } from "fs/promises";

/**
 * Hash a file's contents using SHA-256 and return as a hex string.
 */
export async function hashFile(filePath: string): Promise<string> {
  const fileBuffer = await readFile(filePath);
  return hashBuffer(fileBuffer);
}

/**
 * Hash a Buffer using SHA-256 and return as a hex string prefixed with 0x.
 */
export function hashBuffer(buffer: Buffer): string {
  const hash = createHash("sha256").update(buffer).digest("hex");
  return `0x${hash}`;
}

/**
 * Hash metadata object deterministically.
 * Sorts keys to ensure consistent hashing regardless of property order.
 */
export function hashMetadata(metadata: Record<string, unknown>): string {
  const sorted = JSON.stringify(metadata, Object.keys(metadata).sort());
  const hash = createHash("sha256").update(sorted).digest("hex");
  return `0x${hash}`;
}
