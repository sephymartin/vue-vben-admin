/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { RequestClientOptions } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { ElMessage } from 'element-plus';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    // 后端迁移后，resp 直接是 token 字符串，不再有 data 包装
    const newToken = typeof resp === 'string' ? resp : resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // 处理返回的响应数据格式 - RFC 7807 ProblemDetail
  // 成功响应直接返回数据，无包装；HTTP 状态码已在 defaultResponseInterceptor 内部检查
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'status', // 字段名（成功响应中可能不存在，但错误响应 ProblemDetail 中有）
      dataField: (responseData) => responseData, // 直接返回整个响应体（参数是响应体，不是整个 response 对象）
      successCode: (code) => {
        // 成功响应没有 status 字段（code 为 undefined），此时 HTTP 状态码已为 200-399
        // 错误响应 ProblemDetail 有 status 字段，但 HTTP 状态码已为 400+
        // 所以如果 code 存在且 >= 400，返回 false；否则返回 true
        return (
          code === undefined ||
          (typeof code === 'number' && code >= 200 && code < 400)
        );
      },
    }),
  );

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // 通用的错误处理 - 支持 RFC 7807 ProblemDetail 格式
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      const responseData = error?.response?.data ?? {};

      // RFC 7807 ProblemDetail 格式
      let errorMessage = '';
      if (responseData.detail) {
        errorMessage = responseData.detail;
      } else if (responseData.title) {
        errorMessage = responseData.title;
      }
      // 兼容旧格式（过渡期，可选）
      else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.message) {
        errorMessage = responseData.message;
      }

      ElMessage.error(errorMessage || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
