/**
 * @file Registry loader and item lookup.
 *
 * Responsible for reading and parsing `registryon` from the package root,
 * resolving paths correctly in both development (`tsx`) and production (compiled JS).
 */

import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Registry, RegistryItem } from "../types/index";

/**
 * Resolves the absolute path to the package root directory.
 *
 * Uses `import.meta.url` to locate the current module's location on disk,
 * then traverses up to the package root. The number of parent directories
 * depends on the depth of this module within `dist/`.
 *
 * @returns The absolute path to the package root directory.
 *
 * @example
 * ```ts
 * const root = getPackageRoot();
 * // => "/Users/me/projects/shared-packages"
 * ```
 */
export function getPackageRoot(): string {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirectory = path.dirname(currentFilePath);
  return path.resolve(currentDirectory, "..", "..");
}

/**
 * Loads and parses the registryon file from the package root.
 *
 * Reads the file synchronously at startup so the CLI is ready immediately.
 * The registry object is treated as the source of truth for all available items.
 *
 * @returns The parsed Registry object.
 * @throws If registryon is missing or malformed.
 *
 * @example
 * ```ts
 * const registry = loadRegistry();
 * console.log(registry.items.length); // => 3
 * ```
 */
export function loadRegistry(): Registry {
  const packageRoot = getPackageRoot();
  const registryPath = path.join(packageRoot, "registryon");
  return fs.readJsonSync(registryPath) as Registry;
}

/**
 * Looks up a registry item by name.
 *
 * Performs a case-sensitive comparison against each item's `name` field.
 *
 * @param registry - The loaded Registry object.
 * @param name - The item name to find (e.g. `"user-schema"`).
 * @returns The matching RegistryItem, or `undefined` if not found.
 *
 * @example
 * ```ts
 * const item = findItem(registry, "user-schema");
 * if (item) {
 *   console.log(item.description);
 * }
 * ```
 */
export function findItem(registry: Registry, name: string): RegistryItem | undefined {
  return registry.items.find((item) => item.name === name);
}
