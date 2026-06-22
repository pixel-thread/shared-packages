import fs from 'fs-extra';
import path from 'node:path';

export type PackageManager = 'pnpm' | 'yarn' | 'npm';

export async function detectPackageManager(projectRoot: string): Promise<PackageManager> {
  if (await fs.pathExists(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (await fs.pathExists(path.join(projectRoot, 'yarn.lock'))) {
    return 'yarn';
  }

  return 'npm';
}
