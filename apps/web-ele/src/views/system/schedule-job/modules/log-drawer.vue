<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ScheduleJobApi } from '#/api/system/schedule-job';

import { computed, ref, watch } from 'vue';

import { useWindowSize } from '@vueuse/core';
import { ElButton, ElDrawer } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { queryScheduleJobLogs } from '#/api/system/schedule-job';
import { $t } from '#/locales';

import { useLogColumns } from '../data';
import LogDetailModal from './log-detail-modal.vue';

const visible = ref(false);
const jobId = ref<number>();
const jobName = ref('');

const logDetailModalRef = ref<InstanceType<typeof LogDetailModal>>();

const { height: windowHeight } = useWindowSize();
const gridHeight = computed(() => {
  const headerHeight = 56;
  const padding = 32;
  return Math.max(220, windowHeight.value - headerHeight - padding);
});

const [LogGrid, logGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useLogColumns(onActionClick),
    height: gridHeight.value,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          if (!jobId.value) {
            return { items: [], total: 0 };
          }
          return await queryScheduleJobLogs({
            jobId: jobId.value,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
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
      zoom: false,
    },
  } as VxeTableGridOptions<ScheduleJobApi.ScheduleJobLog>,
});

function formatSummary(text?: string) {
  if (!text) {
    return '-';
  }
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<ScheduleJobApi.ScheduleJobLog>) {
  if (code === 'viewResult') {
    logDetailModalRef.value?.open(
      $t('system.scheduleJob.log.actions.viewResult'),
      row.executeResult,
    );
  }

  if (code === 'viewError') {
    logDetailModalRef.value?.open(
      $t('system.scheduleJob.log.actions.viewError'),
      row.errorMessage,
    );
  }
}

function reset() {
  jobId.value = undefined;
  jobName.value = '';
  logGridApi.setGridOptions({
    pagerConfig: {
      currentPage: 1,
    },
  });
}

function open(nextJobId: number, nextJobName: string) {
  const isSwitchingJob = jobId.value !== nextJobId;

  jobId.value = nextJobId;
  jobName.value = nextJobName;
  visible.value = true;

  if (isSwitchingJob) {
    logGridApi.setGridOptions({
      pagerConfig: {
        currentPage: 1,
      },
    });
  }

  logGridApi.reload();
}

function close() {
  visible.value = false;
}

function onClosed() {
  reset();
}

watch(
  gridHeight,
  (height) => {
    logGridApi.setGridOptions({ height });
  },
  { immediate: true },
);

defineExpose({
  close,
  open,
});
</script>

<template>
  <ElDrawer
    v-model="visible"
    :title="`${jobName} - ${$t('system.scheduleJob.log.list')}`"
    size="70%"
    @closed="onClosed"
  >
    <LogDetailModal ref="logDetailModalRef" />
    <LogGrid :table-title="$t('system.scheduleJob.log.list')">
      <template #executeResult="{ row }">
        <div class="flex items-center gap-2">
          <span class="truncate">{{ formatSummary(row.executeResult) }}</span>
          <ElButton
            v-if="row.executeResult"
            link
            size="small"
            type="primary"
            @click="
              logDetailModalRef?.open(
                $t('system.scheduleJob.log.actions.viewResult'),
                row.executeResult,
              )
            "
          >
            {{ $t('system.scheduleJob.log.actions.detail') }}
          </ElButton>
        </div>
      </template>

      <template #errorMessage="{ row }">
        <div class="flex items-center gap-2">
          <span class="truncate">{{ formatSummary(row.errorMessage) }}</span>
          <ElButton
            v-if="row.errorMessage"
            link
            size="small"
            type="danger"
            @click="
              logDetailModalRef?.open(
                $t('system.scheduleJob.log.actions.viewError'),
                row.errorMessage,
              )
            "
          >
            {{ $t('system.scheduleJob.log.actions.detail') }}
          </ElButton>
        </div>
      </template>
    </LogGrid>
  </ElDrawer>
</template>
