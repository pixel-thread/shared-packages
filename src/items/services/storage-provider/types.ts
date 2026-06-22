export interface UploadParams {
  fileBuffer: Buffer;
  fileName: string;
  folder: string;
  mimeType: string;
}

export interface UploadResult {
  key: string;
  url: string;
}

export interface StorageProvider {
  upload(params: UploadParams): Promise<UploadResult>;
  delete(fileKey: string): Promise<void>;
  getPublicUrl(fileKey: string): Promise<string>;
}
