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
 * Also handles internal source prefixes that don't match consumer path keys:
 * - `@items/errors/http-errors`  → strips `items/`  → matches `errors` path key
 * - `@src/items/errors`          → strips `src/items/` → matches `errors` path key
 * - `@src/shared/constants`      → strips `src/`    → no path key match → preserved for consumer tsconfig alias
 *
 * Relative imports (`./foo`, `../bar`) are left untouched.
 */

import type { ConsumerConfig } from '../types/index';

/**
 * Transforms registry alias imports in `content` using the consumer config.
 *
 * For each import specifier that matches `@<specifier>`, internal source
 * prefixes (`src/`, `items/`) are stripped and the result is checked
 * against the consumer's path keys. If matched, the consumer's path prefix
 * and alias are used. Non-matching specifiers are preserved as-is (the
 * consumer's tsconfig aliases handle them).
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

  const specifierPattern = /(['"])@([^'"]+)\1/g;

  return content.replace(specifierPattern, (_match, quote, specifier) => {
    const cleaned = specifier.replace(/^(src\/)?(items\/)?/, '');

    for (const key of pathKeys) {
      if (cleaned === key || cleaned.startsWith(key + '/')) {
        const rest = cleaned.slice(key.length + 1);
        const prefix = config.paths[key].replace(/^src\//, '');
        const consumerPath = rest ? `${prefix}/${rest}` : prefix;
        return `${quote}${config.alias}/${consumerPath}${quote}`;
      }
    }

    return `${quote}@${cleaned}${quote}`;
  });
}
