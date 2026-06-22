/**
 * @file Import path transformer for registry templates.
 *
 * Rewrites registry alias imports (e.g. `@errors/api-error`) into
 * consumer-relative paths (e.g. `@/shared/errors/api-error`) using
 * the mappings defined in the consumer's `pixelthread.json`.
 *
 * Supports:
 * - Static imports:    `import { X } from '@errors/api-error'`
 * - Export-from:       `export { X } from '@errors/api-error'`
 * - Dynamic imports:   `import('@errors/api-error')`
 * - Type-only imports: `import type { X } from '@errors/api-error'`
 *
 * Relative imports (`./foo`, `../bar`) are left untouched.
 */

import type { ConsumerConfig } from '../types/index';

/**
 * Transforms registry alias imports in `content` using the consumer config.
 *
 * For each import specifier that matches `@<pathKey>/<rest>`, the path key
 * is looked up in `config.paths`, the leading `src/` is stripped if present,
 * and the consumer's `config.alias` is prepended.
 *
 * Non-matching and relative imports are preserved as-is.
 *
 * @param content - The raw source text of a registry template file.
 * @param config  - Consumer config (paths map + alias prefix).
 * @returns The source text with all registry alias imports rewritten.
 *
 * @example
 * ```ts
 * const result = transformImports(
 *   `import { ApiError } from '@errors/api-error'`,
 *   { alias: '@', paths: { errors: 'src/shared/errors' } }
 * );
 * // result: `import { ApiError } from '@/shared/errors/api-error'`
 * ```
 */
export function transformImports(content: string, config: ConsumerConfig): string {
  const pathKeys = Object.keys(config.paths).sort((a, b) => b.length - a.length);

  if (pathKeys.length === 0) {
    return content;
  }

  const keysPattern = pathKeys.map((k) => escapeRegex(k)).join('|');
  const specifierPattern = new RegExp(`(['"])@(${keysPattern})/([^'"]+)\\1`, 'g');

  return content.replace(specifierPattern, (_match, quote, key, rest) => {
    const prefix = config.paths[key];
    const consumerPath = prefix.replace(/^src\//, '');
    return `${quote}${config.alias}/${consumerPath}/${rest}${quote}`;
  });
}

/**
 * Escapes special regex characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
