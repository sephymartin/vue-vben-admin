import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户权限列表
 */
export async function getUserPermissionsApi() {
  return requestClient.get<string[]>('/admin/user/permissions');
}

/**
 * 获取用户所有菜单
 * @deprecated 已废弃，前端路由已代码化，请使用 getUserPermissionsApi
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>(
    '/admin/user/getRouter',
  );
}
