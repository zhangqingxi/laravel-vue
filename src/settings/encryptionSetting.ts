import { useGlobSetting } from '@/hooks/setting';
import { useCacheSettingsStoreWithOut } from '@/store/modules/cache';
import { isDevMode } from '@/utils/env';

const { cacheIv, cacheKey, cacheTime } = useGlobSetting();

// System default cache time, in seconds
export const DEFAULT_CACHE_TIME = cacheTime;

// aes encryption key
export const cacheCipher = {
  key: cacheKey,
  iv: cacheIv,
};

export function setCacheTime(time: number) {
  const cacheSettingsStore = useCacheSettingsStoreWithOut();
  cacheSettingsStore.setCacheTime(time);
}

export function getCacheTime(): number {
  const cacheSettingsStore = useCacheSettingsStoreWithOut();
  return cacheSettingsStore.defaultCacheTime;
}

// Whether the system cache is encrypted using aes
export const SHOULD_ENABLE_STORAGE_ENCRYPTION = !isDevMode();
