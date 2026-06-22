/**
 * @file Registry type definitions.
 *
 * These types model the structure of `registry.json` and are used
 * throughout the CLI for type-safe item lookups and file copying.
 */

/**
 * Represents a single file mapping from the registry source to the consumer target.
 *
 * @example
 * ```ts
 * const file: RegistryFile = {
 *   source: "src/items/user-schema/user.schema.ts",
 *   target: "src/shared/validation/user.schema.ts",
 * };
 * ```
 */
export type RegistryFile = {
  /** Path relative to the package root where the source file lives. */
  source: string;
  /** Destination path relative to the consumer project root. */
  target: string;
};

/**
 * Represents a registry item that can be installed into a project.
 *
 * Each item declares one or more source files, their destination paths,
 * and optional npm dependencies that must be installed for the code to work.
 *
 * @example
 * ```ts
 * const item: RegistryItem = {
 *   name: "user-schema",
 *   description: "Zod schema and types for creating a user.",
 *   files: [{ source: "src/items/user-schema/user.schema.ts", target: "src/shared/validation/user.schema.ts" }],
 *   dependencies: ["zod"],
 * };
 * ```
 */
export type RegistryItem = {
  /** Unique CLI name used to reference this item (e.g. `user-schema`). */
  name: string;
  /** Human-readable description shown in the list command. */
  description: string;
  /** Files copied when this item is installed. */
  files: RegistryFile[];
  /** npm packages required by the item's source code. */
  dependencies?: string[];
  /** Other registry items that must be installed before this one. */
  itemDependencies?: string[];
};

/**
 * Top-level structure of the registry.json file.
 *
 * @example
 * ```ts
 * const registry: Registry = {
 *   name: "@pixel-thread/shared-packages",
 *   version: "1.0.0",
 *   items: [...],
 * };
 * ```
 */
export type Registry = {
  /** Package name (e.g. @pixel-thread/shared-packages). */
  name: string;
  /** Registry schema version. */
  version: string;
  /** All distributable items. */
  items: RegistryItem[];
};
