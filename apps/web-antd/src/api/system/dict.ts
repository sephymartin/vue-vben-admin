import type { SelectOption } from '@vben/types';

import { requestClient } from '#/api/request';

export async function getDictsByTypes(types?: string | string[]) {
  if (!types) {
    return requestClient.get<Map<string, SelectOption[]>>(
      '/admin/sys/dict/getByTypes',
    );
  }
  const typesParam = Array.isArray(types) ? types.join(',') : types;
  return requestClient.get<Map<string, SelectOption[]>>(
    `/admin/sys/dict/getByTypes?types=${typesParam}`,
  );
}
