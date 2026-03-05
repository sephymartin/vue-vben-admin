<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api/system/role';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { ElButton, ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteRole, getRoleList, updateRoleStatus } from '#/api/system/role';
import {
  resolveSystemStatusActionState,
  SYSTEM_STATUS,
} from '#/constants/system-status';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getRoleList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemRoleApi.SystemRole>,
});

function onActionClick(e: OnActionClickParams<SystemRoleApi.SystemRole>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'disable': {
      if (resolveSystemStatusActionState(e.row.status).canDisable) {
        onDisable(e.row);
      }
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'enable': {
      if (resolveSystemStatusActionState(e.row.status).canEnable) {
        onEnable(e.row);
      }
      break;
    }
  }
}

async function withConfirmAction(
  name: string,
  action: () => Promise<unknown>,
  message: string,
) {
  try {
    await ElMessageBox.confirm(message, $t('common.warning'), {
      type: 'warning',
    });

    const loading = ElMessage({
      duration: 0,
      message: $t('system.role.messages.processing', [name]),
      type: 'info',
    });

    try {
      await action();
      loading.close();
      onRefresh();
    } catch {
      loading.close();
    }
  } catch {
    // user cancelled
  }
}

async function onEnable(row: SystemRoleApi.SystemRole) {
  await withConfirmAction(
    row.name,
    () =>
      updateRoleStatus({
        roleId: row.id,
        roleStatus: SYSTEM_STATUS.ENABLED,
      }),
    $t('system.role.messages.enableConfirm', [row.name]),
  );
}

async function onDisable(row: SystemRoleApi.SystemRole) {
  await withConfirmAction(
    row.name,
    () =>
      updateRoleStatus({
        roleId: row.id,
        roleStatus: SYSTEM_STATUS.DISABLED,
      }),
    $t('system.role.messages.disableConfirm', [row.name]),
  );
}

function onEdit(row: SystemRoleApi.SystemRole) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: SystemRoleApi.SystemRole) {
  const loading = ElMessage({
    message: $t('ui.actionMessage.deleting', [row.name]),
    type: 'info',
    duration: 0,
  });
  deleteRole(row.id)
    .then(() => {
      loading.close();
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
      onRefresh();
    })
    .catch(() => {
      loading.close();
    });
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid :table-title="$t('system.role.list')">
      <template #toolbar-tools>
        <ElButton type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.role.name')]) }}
        </ElButton>
      </template>
    </Grid>
  </Page>
</template>
