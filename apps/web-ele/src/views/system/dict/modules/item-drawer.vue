<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DictApi } from '#/api/system/dict';

import { computed, ref, watch } from 'vue';

import { Plus } from '@vben/icons';

import { useWindowSize } from '@vueuse/core';
import {
  ElButton,
  ElCollapseTransition,
  ElDrawer,
  ElMessage,
  ElMessageBox,
} from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createDictItem,
  deleteDictItem,
  getDictItemList,
  updateDictItem,
} from '#/api/system/dict';
import { transformListResult } from '#/api/types';
import { $t } from '#/locales';

import { useItemColumns, useItemFormSchema } from '../data';

const visible = ref(false);
const typeCode = ref('');
const typeName = ref('');
const formVisible = ref(false);
const editingItem = ref<DictApi.DictItem | null>(null);
const formLoading = ref(false);

const { height: windowHeight } = useWindowSize();
const gridHeight = computed(() => {
  const drawerHeaderHeight = 56;
  const drawerPadding = 40;
  const formHeight = formVisible.value ? 380 : 0;
  const gap = 16;
  const availableHeight =
    windowHeight.value - drawerHeaderHeight - drawerPadding - formHeight - gap;
  return Math.max(200, availableHeight);
});

const [Form, formApi] = useVbenForm({
  schema: useItemFormSchema(),
  showDefaultActions: false,
});

function onItemActionClick({
  code,
  row,
}: OnActionClickParams<DictApi.DictItem>) {
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
    keepSource: true,
    pagerConfig: {
      enabled: true,
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          if (!typeCode.value) {
            return { items: [], total: 0 };
          }
          return transformListResult(await getDictItemList(typeCode.value));
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

async function onEditItem(row: DictApi.DictItem) {
  editingItem.value = row;
  formVisible.value = true;
  formApi.resetForm();
  await formApi.setValues(row);
}

function onDeleteItem(row: DictApi.DictItem) {
  ElMessageBox.confirm(
    $t('ui.actionMessage.deleteConfirm', [row.itemLabel]),
    $t('common.warning'),
    { type: 'warning' },
  ).then(async () => {
    const loading = ElMessage({
      message: $t('ui.actionMessage.deleting', [row.itemLabel]),
      type: 'info',
      duration: 0,
    });
    try {
      await deleteDictItem(row.id);
      loading.close();
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.itemLabel]));
      refreshGrid();
    } catch {
      loading.close();
    }
  });
}

function refreshGrid() {
  itemGridApi.query();
}

function onCreateItem() {
  editingItem.value = null;
  formVisible.value = true;
  formApi.resetForm();
}

function closeForm() {
  formVisible.value = false;
  editingItem.value = null;
  formApi.resetForm();
}

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) return;

  formLoading.value = true;
  try {
    const values = await formApi.getValues();
    const saveData = {
      ...values,
      typeCode: typeCode.value,
      ...(editingItem.value?.id ? { id: editingItem.value.id } : {}),
    };
    await (editingItem.value?.id
      ? updateDictItem(saveData)
      : createDictItem(saveData));
    ElMessage.success(
      editingItem.value?.id
        ? $t('ui.actionMessage.updateSuccess', $t('system.dict.item.name'))
        : $t('ui.actionMessage.createSuccess', $t('system.dict.item.name')),
    );
    closeForm();
    refreshGrid();
  } finally {
    formLoading.value = false;
  }
}

function onCancel() {
  closeForm();
}

const formTitle = computed(() => {
  return editingItem.value?.id
    ? $t('common.edit', $t('system.dict.item.name'))
    : $t('common.create', $t('system.dict.item.name'));
});

function open(code: string, name: string) {
  typeCode.value = code;
  typeName.value = name;
  visible.value = true;
  formVisible.value = false;
  editingItem.value = null;
}

function onDrawerOpened() {
  itemGridApi.reload();
}

watch(
  gridHeight,
  (height) => {
    itemGridApi.setGridOptions({ height });
  },
  { immediate: true },
);

function close() {
  visible.value = false;
  closeForm();
}

defineExpose({ open, close });
</script>
<template>
  <ElDrawer
    v-model="visible"
    :title="`${typeName} - ${$t('system.dict.item.list')}`"
    size="650px"
    @opened="onDrawerOpened"
  >
    <div class="flex flex-col gap-4">
      <!-- 表单区域 -->
      <ElCollapseTransition>
        <div v-if="formVisible" class="rounded-lg border border-gray-200 p-4">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-base font-medium">{{ formTitle }}</h3>
            <ElButton size="small" text @click="closeForm">
              {{ $t('common.cancel') }}
            </ElButton>
          </div>
          <Form />
          <div class="mt-4 flex justify-end gap-2">
            <ElButton @click="onCancel">{{ $t('common.cancel') }}</ElButton>
            <ElButton :loading="formLoading" type="primary" @click="onSubmit">
              {{ $t('common.confirm') }}
            </ElButton>
          </div>
        </div>
      </ElCollapseTransition>

      <!-- 表格区域 -->
      <ItemGrid :table-title="$t('system.dict.item.list')">
        <template #toolbar-tools>
          <ElButton
            :disabled="formVisible"
            size="small"
            type="primary"
            @click="onCreateItem"
          >
            <Plus class="size-4" />
            {{ $t('ui.actionTitle.create', [$t('system.dict.item.name')]) }}
          </ElButton>
        </template>
      </ItemGrid>
    </div>
  </ElDrawer>
</template>
