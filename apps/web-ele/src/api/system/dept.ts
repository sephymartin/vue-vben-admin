import { requestClient } from '#/api/request';

export namespace SystemDeptApi {
  export interface SystemDept {
    [key: string]: any;
    children?: SystemDept[];
    id: string;
    name: string;
    remark?: string;
    status: 0 | 1;
  }
}

/**
 * 部门数据适配器
 * 将后端返回的 deptLabel 字段转换为前端期望的 name 字段
 */
function adaptDeptData(data: any[]): SystemDeptApi.SystemDept[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map((item) => ({
    ...item,
    name: item.deptLabel || item.name,
    children: item.children ? adaptDeptData(item.children) : undefined,
  }));
}

/**
 * 获取部门列表数据
 */
async function getDeptList() {
  return requestClient.get<Array<SystemDeptApi.SystemDept>>(
    '/admin/sys/dept/tree',
  );
}

/**
 * 创建部门
 * @param data 部门数据
 */
async function createDept(
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'id'>,
) {
  return requestClient.post('/system/dept', data);
}

/**
 * 更新部门
 *
 * @param id 部门 ID
 * @param data 部门数据
 */
async function updateDept(
  id: string,
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'id'>,
) {
  return requestClient.put(`/system/dept/${id}`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteDept(id: string) {
  return requestClient.delete(`/system/dept/${id}`);
}

export { adaptDeptData, createDept, deleteDept, getDeptList, updateDept };
