/**
 * RFC 7807 ProblemDetail 错误响应格式
 */
export interface ProblemDetail {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: any; // 允许扩展字段
}

/**
 * 后端分页结果格式
 */
export interface BackendPagingResult<T> {
  list: T[];
  total: number;
}

/**
 * 前端分页结果格式 (vxe-table 期望的格式)
 */
export interface PagingResult<T> {
  items: T[];
  total: number;
}

/**
 * 转换后端分页结果为前端格式 (list -> items)
 */
export function transformPagingResult<T>(
  data: BackendPagingResult<T>,
): PagingResult<T> {
  return { items: data.list, total: data.total };
}

/**
 * 转换数组为前端分页格式 (用于非分页接口)
 */
export function transformListResult<T>(data: T[]): PagingResult<T> {
  return { items: data, total: data.length };
}
