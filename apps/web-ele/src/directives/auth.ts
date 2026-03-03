import type { DirectiveBinding } from 'vue';

import { useUserStore } from '@vben/stores';

/**
 * 权限指令
 * 用法: v-auth="'system:user:add'" 或 v-auth="['system:user:add', 'system:user:edit']"
 */
export function setupAuthDirective(app: any) {
  app.directive('auth', {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      const { value } = binding;
      if (!value) {
        return;
      }

      const userStore = useUserStore();
      const permissions = userStore.userInfo?.permissions || [];

      // 超级管理员拥有所有权限
      if (permissions.includes('*:*:*')) {
        return;
      }

      // 支持字符串或数组
      const requiredPermissions = Array.isArray(value) ? value : [value];

      // 检查是否有任一权限
      const hasPermission = requiredPermissions.some((permission) =>
        permissions.includes(permission),
      );

      // 没有权限则移除元素
      if (!hasPermission) {
        el.remove();
      }
    },
  });
}
