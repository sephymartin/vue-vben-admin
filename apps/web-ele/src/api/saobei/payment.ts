import type { Recordable } from '@vben/types';

import type { BackendPagingResult } from '#/api/types';

import { baseRequestClient, requestClient } from '#/api/request';
import { transformPagingResult } from '#/api/types';

/**
 * 后端返回的支付订单 DTO
 */
interface SaobeiPaymentDTO {
  id: number;
  title: string;
  amount: number;
  merchantOrderNo: string;
  merchantNo: string;
  batchNo: string;
  paymentStatus: string;
  notifyStatus: string;
  notifyCount: number;
  notifyTime: string;
  nextNotifyTime: string;
  errorMsg: string;
  beginTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export namespace SaobeiPaymentApi {
  /**
   * 前端使用的支付订单接口
   */
  export interface SaobeiPayment {
    id: number;
    title: string;
    amount: number;
    merchantOrderNo: string;
    merchantNo: string;
    batchNo: string;
    paymentStatus: string;
    notifyStatus: string;
    notifyCount: number;
    notifyTime: string;
    nextNotifyTime: string;
    errorMsg: string;
    beginTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
  }
}

/**
 * 将后端支付订单 DTO 转换为前端格式
 */
function mapPaymentFromBackend(
  backendPayment: SaobeiPaymentDTO,
): SaobeiPaymentApi.SaobeiPayment {
  return {
    id: backendPayment.id,
    title: backendPayment.title,
    amount: backendPayment.amount,
    merchantOrderNo: backendPayment.merchantOrderNo,
    merchantNo: backendPayment.merchantNo,
    batchNo: backendPayment.batchNo,
    paymentStatus: backendPayment.paymentStatus,
    notifyStatus: backendPayment.notifyStatus,
    notifyCount: backendPayment.notifyCount,
    notifyTime: backendPayment.notifyTime,
    nextNotifyTime: backendPayment.nextNotifyTime,
    errorMsg: backendPayment.errorMsg,
    beginTime: backendPayment.beginTime,
    endTime: backendPayment.endTime,
    createdAt: backendPayment.createdAt,
    updatedAt: backendPayment.updatedAt,
  };
}

/**
 * 获取支付订单列表数据
 */
async function getPaymentList(params: Recordable<any>) {
  const { page, pageSize, pageNum, ...otherParams } = params;
  const queryParams = {
    pageNum: pageNum ?? page ?? 1,
    pageSize: pageSize ?? 10,
    ...otherParams,
  };

  const res = await requestClient.post<BackendPagingResult<SaobeiPaymentDTO>>(
    '/admin/saobei/payment/query',
    queryParams,
  );

  // 转换分页结果并映射字段
  const transformed = transformPagingResult({
    list: res.list.map(mapPaymentFromBackend),
    total: res.total,
  });

  return transformed;
}

/**
 * 导出支付订单 Excel
 */
async function exportPayment(params: Recordable<any>) {
  try {
    const response = await baseRequestClient.request({
      url: '/admin/saobei/payment/export',
      method: 'GET',
      params,
      responseType: 'blob',
    });

    const blob = new Blob([response as Blob], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `支付订单列表_${Date.now()}.xlsx`;
    document.body.append(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出失败:', error);
    throw error;
  }
}

export { exportPayment, getPaymentList };
