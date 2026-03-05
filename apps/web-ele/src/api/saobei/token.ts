import type { Recordable } from '@vben/types';

import type { BackendPagingResult } from '#/api/types';

import { requestClient } from '#/api/request';
import { transformPagingResult } from '#/api/types';

/**
 * 后端返回的 Token DTO
 */
interface SaobeiTokenDTO {
  id: number;
  userId: number;
  nickname: string;
  merchantName: string;
  merchantNo: string;
  token: string;
  expiresAt: string;
  expired: boolean;
  createdAt: string;
  updatedAt: string;
}

export namespace SaobeiTokenApi {
  /**
   * 前端使用的 Token 接口
   */
  export interface SaobeiToken {
    id: number;
    userId: number;
    nickname: string;
    merchantName: string;
    merchantNo: string;
    token: string;
    expiresAt: string;
    expired: boolean;
    createdAt: string;
    updatedAt: string;
  }
}

/**
 * 将后端 Token DTO 转换为前端格式
 */
function mapTokenFromBackend(
  backendToken: SaobeiTokenDTO,
): SaobeiTokenApi.SaobeiToken {
  return {
    id: backendToken.id,
    userId: backendToken.userId,
    nickname: backendToken.nickname,
    merchantName: backendToken.merchantName,
    merchantNo: backendToken.merchantNo,
    token: backendToken.token,
    expiresAt: backendToken.expiresAt,
    expired: backendToken.expired,
    createdAt: backendToken.createdAt,
    updatedAt: backendToken.updatedAt,
  };
}

/**
 * 获取 Token 列表数据
 */
async function getTokenList(params: Recordable<any>) {
  const { page, pageSize, pageNum, ...otherParams } = params;
  const queryParams = {
    pageNum: pageNum ?? page ?? 1,
    pageSize: pageSize ?? 10,
    ...otherParams,
  };

  const res = await requestClient.post<BackendPagingResult<SaobeiTokenDTO>>(
    '/admin/saobei/token/query',
    queryParams,
  );

  // 转换分页结果并映射字段
  const transformed = transformPagingResult({
    list: res.list.map((item) => mapTokenFromBackend(item)),
    total: res.total,
  });

  return transformed;
}

/**
 * 刷新 token 字符串
 */
async function updateTokenString(id: number, tokenString: string) {
  return requestClient.post(
    '/admin/saobei/token/updateTokenString',
    { tokenString },
    {
      params: { id },
    },
  );
}

export { getTokenList, updateTokenString };
