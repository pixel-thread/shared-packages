import path from 'node:path';

import SftpClient from 'ssh2-sftp-client';

import type { StorageProvider, UploadParams, UploadResult } from '../types';

function getSftpConfig() {
  return {
    host: process.env.SFTP_HOST! as string,
    port: process.env.SFTP_PORT! as unknown as number,
    timeout: process.env.SFTP_TIMEOUT! as unknown as number,
    username: process.env.SFTP_USERNAME!,
    password: process.env.SFTP_PASSWORD!,
    readyTimeout: process.env.SFTP_TIMEOUT! as unknown as number,
  };
}

export class SftpStorageProvider implements StorageProvider {
  async upload(params: UploadParams): Promise<UploadResult> {
    const sftp = new SftpClient('upload-client');
    const config = getSftpConfig();

    try {
      await sftp.connect(config);
    } catch (error) {
      await sftp.end().catch(() => {});
      throw error;
    }

    const key = `${params.folder}/${Date.now()}-${params.fileName}`;
    const remotePath = path.posix.join(
      '/',
      process.env.SFTP_ROOT!,
      process.env.STORAGE_BUCKET!,
      key,
    );
    const remoteDir = path.posix.dirname(remotePath);

    try {
      await sftp.mkdir(remoteDir, true);

      await sftp.put(params.fileBuffer, remotePath);
    } catch (error) {
      throw error;
    } finally {
      await sftp.end();
    }

    const url = key;

    return { key, url };
  }

  async delete(fileKey: string) {
    const sftp = new SftpClient('delete-client');

    try {
      await sftp.connect(getSftpConfig());
      await sftp.delete(
        path.posix.join('/', process.env.SFTP_ROOT!, process.env.STORAGE_BUCKET!, fileKey),
      );
    } finally {
      await sftp.end().catch(() => {});
    }
  }

  async getPublicUrl(fileKey: string) {
    return `${process.env.SFTP_HOST}${path.posix.join('/', process.env.SFTP_ROOT!, process.env.STORAGE_BUCKET!, fileKey)}`;
  }
}
