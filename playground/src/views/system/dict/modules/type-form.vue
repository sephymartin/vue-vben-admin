<script lang="ts" setup>
import type { DictApi } from '#/api/system/dict';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createDictType, updateDictType } from '#/api/system/dict';
import { $t } from '#/locales';

import { useTypeFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<DictApi.DictType>();

const [Form, formApi] = useVbenForm({
  schema: useTypeFormSchema(),
  showDefaultActions: false,
});

const id = ref<number>();
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    modalApi.lock();
    const saveData = id.value
      ? { ...values, id: id.value }
      : values;
    (id.value ? updateDictType(saveData) : createDictType(values))
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
      const data = modalApi.getData<DictApi.DictType>();
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
    ? $t('common.edit', $t('system.dict.type.name'))
    : $t('common.create', $t('system.dict.type.name'));
});
</script>
<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>
