<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DictApi } from '#/api/system/dict';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { ElButton, ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDictType, queryDictTypes } from '#/api/system/dict';
import { $t } from '#/locales';

import { useTypeColumns, useTypeGridFormSchema } from './data';
import ItemDrawer from './modules/item-drawer.vue';
import TypeForm from './modules/type-form.vue';

const itemDrawerRef = ref<InstanceType<typeof ItemDrawer>>();

const [TypeFormModal, typeFormModalApi] = useVbenModal({
  connectedComponent: TypeForm,
  destroyOnClose: true,
});

function onTypeActionClick({
  code,
  row,
}: OnActionClickParams<DictApi.DictType>) {
  switch (code) {
    case 'delete': {
      onDeleteType(row);
      break;
    }
    case 'edit': {
      onEditType(row);
      break;
    }
    case 'manage': {
      onManageItems(row);
      break;
    }
  }
}

const [TypeGrid, typeGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useTypeGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useTypeColumns(onTypeActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await queryDictTypes({
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
  } as VxeTableGridOptions<DictApi.DictType>,
});

function onEditType(row: DictApi.DictType) {
  typeFormModalApi.setData(row).open();
}

function onDeleteType(row: DictApi.DictType) {
  ElMessageBox.confirm(
    $t('ui.actionMessage.deleteConfirm', [row.typeName]),
    $t('common.warning'),
    { type: 'warning' },
  ).then(async () => {
    const loading = ElMessage({
      message: $t('ui.actionMessage.deleting', [row.typeName]),
      type: 'info',
      duration: 0,
    });
    try {
      await deleteDictType(row.id);
      loading.close();
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.typeName]));
      refreshTypeGrid();
    } catch {
      loading.close();
    }
  });
}

function onManageItems(row: DictApi.DictType) {
  itemDrawerRef.value?.open(row.typeCode, row.typeName);
}

function refreshTypeGrid() {
  typeGridApi.query();
}

function onCreateType() {
  typeFormModalApi.setData(null).open();
}
</script>
<template>
  <Page auto-content-height>
    <TypeFormModal @success="refreshTypeGrid" />
    <ItemDrawer ref="itemDrawerRef" />

    <TypeGrid :table-title="$t('system.dict.type.list')">
      <template #toolbar-tools>
        <ElButton type="primary" @click="onCreateType">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.dict.type.name')]) }}
        </ElButton>
      </template>
    </TypeGrid>
  </Page>
</template>
