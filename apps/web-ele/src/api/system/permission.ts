import { requestClient } from '#/api/request';

/**
 * 系统权限接口
 */
export namespace SystemPermissionApi {
  /**
   * 权限类型
   */
  export type PermissionType = 'api' | 'button' | 'menu';

  /**
   * 系统权限
   */
  export interface SystemPermission {
    /**
     * 权限ID
     */
    id: number;
    /**
     * 父权限ID
     */
    parentId: number;
    /**
     * 权限代码
     */
    permissionCode: string;
    /**
     * 权限名称
     */
    permissionName: string;
    /**
     * 权限类型
     */
    permissionType: PermissionType;
    /**
     * 显示顺序
     */
    sort?: number;
    /**
     * 权限状态（0-禁用，1-启用）
     */
    statusCode?: boolean;
    /**
     * 子权限列表
     */
    children?: SystemPermission[];
  }
}

/**
 * 获取权限列表（树形结构）
 */
async function getPermissionList() {
  return requestClient.get<SystemPermissionApi.SystemPermission[]>(
    '/admin/sys/permission/list',
  );
}

export { getPermissionList };
