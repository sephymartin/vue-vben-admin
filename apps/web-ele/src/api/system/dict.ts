import type { Recordable } from '@vben/types';

import type { BackendPagingResult } from '#/api/types';

import { requestClient } from '#/api/request';
import { transformPagingResult } from '#/api/types';

export namespace DictApi {
  export interface DictType {
    [key: string]: any;
    id: number;
    typeCode: string;
    typeName: string;
    parentTypeCode?: string;
    typeDesc?: string;
    sortOrder?: number;
    enabled: boolean;
    sysBuildIn?: boolean;
    createdTime?: string;
  }

  export interface DictItem {
    [key: string]: any;
    id: number;
    typeCode: string;
    itemCode: string;
    itemLabel: string;
    parentItemCode?: string;
    itemValue?: string;
    itemDesc?: string;
    sortOrder?: number;
    enabled: boolean;
    sysBuildIn?: boolean;
    createdTime?: string;
  }

  export interface CreateDictTypeParams {
    typeCode: string;
    typeName: string;
    parentTypeCode?: string;
    typeDesc?: string;
    sortOrder?: number;
    enabled?: boolean;
  }

  export interface UpdateDictTypeParams {
    id: number;
    typeCode?: string;
    typeName?: string;
    parentTypeCode?: string;
    typeDesc?: string;
    sortOrder?: number;
    enabled?: boolean;
  }

  export interface CreateDictItemParams {
    typeCode: string;
    itemCode: string;
    itemLabel: string;
    parentItemCode?: string;
    itemValue?: string;
    itemDesc?: string;
    sortOrder?: number;
    enabled?: boolean;
  }

  export interface UpdateDictItemParams {
    id: number;
    typeCode?: string;
    itemCode?: string;
    itemLabel?: string;
    parentItemCode?: string;
    itemValue?: string;
    itemDesc?: string;
    sortOrder?: number;
    enabled?: boolean;
  }
}

// ========== 字典分类 API ==========

/**
 * 获取字典分类列表（全量，用于下拉选择等场景）
 */
async function getDictTypeList() {
  return requestClient.get<DictApi.DictType[]>('/admin/sys/dict/type/list');
}

/**
 * 分页查询字典分类列表
 */
async function queryDictTypes(params: Recordable<any>) {
  const res = await requestClient.post<BackendPagingResult<DictApi.DictType>>(
    '/admin/sys/dict/type/query',
    params,
  );
  return transformPagingResult(res);
}

async function createDictType(data: DictApi.CreateDictTypeParams) {
  return requestClient.post('/admin/sys/dict/type/add', data);
}

async function updateDictType(data: DictApi.UpdateDictTypeParams) {
  return requestClient.post('/admin/sys/dict/type/update', data);
}

async function deleteDictType(id: number) {
  return requestClient.post('/admin/sys/dict/type/delete', null, {
    params: { id },
  });
}

// ========== 字典明细 API ==========

async function getDictItemList(typeCode: string) {
  return requestClient.get<DictApi.DictItem[]>('/admin/sys/dict/item/list', {
    params: { typeCode },
  });
}

async function createDictItem(data: DictApi.CreateDictItemParams) {
  return requestClient.post('/admin/sys/dict/item/add', data);
}

async function updateDictItem(data: DictApi.UpdateDictItemParams) {
  return requestClient.post('/admin/sys/dict/item/update', data);
}

async function deleteDictItem(id: number) {
  return requestClient.post('/admin/sys/dict/item/delete', null, {
    params: { id },
  });
}

export {
  createDictItem,
  createDictType,
  deleteDictItem,
  deleteDictType,
  getDictItemList,
  getDictTypeList,
  queryDictTypes,
  updateDictItem,
  updateDictType,
};
