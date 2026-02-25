import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 后端返回的用户信息结构
 */
interface BackendUserInfo {
  avatar: string;
  email?: string;
  phone?: string;
  realName: string;
  role?: string;
  userId: string;
  username: string;
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi(): Promise<UserInfo> {
  const data = await requestClient.get<BackendUserInfo>('/admin/user/info');
  return {
    avatar: data.avatar || '',
    desc: '',
    homePath: '/dashboard',
    realName: data.realName,
    roles: [],
    token: '',
    userId: data.userId,
    username: data.username,
  };
}
