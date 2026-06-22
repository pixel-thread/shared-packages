/**
 * @file Consumer config (`pixelthread.json`) loader.
 *
 * Reads and parses the consumer-side configuration that defines path mappings
 * and import aliases. The CLI requires this file to exist in the consumer
 * project root before running the `add` command.
 */

import fs from 'fs-extra';
import path from 'node:path';
import type { ConsumerConfig } from '../types/index';

/** Name of the consumer config file. */
export const CONFIG_FILENAME = 'pixelthread.json';

/**
 * Default `pixelthread.json` content for the `init` command.
 */
export const DEFAULT_CONSUMER_CONFIG: ConsumerConfig = {
  alias: '@',
  aliases: {
    '@shared/*': ['src/shared/*'],
  },
  paths: {
    api: 'src/shared/api',
    types: 'src/shared/types',
    errors: 'src/shared/errors',
    lib: 'src/shared/lib',
    utils: 'src/shared/utils',
    middleware: 'src/shared/middleware',
    validation: 'src/shared/validation',
    pagination: 'src/shared/pagination',
    logger: 'src/shared/logger',
    'services-storage': 'src/shared/services/storage',
    constants: 'src/shared/constants',
  },
};

/**
 * Loads `pixelthread.json` from the given project directory.
 *
 * @param projectRoot - Absolute path to the consumer project root.
 * @returns The parsed config, or `undefined` if the file does not exist.
 */
export async function loadConsumerConfig(projectRoot: string): Promise<ConsumerConfig | undefined> {
  const configPath = path.join(projectRoot, CONFIG_FILENAME);

  if (!(await fs.pathExists(configPath))) {
    return undefined;
  }

  return fs.readJson(configPath) as Promise<ConsumerConfig>;
}

/**
 * Resolves a registry target path using the consumer config.
 *
 * Handles two formats:
 * - `${pathKey}/filename.ext` — resolved via `config.paths[pathKey]`
 * - `path/to/file.ext` — returned as-is (backward compatible)
 *
 * @param target - The target path from the registry item (e.g. `${api}/http.ts`).
 * @param config - The consumer configuration.
 * @returns The fully resolved target path relative to the consumer project.
 */
export function resolveTarget(target: string, config: ConsumerConfig): string {
  const match = target.match(/^\$\{(\w+)\}\/(.+)$/);

  if (!match) {
    return target;
  }

  const [, pathKey, filename] = match;
  const prefix = config.paths[pathKey];

  if (!prefix) {
    throw new Error(
      `Unknown path key "${pathKey}" in target "${target}". ` +
        `Add it to the "paths" field in ${CONFIG_FILENAME}.`,
    );
  }

  return `${prefix}/${filename}`;
}
