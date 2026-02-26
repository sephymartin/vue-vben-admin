import type { Recordable } from '@vben/types';

import type { BackendPagingResult } from '#/api/types';

import { requestClient } from '#/api/request';
import { transformPagingResult } from '#/api/types';

export namespace SystemUserApi {
  export interface SystemUser {
    [key: string]: any;
    id: number;
    username: string;
    nickname: string;
    email: string;
    mobile: string;
    avatar: string;
    userStatus: string;
    userStatusName?: string;
    deptId: number;
    roleIds: number[];
    positionIds?: number[];
    createdTime: string;
  }

  export interface UserAddParams {
    username: string;
    pwd?: string;
    email?: string;
    mobile: string;
    gender?: string;
    avatar?: string;
    nickname?: string;
    userStatus?: string;
    deptId?: number;
    positionIds?: number[];
    roleIds?: number[];
    remark?: string;
  }

  export interface UserUpdateParams {
    id: number;
    email?: string;
    mobile?: string;
    avatar?: string;
    nickname?: string;
  }

  export interface UserStatusParams {
    userId: number;
    userStatus: string;
  }
}

/**
 * 获取用户列表数据
 */
async function getUserList(params: Recordable<any>) {
  const res = await requestClient.post<
    BackendPagingResult<SystemUserApi.SystemUser>
  >('/admin/sys/user/query', params);
  return transformPagingResult(res);
}

/**
 * 获取用户详情
 */
async function getUserDetail(userId: number) {
  return requestClient.get<SystemUserApi.SystemUser>('/admin/sys/user/get', {
    params: { userId },
  });
}

/**
 * 添加用户
 */
async function createUser(data: SystemUserApi.UserAddParams) {
  return requestClient.post('/admin/sys/user/add', data);
}

/**
 * 更新用户
 */
async function updateUser(data: SystemUserApi.UserUpdateParams) {
  return requestClient.post('/admin/sys/user/update', data);
}

/**
 * 删除用户
 */
async function deleteUser(userIds: number[]) {
  return requestClient.post('/admin/sys/user/delete', userIds);
}

/**
 * 修改用户状态
 */
async function updateUserStatus(data: SystemUserApi.UserStatusParams) {
  return requestClient.post('/admin/sys/user/updateUserStatus', data);
}

export {
  createUser,
  deleteUser,
  getUserDetail,
  getUserList,
  updateUser,
  updateUserStatus,
};
