<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { SystemRoleApi } from '#/api/system/role';

import { computed, nextTick, ref } from 'vue';

import { Tree, useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { getPermissionList } from '#/api/system/permission';
import { createRole, getRoleDetail, updateRole } from '#/api/system/role';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<SystemRoleApi.RoleDetail>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const permissions = ref<any[]>([]);
const loadingPermissions = ref(false);
const treeWrapperRef = ref<HTMLElement>();

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();

    drawerApi.lock();
    (id.value ? updateRole(id.value, values) : createRole(values))
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemRoleApi.SystemRole>();
      formApi.resetForm();

      if (data?.id) {
        // 编辑模式：调用详情接口获取完整数据（包括关联的权限列表）
        try {
          const detail = await getRoleDetail(data.id);
          formData.value = detail;
          id.value = detail.id;
        } catch (error) {
          console.error('获取角色详情失败:', error);
          // 降级处理：使用列表传入的数据
          formData.value = data as SystemRoleApi.RoleDetail;
          id.value = data.id;
        }
      } else {
        // 新增模式
        formData.value = undefined;
        id.value = undefined;
      }

      // 确保权限数据已加载
      if (permissions.value.length === 0) {
        await loadPermissions();
      }

      // 等待 DOM 更新和 Tree 组件初始化完成
      await nextTick();

      if (formData.value) {
        formApi.setValues({
          name: formData.value.name,
          status: formData.value.status || 'ENABLED',
          remark: formData.value.remark || '',
          permissions: formData.value.permissionIds || [],
        });
      }
    }
  },
});

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await getPermissionList();
    permissions.value = res as unknown as any[];
  } finally {
    loadingPermissions.value = false;
  }
}

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', $t('system.role.name'))
    : $t('common.create', $t('system.role.name'));
});

function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.permissionType === 'button') {
    classes.push('inline-flex');
  }

  return classes.join(' ');
}
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form>
      <template #permissions="slotProps">
        <div
          ref="treeWrapperRef"
          v-loading="loadingPermissions"
          class="permission-tree-wrapper w-full"
        >
          <Tree
            :tree-data="permissions"
            multiple
            bordered
            :default-expanded-level="2"
            :get-node-class="getNodeClass"
            v-bind="slotProps"
            value-field="id"
            label-field="permissionName"
          >
            <template #node="{ value }">
              {{ value.permissionName }}
            </template>
          </Tree>
        </div>
      </template>
    </Form>
  </Drawer>
</template>
<style lang="css" scoped>
:deep(.el-tree-node__content) {
  .tree-actions {
    display: none;
    margin-left: 20px;
  }
}

:deep(.el-tree-node__content:hover) {
  .tree-actions {
    display: flex;
    flex: auto;
    justify-content: flex-end;
    margin-left: 20px;
  }
}

/* 在权限树的全选复选框后添加"全部权限"文字 */

/* 根据 Tree 组件源码第 299-312 行的结构：
   div.border-b > div.flex-1(包含 ChevronRight 和 Checkbox)
*/
.permission-tree-wrapper :deep(.border-b > .flex-1)::after {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground, #606266);
  white-space: nowrap;
  content: '全部权限';
}
</style>
