<script lang="ts" setup>
import type { OnActionClickParams, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DictApi } from '#/api/system/dict';

import { computed, ref, watch } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Card, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDictItem,
  deleteDictType,
  getDictItemList,
  getDictTypeList,
  updateDictItem,
} from '#/api/system/dict';
import { $t } from '#/locales';

import { useItemColumns, useTypeColumns } from './data';
import ItemForm from './modules/item-form.vue';
import TypeForm from './modules/type-form.vue';

const selectedType = ref<DictApi.DictType | null>(null);

const selectedTypeCode = computed(() => selectedType.value?.typeCode || '');

// ========== 字典分类 ==========

const [TypeFormModal, typeFormModalApi] = useVbenModal({
  connectedComponent: TypeForm,
  destroyOnClose: true,
});

function onTypeActionClick({ code, row }: OnActionClickParams<DictApi.DictType>) {
  switch (code) {
    case 'delete': {
      onDeleteType(row);
      break;
    }
    case 'edit': {
      onEditType(row);
      break;
    }
  }
}

const [TypeGrid, typeGridApi] = useVbenVxeGrid({
  gridEvents: {
    cellClick: ({ row }) => {
      selectedType.value = row as DictApi.DictType;
    },
  },
  gridOptions: {
    columns: useTypeColumns(onTypeActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          return await getDictTypeList();
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isCurrent: true,
      isHover: true,
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      zoom: false,
    },
  } as VxeTableGridOptions<DictApi.DictType>,
});

function onEditType(row: DictApi.DictType) {
  typeFormModalApi.setData(row).open();
}

function onDeleteType(row: DictApi.DictType) {
  Modal.confirm({
    content: $t('ui.actionMessage.deleteConfirm', [row.typeName]),
    title: $t('common.warning'),
    onOk: async () => {
      const hideLoading = message.loading({
        content: $t('ui.actionMessage.deleting', [row.typeName]),
        duration: 0,
        key: 'action_process_msg',
      });
      try {
        await deleteDictType(row.id);
        message.success({
          content: $t('ui.actionMessage.deleteSuccess', [row.typeName]),
          key: 'action_process_msg',
        });
        if (selectedType.value?.id === row.id) {
          selectedType.value = null;
        }
        refreshTypeGrid();
      } catch {
        hideLoading();
      }
    },
  });
}

function refreshTypeGrid() {
  typeGridApi.query();
}

function onCreateType() {
  typeFormModalApi.setData(null).open();
}

// ========== 字典明细 ==========

const [ItemFormModal, itemFormModalApi] = useVbenModal({
  connectedComponent: ItemForm,
  destroyOnClose: true,
});

function onItemActionClick({ code, row }: OnActionClickParams<DictApi.DictItem>) {
  switch (code) {
    case 'delete': {
      onDeleteItem(row);
      break;
    }
    case 'edit': {
      onEditItem(row);
      break;
    }
  }
}

async function onItemStatusChange(newStatus: boolean, row: DictApi.DictItem) {
  try {
    await updateDictItem({ id: row.id, enabled: newStatus });
    return true;
  } catch {
    return false;
  }
}

const [ItemGrid, itemGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useItemColumns(onItemActionClick, onItemStatusChange),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          if (!selectedTypeCode.value) {
            return [];
          }
          return await getDictItemList(selectedTypeCode.value);
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
  } as VxeTableGridOptions<DictApi.DictItem>,
});

watch(selectedTypeCode, () => {
  itemGridApi.query();
});

function onEditItem(row: DictApi.DictItem) {
  itemFormModalApi.setData(row).open();
}

function onDeleteItem(row: DictApi.DictItem) {
  Modal.confirm({
    content: $t('ui.actionMessage.deleteConfirm', [row.itemLabel]),
    title: $t('common.warning'),
    onOk: async () => {
      const hideLoading = message.loading({
        content: $t('ui.actionMessage.deleting', [row.itemLabel]),
        duration: 0,
        key: 'action_process_msg',
      });
      try {
        await deleteDictItem(row.id);
        message.success({
          content: $t('ui.actionMessage.deleteSuccess', [row.itemLabel]),
          key: 'action_process_msg',
        });
        refreshItemGrid();
      } catch {
        hideLoading();
      }
    },
  });
}

function refreshItemGrid() {
  itemGridApi.query();
}

function onCreateItem() {
  if (!selectedTypeCode.value) {
    message.warning($t('system.dict.selectTypeFirst'));
    return;
  }
  itemFormModalApi.setData(null).open();
}
</script>
<template>
  <Page auto-content-height>
    <TypeFormModal @success="refreshTypeGrid" />
    <ItemFormModal :type-code="selectedTypeCode" @success="refreshItemGrid" />

    <div class="flex h-full gap-4">
      <Card class="w-[400px] flex-shrink-0" :body-style="{ padding: '12px', height: '100%' }">
        <TypeGrid :table-title="$t('system.dict.type.list')">
          <template #toolbar-tools>
            <Button type="primary" size="small" @click="onCreateType">
              <Plus class="size-4" />
              {{ $t('common.create', $t('system.dict.type.name')) }}
            </Button>
          </template>
        </TypeGrid>
      </Card>

      <Card class="flex-1" :body-style="{ padding: '12px', height: '100%' }">
        <ItemGrid :table-title="selectedType ? `${selectedType.typeName} - ${$t('system.dict.item.list')}` : $t('system.dict.item.list')">
          <template #toolbar-tools>
            <Button type="primary" size="small" :disabled="!selectedTypeCode" @click="onCreateItem">
              <Plus class="size-4" />
              {{ $t('common.create', $t('system.dict.item.name')) }}
            </Button>
          </template>
        </ItemGrid>
      </Card>
    </div>
  </Page>
</template>
