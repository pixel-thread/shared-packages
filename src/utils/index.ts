/**
 * @file Utility helpers shared across the CLI.
 *
 * Currently provides package manager detection. Add shared helpers here
 * as the CLI grows (e.g. logging, path sanitisation, file prompts).
 */

import fs from 'fs-extra';
import path from 'node:path';

/** Supported package managers that the CLI can auto-detect. */
export type PackageManager = 'pnpm' | 'yarn' | 'npm';

/**
 * Detects which package manager a project uses based on its lock file.
 *
 * Checks for lock files in order of preference:
 * 1. `pnpm-lock.yaml` → `pnpm`
 * 2. `yarn.lock`      → `yarn`
 * 3. _(none found)_    → `npm`
 *
 * @param projectRoot - Absolute path to the consumer project root.
 * @returns The detected package manager name.
 *
 * @example
 * ```ts
 * const pm = await detectPackageManager("/path/to/project");
 * // => "pnpm"
 * ```
 */
export async function detectPackageManager(projectRoot: string): Promise<PackageManager> {
  if (await fs.pathExists(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (await fs.pathExists(path.join(projectRoot, 'yarn.lock'))) {
    return 'yarn';
  }

  return 'npm';
}
