import type { SelectOption } from '@vben/types';

import { defineStore } from 'pinia';

import { getDictsByTypes } from '#/api/system/dict';

interface DictState {
  dictCache: Map<string, SelectOption[]>;
  isInitialized: boolean;
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dictCache: new Map(),
    isInitialized: false,
  }),

  actions: {
    async initDicts() {
      if (this.isInitialized) return;
      try {
        const dicts = await getDictsByTypes();
        // Convert the API response to a Map
        this.dictCache = new Map(Object.entries(dicts));
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to initialize dicts:', error);
      }
    },

    getDictItems(type: string): SelectOption[] {
      return this.dictCache.get(type) || [];
    },

    getDictLabel(type: string, value: number | string): string {
      const items = this.getDictItems(type);
      const item = items.find((item) => item.value === value);
      return item ? item.label : String(value);
    },
  },
});
