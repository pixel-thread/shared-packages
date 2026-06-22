import type { StorageProvider } from './types';

const providers = new Map<string, () => StorageProvider>();

export function registerProvider(name: string, factory: () => StorageProvider) {
  providers.set(name, factory);
}

export function getStorageProvider(): StorageProvider {
  const name = process.env.STORAGE_PROVIDER ?? 'supabase';
  const factory = providers.get(name);
  if (!factory) {
    throw new Error(
      `Storage provider "${name}" is not registered. ` +
        'Add the corresponding item and register it with registerProvider().',
    );
  }
  return factory();
}
