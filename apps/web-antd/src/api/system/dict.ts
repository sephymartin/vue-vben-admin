import { requestClient } from '#/api/request';

export interface DictItem {
  label: string;
  value: number | string;
  color?: string;
  disabled?: boolean;
  [type: string]: any;
}

export async function getDictsByTypes(types?: string | string[]) {
  if (!types) {
    return requestClient.get<Map<string, DictItem[]>>(
      '/admin/sys/dict/getByTypes',
    );
  }
  const typesParam = Array.isArray(types) ? types.join(',') : types;
  return requestClient.get<Map<string, DictItem[]>>(
    `/admin/sys/dict/getByTypes?types=${typesParam}`,
  );
}
