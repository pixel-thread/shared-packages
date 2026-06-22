/**
 * @file Init command — generates a default `pixelthread.json` in the consumer project.
 *
 * The consumer must run `shared-packages init` before running `add`. This ensures
 * path mappings exist so the CLI can resolve `${pathKey}` target templates.
 */

import fs from 'fs-extra';
import path from 'node:path';
import { DEFAULT_CONSUMER_CONFIG, CONFIG_FILENAME } from '../utils/consumer-config';

/**
 * Writes a default `pixelthread.json` to the given project directory.
 *
 * Skips silently if the file already exists.
 *
 * @param projectRoot - Absolute path to the consumer project root.
 */
export async function initConfig(projectRoot: string): Promise<void> {
  const configPath = path.join(projectRoot, CONFIG_FILENAME);

  if (await fs.pathExists(configPath)) {
    console.log(`${CONFIG_FILENAME} already exists — nothing to do.`);
    return;
  }

  await fs.writeJson(configPath, DEFAULT_CONSUMER_CONFIG, { spaces: 2 });
  console.log(`Created ${CONFIG_FILENAME} with default paths.`);
}
