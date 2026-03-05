<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api/system/user';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { ElButton, ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteUser, getUserList, updateUserStatus } from '#/api/system/user';
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
    fieldMappingTime: [['createdTime', ['createdTimeStart', 'createdTimeEnd']]],
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
          return await getUserList({
            pageNum: page.currentPage,
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
  } as VxeTableGridOptions<SystemUserApi.SystemUser>,
});

function onActionClick(e: OnActionClickParams<SystemUserApi.SystemUser>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'disable': {
      if (resolveSystemStatusActionState(e.row.userStatus).canDisable) {
        onDisable(e.row);
      }
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'enable': {
      if (resolveSystemStatusActionState(e.row.userStatus).canEnable) {
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
      message: $t('system.user.messages.processing', [name]),
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

async function onEnable(row: SystemUserApi.SystemUser) {
  await withConfirmAction(
    row.username,
    () =>
      updateUserStatus({
        userId: row.id,
        userStatus: SYSTEM_STATUS.ENABLED,
      }),
    $t('system.user.messages.enableConfirm', [row.username]),
  );
}

async function onDisable(row: SystemUserApi.SystemUser) {
  await withConfirmAction(
    row.username,
    () =>
      updateUserStatus({
        userId: row.id,
        userStatus: SYSTEM_STATUS.DISABLED,
      }),
    $t('system.user.messages.disableConfirm', [row.username]),
  );
}

function onEdit(row: SystemUserApi.SystemUser) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: SystemUserApi.SystemUser) {
  ElMessageBox.confirm(
    $t('ui.actionMessage.deleteConfirm', [row.username]),
    $t('common.warning'),
    {
      type: 'warning',
    },
  ).then(() => {
    const loading = ElMessage({
      message: $t('ui.actionMessage.deleting', [row.username]),
      type: 'info',
      duration: 0,
    });
    deleteUser([row.id])
      .then(() => {
        loading.close();
        ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.username]));
        onRefresh();
      })
      .catch(() => {
        loading.close();
      });
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
    <Grid :table-title="$t('system.user.list')">
      <template #toolbar-tools>
        <ElButton type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.user.name')]) }}
        </ElButton>
      </template>
    </Grid>
  </Page>
</template>
