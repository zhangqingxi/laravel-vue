import { useGlobSetting } from '@/hooks/setting';
import { useCacheSettingsStoreWithOut } from '@/store/modules/cache';
import { isDevMode } from '@/utils/env';

const { cacheIv, cacheKey } = useGlobSetting();

// aes encryption key
export const cacheCipher = {
  key: cacheKey,
  iv: cacheIv,
};

export function setCacheTime(time: number) {
  const cacheSettingsStore = useCacheSettingsStoreWithOut();
  cacheSettingsStore.setCacheTime(parseInt(time));
}

export function getCacheTime(): number {
  const cacheSettingsStore = useCacheSettingsStoreWithOut();
  return parseInt(cacheSettingsStore.defaultCacheTime);
}

// Whether the system cache is encrypted using aes
export const SHOULD_ENABLE_STORAGE_ENCRYPTION = !isDevMode();
