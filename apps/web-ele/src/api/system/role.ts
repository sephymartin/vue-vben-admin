import type { Recordable } from '@vben/types';

import type { BackendPagingResult } from '#/api/types';

import { requestClient } from '#/api/request';
import { transformPagingResult } from '#/api/types';

/**
 * 后端返回的角色 DTO
 */
interface SysRoleDTO {
  id: number;
  roleCode: string;
  roleLabel: string;
  roleStatus: string;
}

export namespace SystemRoleApi {
  /**
   * 前端使用的角色接口
   * 字段映射：roleLabel -> name (角色名称), roleCode -> code (角色代码), roleStatus -> status
   */
  export interface SystemRole {
    [key: string]: any;
    id: number;
    name: string; // 映射自 roleLabel (角色名称)
    code?: string; // 映射自 roleCode (角色代码)
    permissions?: string[];
    remark?: string;
    status: 0 | 1 | string; // 映射自 roleStatus，支持字符串 "ENABLED"/"DISABLED" 或数字 0/1
    // 后端原始字段（可选，用于调试）
    roleCode?: string;
    roleLabel?: string;
    roleStatus?: string;
  }

  /**
   * 角色详情（包含关联的权限ID列表）
   */
  export interface RoleDetail extends SystemRole {
    permissionIds?: number[];
  }

  export interface RoleStatusParams {
    roleId: number;
    roleStatus: string;
  }
}

/**
 * 将后端角色 DTO 转换为前端格式
 */
function mapRoleFromBackend(backendRole: SysRoleDTO): SystemRoleApi.SystemRole {
  // roleStatus 转换：支持 "ENABLED"/"DISABLED" 或字典值
  // 如果后端返回的是字典值（如 "0"/"1"），转换为 "ENABLED"/"DISABLED"
  let status: string;
  const roleStatusUpper = backendRole.roleStatus.toUpperCase();
  if (roleStatusUpper === 'ENABLED' || roleStatusUpper === '1') {
    status = 'ENABLED';
  } else if (roleStatusUpper === 'DISABLED' || roleStatusUpper === '0') {
    status = 'DISABLED';
  } else {
    // 默认使用原始值
    status = backendRole.roleStatus;
  }

  return {
    id: backendRole.id,
    name: backendRole.roleLabel, // 角色名称映射自 roleLabel
    code: backendRole.roleCode, // 角色代码映射自 roleCode
    status,
    // 保留原始字段
    roleCode: backendRole.roleCode,
    roleLabel: backendRole.roleLabel,
    roleStatus: backendRole.roleStatus,
  };
}

/**
 * 获取角色列表数据
 */
async function getRoleList(params: Recordable<any>) {
  // 转换前端分页参数：page -> pageNum
  // 支持两种格式：
  // 1. { page: number, pageSize: number } - 来自 vxe-table
  // 2. { pageNum: number, pageSize: number } - 直接调用
  const { page, pageSize, pageNum, ...otherParams } = params;
  const queryParams = {
    pageNum: pageNum ?? page ?? 1,
    pageSize: pageSize ?? 10,
    ...otherParams,
  };

  const res = await requestClient.post<BackendPagingResult<SysRoleDTO>>(
    '/admin/sys/role/query',
    queryParams,
  );

  // 转换分页结果并映射字段
  const transformed = transformPagingResult({
    list: res.list.map(mapRoleFromBackend),
    total: res.total,
  });

  return transformed;
}

/**
 * 创建角色
 * @param data 角色数据
 */
async function createRole(data: Omit<SystemRoleApi.SystemRole, 'id'>) {
  // 将前端字段映射回后端字段
  const backendData = {
    code: data.code ?? data.name, // roleCode
    name: data.name, // roleLabel (角色名称)
    status: data.status?.toString(), // roleStatus
    remark: data.remark,
    permissions: data.permissions, // 权限ID列表
  };
  return requestClient.post('/admin/sys/role/add', backendData);
}

/**
 * 更新角色
 *
 * @param id 角色 ID
 * @param data 角色数据
 */
async function updateRole(
  id: number,
  data: Partial<Omit<SystemRoleApi.SystemRole, 'id'>>,
) {
  // 将前端字段映射回后端字段
  const backendData = {
    id,
    code: data.code ?? data.name, // roleCode
    name: data.name, // roleLabel (角色名称)
    status: data.status?.toString(), // roleStatus
    remark: data.remark,
    permissions: data.permissions, // 权限ID列表
  };
  return requestClient.post('/admin/sys/role/update', backendData);
}

/**
 * 删除角色
 * @param id 角色 ID
 * @todo 后端尚未实现此端点，待后端添加 /admin/sys/role/delete 端点后更新
 */
async function deleteRole(id: number) {
  return requestClient.post('/admin/sys/role/delete', null, {
    params: { id },
  });
}

/**
 * 修改角色状态
 */
async function updateRoleStatus(data: SystemRoleApi.RoleStatusParams) {
  return requestClient.post('/admin/sys/role/updateRoleStatus', data);
}

/**
 * 获取角色详情（包含关联的权限ID列表）
 * @param roleId 角色ID
 */
async function getRoleDetail(roleId: number) {
  const res = await requestClient.get<
    SysRoleDTO & { permissionIds?: number[] }
  >('/admin/sys/role/getPermission', {
    params: { roleId },
  });

  // 映射字段
  const mapped = mapRoleFromBackend(res);
  return {
    ...mapped,
    permissionIds: res.permissionIds || [],
  } as SystemRoleApi.RoleDetail;
}

export {
  createRole,
  deleteRole,
  getRoleDetail,
  getRoleList,
  updateRole,
  updateRoleStatus,
};
