<script lang="ts" setup>
import type { DrawerPlacement, DrawerState } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { InvestProjectApi } from '#/api';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteInvestProject, listInvestProjectList } from '#/api';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import InContentDemo from './modules/fundDetail.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [InContentDrawer, inContentDrawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: InContentDemo,
  // placement: 'left',
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await listInvestProjectList({
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
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<InvestProjectApi.Project>,
});

function onActionClick(e: OnActionClickParams<InvestProjectApi.Project>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case '资金明细': {
      onShowFundDetail(e.row);
      break;
    }
  }
}

/**
 * 将Antd的Modal.confirm封装为promise，方便在异步函数中调用。
 * @param content 提示内容
 * @param title 提示标题
 */

// function confirm(content: string, title: string) {
//   return new Promise((reslove, reject) => {
//     Modal.confirm({
//       content,
//       onCancel() {
//         reject(new Error('已取消'));
//       },
//       onOk() {
//         reslove(true);
//       },
//       title,
//     });
//   });
// }

function onShowFundDetail(
  row: InvestProjectApi.Project,
  placement: DrawerPlacement = 'right',
) {
  const state: Partial<DrawerState> = { class: '', placement };
  if (placement === 'top') {
    // 页面顶部区域的层级只有200，所以设置一个低于200的值，抽屉从顶部滑出来的时候才比较合适
    state.zIndex = 199;
  }
  inContentDrawerApi.setData(row).setState(state).open();
}

function onEdit(row: InvestProjectApi.Project) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: InvestProjectApi.Project) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteInvestProject(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
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
    <InContentDrawer @success="onRefresh" />
    <Grid :table-title="$t('invest.project.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('invest.project.title')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
