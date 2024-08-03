// src/stores/cacheSettingsStore.js
import { useGlobSetting } from '@/hooks/setting';
import { defineStore } from 'pinia';
import { store } from '@/store';

const { cacheTime } = useGlobSetting();

export const useCacheSettingsStore = defineStore({
  id: 'app-cache',
  state: () => ({
    defaultCacheTime: cacheTime,
  }),
  actions: {
    setCacheTime(time: number) {
      this.defaultCacheTime = time;
    },
  },
});

export function useCacheSettingsStoreWithOut() {
  return useCacheSettingsStore(store);
}
