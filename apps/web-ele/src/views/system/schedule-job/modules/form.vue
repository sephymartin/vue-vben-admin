<script lang="ts" setup>
import type { ScheduleJobApi } from '#/api/system/schedule-job';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  createScheduleJob,
  updateScheduleJob,
} from '#/api/system/schedule-job';
import { $t } from '#/locales';

import {
  formatJobParamsForForm,
  parseJobParamsText,
  useFormSchema,
} from '../data';

const emits = defineEmits(['success']);

const formData = ref<ScheduleJobApi.ScheduleJob>();
const id = ref<number>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const values = await formApi.getValues();
    const parsed = parseJobParamsText(values.jobParams);
    if (parsed.error) {
      return;
    }

    modalApi.lock();
    try {
      await (id.value
        ? updateScheduleJob({
            id: id.value,
            cronExpression: values.cronExpression,
            jobDescription: values.jobDescription,
            jobParams: parsed.value,
          })
        : createScheduleJob({
            beanName: values.beanName,
            cronExpression: values.cronExpression,
            jobDescription: values.jobDescription,
            jobName: values.jobName,
            jobParams: parsed.value,
            jobStatus: values.jobStatus,
          }));
      emits('success');
      modalApi.close();
    } finally {
      modalApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }

    const data = modalApi.getData<ScheduleJobApi.ScheduleJob>();
    formApi.resetForm();

    if (data?.id) {
      formData.value = data;
      id.value = data.id;
      await formApi.setValues({
        ...data,
        jobParams: formatJobParamsForForm(data.jobParams),
      });
    } else {
      id.value = undefined;
      formData.value = undefined;
      await formApi.setValues({
        jobStatus: 'ENABLED',
      });
    }
  },
});

const getModalTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.scheduleJob.name')])
    : $t('ui.actionTitle.create', [$t('system.scheduleJob.name')]);
});
</script>

<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>
