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
 * When targets use the `${pathKey}/filename.ext` syntax, the CLI resolves
 * the path prefix from the consumer's `pixelthread.json`.
 *
 * @example
 * ```ts
 * const item: RegistryItem = {
 *   name: "user-schema",
 *   description: "Zod schema and types for creating a user.",
 *   files: [{ source: "src/items/user-schema/user.schema.ts", target: "validation/user.schema.ts" }],
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

/**
 * Consumer-side configuration file (`pixelthread.json`).
 *
 * Defines path mappings and import aliases that the CLI uses to resolve
 * item target paths. Modelled after shadcn's `components.json`.
 *
 * @example
 * ```json
 * {
 *   "aliases": { "@shared/*": ["src/shared/*"] },
 *   "paths": { "api": "src/shared/api" }
 * }
 * ```
 */
export type ConsumerConfig = {
  /** Import aliases the consumer should add to their tsconfig paths. */
  aliases: Record<string, string[]>;
  /** File path prefixes resolved by the CLI for `${pathKey}` targets. */
  paths: Record<string, string>;
  /**
   * Prefix used when rewriting registry alias imports.
   *
   * E.g. `"@"` produces `@/shared/errors/api-error` from
   * a registry import `@errors/api-error`.
   */
  alias: string;
};
