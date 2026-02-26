<script lang="ts" setup>
import type { DictApi } from '#/api/system/dict';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createDictItem, updateDictItem } from '#/api/system/dict';
import { $t } from '#/locales';

import { useItemFormSchema } from '../data';

const props = defineProps<{
  typeCode: string;
}>();

const emits = defineEmits(['success']);

const formData = ref<DictApi.DictItem>();

const [Form, formApi] = useVbenForm({
  schema: useItemFormSchema(),
  showDefaultActions: false,
});

const id = ref<number>();
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    modalApi.lock();
    const saveData = {
      ...values,
      typeCode: props.typeCode,
      ...(id.value ? { id: id.value } : {}),
    };
    (id.value ? updateDictItem(saveData) : createDictItem(saveData))
      .then(() => {
        emits('success');
        modalApi.close();
      })
      .catch(() => {
        modalApi.unlock();
      });
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<DictApi.DictItem>();
      formApi.resetForm();

      if (data && data.id) {
        formData.value = data;
        id.value = data.id;
        await formApi.setValues(data);
      } else {
        id.value = undefined;
      }
    }
  },
});

const getModalTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', $t('system.dict.item.name'))
    : $t('common.create', $t('system.dict.item.name'));
});
</script>
<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>
