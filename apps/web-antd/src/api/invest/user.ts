import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace InvestUserApi {
  export interface User {
    /**
     * ID
     */
    id: number;

    /**
     * 投资用户名称
     */
    investUserName: string;

    /**
     * 是否生效
     */
    enableStatus: boolean;

    /**
     * 电子邮件
     */
    email: string;
  }
}

/**
 * 获取投资项目列表数据
 */
export async function listInvestUserList(params: Recordable<any>) {
  return requestClient.get<Array<InvestUserApi.User>>(
    '/admin/invest/user/queryUser',
    {
      params,
    },
  );
}

/**
 * 创建项目
 * @param data 项目数据
 */
export async function createInvestUser(data: Omit<InvestUserApi.User, 'id'>) {
  return requestClient.post('/admin/invest/user/createUser', data);
}

/**
 * 更新用户
 *
 * @param data 项目数据
 */
export async function updateInvestUser(data: Partial<InvestUserApi.User>) {
  return requestClient.post('/admin/invest/user/updateUser', data);
}

/**
 * 删除用户
 * @param data 项目 ID
 */
export async function deleteInvestUser(data: Partial<InvestUserApi.User>) {
  return requestClient.post('/admin/invest/user/deleteUser', data);
}
