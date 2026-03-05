<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ScheduleJobApi } from '#/api/system/schedule-job';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { ElButton, ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteScheduleJob,
  disableScheduleJob,
  enableScheduleJob,
  executeScheduleJob,
  queryScheduleJobs,
} from '#/api/system/schedule-job';
import { $t } from '#/locales';

import {
  resolveJobStatusActionState,
  useColumns,
  useGridFormSchema,
} from './data';
import Form from './modules/form.vue';
import LogDrawer from './modules/log-drawer.vue';

const logDrawerRef = ref<InstanceType<typeof LogDrawer>>();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
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
          return await queryScheduleJobs({
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
  } as VxeTableGridOptions<ScheduleJobApi.ScheduleJob>,
});

function onCreate() {
  formModalApi.setData(null).open();
}

function onEdit(row: ScheduleJobApi.ScheduleJob) {
  formModalApi.setData(row).open();
}

function onOpenLogs(row: ScheduleJobApi.ScheduleJob) {
  logDrawerRef.value?.open(row.id, row.jobName);
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
      message: $t('system.scheduleJob.messages.processing', [name]),
      type: 'info',
    });

    try {
      await action();
      loading.close();
      gridApi.query();
    } catch {
      loading.close();
    }
  } catch {
    // user cancelled
  }
}

async function onDelete(row: ScheduleJobApi.ScheduleJob) {
  await withConfirmAction(
    row.jobName,
    () => deleteScheduleJob(row.id),
    $t('ui.actionMessage.deleteConfirm', [row.jobName]),
  );
}

async function onEnable(row: ScheduleJobApi.ScheduleJob) {
  await withConfirmAction(
    row.jobName,
    () => enableScheduleJob(row.id),
    $t('system.scheduleJob.messages.enableConfirm', [row.jobName]),
  );
}

async function onDisable(row: ScheduleJobApi.ScheduleJob) {
  await withConfirmAction(
    row.jobName,
    () => disableScheduleJob(row.id),
    $t('system.scheduleJob.messages.disableConfirm', [row.jobName]),
  );
}

async function onExecute(row: ScheduleJobApi.ScheduleJob) {
  await withConfirmAction(
    row.jobName,
    () => executeScheduleJob(row.id),
    $t('system.scheduleJob.messages.executeConfirm', [row.jobName]),
  );
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<ScheduleJobApi.ScheduleJob>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'disable': {
      if (resolveJobStatusActionState(row.jobStatus).canDisable) {
        onDisable(row);
      }
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'enable': {
      if (resolveJobStatusActionState(row.jobStatus).canEnable) {
        onEnable(row);
      }
      break;
    }
    case 'execute': {
      onExecute(row);
      break;
    }
    case 'logs': {
      onOpenLogs(row);
      break;
    }
  }
}

function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <LogDrawer ref="logDrawerRef" />

    <Grid :table-title="$t('system.scheduleJob.list')">
      <template #toolbar-tools>
        <ElButton type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.scheduleJob.name')]) }}
        </ElButton>
      </template>
    </Grid>
  </Page>
</template>
