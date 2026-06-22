
import { SftpStorageProvider } from './sftp';
import { SupabaseStorageProvider } from './supabase';

export function getStorageProvider() {
  const provider = process.env.STORAGE_PROVIDER;

  switch (provider) {
    case 'sftp':
      return new SftpStorageProvider();
    case 'supabase':
    default:
      return new SupabaseStorageProvider();
  }
}
