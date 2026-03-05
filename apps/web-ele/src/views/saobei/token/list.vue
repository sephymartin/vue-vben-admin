<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SaobeiTokenApi } from '#/api/saobei/token';

import { Page } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTokenList, updateTokenString } from '#/api/saobei/token';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';

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
          return await getTokenList({
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
  } as VxeTableGridOptions<SaobeiTokenApi.SaobeiToken>,
});

function onActionClick(e: OnActionClickParams<SaobeiTokenApi.SaobeiToken>) {
  if (e.code === 'refreshToken') {
    onRefreshToken(e.row);
  }
}

async function onRefreshToken(row: SaobeiTokenApi.SaobeiToken) {
  try {
    const { value } = await ElMessageBox.prompt(
      $t('saobei.token.messages.inputTokenPrompt', [row.merchantNo]),
      $t('saobei.token.messages.inputTokenTitle'),
      {
        inputPlaceholder: $t('saobei.token.messages.inputTokenPlaceholder'),
        inputType: 'textarea',
        inputValidator: (v) =>
          v?.trim().length > 0 ||
          $t('saobei.token.messages.inputTokenRequired'),
        type: 'warning',
      },
    );

    const loading = ElMessage({
      duration: 0,
      message: $t('saobei.token.messages.processing', [row.merchantNo]),
      type: 'info',
    });

    try {
      await updateTokenString(row.id, value.trim());
      loading.close();
      ElMessage.success(
        $t('saobei.token.messages.refreshSuccess', [row.merchantNo]),
      );
      onRefresh();
    } catch {
      loading.close();
    }
  } catch {
    // user cancelled
  }
}

function onRefresh() {
  gridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <Grid :table-title="$t('saobei.token.list')" />
  </Page>
</template>
