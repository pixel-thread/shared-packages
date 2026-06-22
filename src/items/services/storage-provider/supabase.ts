import { supabase as supabaseClient } from '@items/lib/supabase';

import type { StorageProvider, UploadParams, UploadResult } from './types';

export class SupabaseStorageProvider implements StorageProvider {
  private supabase = supabaseClient;

  async upload(params: UploadParams): Promise<UploadResult> {
    const key = `${params.folder}/${Date.now()}-${params.fileName}`;

    const { error } = await this.supabase.storage
      .from(process.env.STORAGE_BUCKET)
      .upload(key, params.fileBuffer, {
        contentType: params.mimeType,
        upsert: true,
        cacheControl: '3600',
      });

    if (error) throw error;

    const { data } = this.supabase.storage.from(process.env.STORAGE_BUCKET).getPublicUrl(key);

    return { key, url: data.publicUrl };
  }

  async delete(fileKey: string) {
    await this.supabase.storage.from(process.env.STORAGE_BUCKET).remove([fileKey]);
  }

  async getPublicUrl(fileKey: string) {
    return this.supabase.storage.from(process.env.STORAGE_BUCKET).getPublicUrl(fileKey).data.publicUrl;
  }
}
