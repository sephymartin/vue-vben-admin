<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SaobeiPaymentApi } from '#/api/saobei/payment';

import { Page } from '@vben/common-ui';
import { Download } from '@vben/icons';

import { ElButton } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { exportPayment, getPaymentList } from '#/api/saobei/payment';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createdAt', ['createdAtStart', 'createdAtEnd']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(() => {}),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getPaymentList({
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
  } as VxeTableGridOptions<SaobeiPaymentApi.SaobeiPayment>,
});

function onRefresh() {
  gridApi.query();
}

async function onExport() {
  const formValues = gridApi.getFormValues();
  await exportPayment(formValues);
}
</script>
<template>
  <Page auto-content-height>
    <Grid :table-title="$t('saobei.payment.list')">
      <template #toolbar-tools>
        <ElButton type="primary" @click="onExport">
          <Download class="size-5" />
          {{ $t('saobei.payment.export') }}
        </ElButton>
      </template>
    </Grid>
  </Page>
</template>
