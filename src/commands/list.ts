/**
 * @file List command — displays all available registry items.
 *
 * Triggered by `shared-packages list`. Iterates over every item in the
 * registry and prints its name and description to stdout.
 */

import type { Registry } from "../types/index.js";

/**
 * Lists all available registry items to the console.
 *
 * Each item is printed on its own line in the format:
 * ```
 * <name> - <description>
 * ```
 *
 * @param registry - The loaded Registry object.
 *
 * @example
 * ```ts
 * listItems(registry);
 * // user-schema - Zod schema and types for creating a user.
 * // api-error - Reusable HTTP API error class.
 * ```
 */
export function listItems(registry: Registry): void {
  for (const item of registry.items) {
    console.log(`${item.name} - ${item.description}`);
  }
}
