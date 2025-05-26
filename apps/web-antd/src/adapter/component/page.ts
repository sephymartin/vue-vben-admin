import type { Recordable } from '@vben/types';

export interface StandardPageResult<T> {
  items: T[];
  total: number;
}

export interface SourcePageResult<T> {
  list: T[];
  total: number;
}

export const PageResultAdapter = {
  transform<T = Recordable>(
    result: SourcePageResult<T>,
  ): StandardPageResult<T> {
    return {
      items: result.list || [],
      total: result.total || 0,
    };
  },
};
