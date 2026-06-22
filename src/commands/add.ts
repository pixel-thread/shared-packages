/**
 * @file Add command — installs a registry item into the consumer project.
 *
 * Triggered by `shared-packages add <item-name>`. Copies each declared source
 * file from the registry to the consumer's project directory at the configured
 * target path, then optionally installs npm dependencies.
 *
 * ## Safety
 *
 * - Validates that all target paths stay within the consumer project directory
 *   (path-traversal prevention).
 * - Skips existing files unless `--overwrite` is passed.
 * - Checks that every declared source file actually exists in the registry
 *   before copying.
 */

import fs from "fs-extra";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getPackageRoot } from "../registry/index";
import type { RegistryItem } from "../types/index";
import { detectPackageManager } from "../utils/index";

const execFileAsync = promisify(execFile);

/** Options that control how the add command behaves. */
export type AddOptions = {
  /**
   * Overwrite existing target files without warning.
   *
   * When `false` (default), files that already exist at the target path are
   * skipped and a warning is printed. When `true`, they are silently replaced.
   */
  overwrite?: boolean;

  /**
   * Skip automatic dependency installation.
   *
   * When `true`, the CLI will not run `npm install` / `pnpm add` etc. for
   * the item's declared `dependencies`. Useful for dry-runs or CI environments.
   */
  skipInstall?: boolean;
};

/**
 * Installs a registry item into the current project.
 *
 * For each file declared in the item:
 * 1. Resolves the source path inside the registry package.
 * 2. Validates the target path stays within the consumer project.
 * 3. Verifies the source file exists.
 * 4. Creates the target directory if needed.
 * 5. Copies the file (or skips if it exists and `overwrite` is false).
 *
 * After all files are copied, installs declared npm dependencies unless
 * `skipInstall` is set.
 *
 * @param item - The registry item to install.
 * @param options - Behaviour flags (overwrite, skipInstall).
 *
 * @throws If a declared source file is missing in the registry.
 * @throws If a target path attempts to escape the consumer project directory.
 *
 * @example
 * ```ts
 * const item = findItem(registry, "user-schema");
 * if (item) {
 *   await addItem(item, { overwrite: false, skipInstall: false });
 * }
 * ```
 */
export async function addItem(item: RegistryItem, options: AddOptions): Promise<void> {
  const packageRoot = getPackageRoot();
  const projectRoot = process.cwd();

  for (const file of item.files) {
    const sourcePath = path.join(packageRoot, file.source);
    const targetPath = path.resolve(projectRoot, file.target);

    // Prevent path-traversal — every target must live under the project root.
    if (!targetPath.startsWith(`${projectRoot}${path.sep}`)) {
      throw new Error(
        `Invalid target path: ${file.target}. Path escapes the project directory.`,
      );
    }

    if (!(await fs.pathExists(sourcePath))) {
      throw new Error(
        `Registry source file is missing: ${file.source}. ` +
        `Verify the file exists in the registry package.`,
      );
    }

    if ((await fs.pathExists(targetPath)) && !options.overwrite) {
      console.warn(
        `Skipped ${file.target}: it already exists. Use --overwrite to replace it.`,
      );
      continue;
    }

    await fs.ensureDir(path.dirname(targetPath));
    await fs.copy(sourcePath, targetPath, {
      overwrite: options.overwrite ?? false,
    });

    console.log(`Added ${file.target}`);
  }

  if (!options.skipInstall && item.dependencies?.length) {
    const packageManager = await detectPackageManager(projectRoot);

    console.log(
      `Installing dependencies with ${packageManager}: ${item.dependencies.join(", ")}`,
    );

    await execFileAsync(packageManager, ["add", ...item.dependencies], {
      cwd: projectRoot,
    });
  }
}
