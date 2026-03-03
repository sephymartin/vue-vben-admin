import type { Recordable } from '@vben/types';

import type { BackendPagingResult } from '#/api/types';

import { requestClient } from '#/api/request';
import { transformPagingResult } from '#/api/types';

/**
 * 后端返回的商户 DTO
 */
interface SaobeiMerchantDTO {
  id: number;
  merchantNo: string;
  merchantName: string;
  merchantSecret: string;
  skipSignature: boolean;
  createdAt: string;
  updatedAt: string;
}

export namespace SaobeiMerchantApi {
  /**
   * 前端使用的商户接口
   */
  export interface SaobeiMerchant {
    id: number;
    merchantNo: string;
    merchantName: string;
    merchantSecret: string;
    skipSignature: boolean;
    createdAt: string;
    updatedAt: string;
  }
}

/**
 * 将后端商户 DTO 转换为前端格式
 */
function mapMerchantFromBackend(
  backendMerchant: SaobeiMerchantDTO,
): SaobeiMerchantApi.SaobeiMerchant {
  return {
    id: backendMerchant.id,
    merchantNo: backendMerchant.merchantNo,
    merchantName: backendMerchant.merchantName,
    merchantSecret: backendMerchant.merchantSecret,
    skipSignature: backendMerchant.skipSignature,
    createdAt: backendMerchant.createdAt,
    updatedAt: backendMerchant.updatedAt,
  };
}

/**
 * 获取商户列表数据
 */
async function getMerchantList(params: Recordable<any>) {
  const { page, pageSize, pageNum, ...otherParams } = params;
  const queryParams = {
    pageNum: pageNum ?? page ?? 1,
    pageSize: pageSize ?? 10,
    ...otherParams,
  };

  const res = await requestClient.post<BackendPagingResult<SaobeiMerchantDTO>>(
    '/admin/saobei/merchant/query',
    queryParams,
  );

  // 转换分页结果并映射字段
  const transformed = transformPagingResult({
    list: res.list.map(mapMerchantFromBackend),
    total: res.total,
  });

  return transformed;
}

export { getMerchantList };
