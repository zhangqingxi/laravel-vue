import { Persistent, BasicKeys } from '@/utils/cache/persistent';
import { CacheTypeEnum, TOKEN_KEY } from '@/enums/cacheEnum';
import projectSetting from '@/settings/projectSetting';
import { createStorage } from '../cache/storageCache';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value: any) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}

export function setCache(key: BasicKeys, value: any, expired?: number | null) {
  const ls = createStorage();
  ls.set(key, value, expired);
}

export function getCache<T>(key: BasicKeys) {
  const ls = createStorage();
  return ls.get(key) as T;
}
