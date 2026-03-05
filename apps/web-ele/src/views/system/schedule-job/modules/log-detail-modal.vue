<script lang="ts" setup>
import { computed, ref } from 'vue';

import { ElDialog, ElInput } from 'element-plus';

import { $t } from '#/locales';

const visible = ref(false);
const title = ref('');
const content = ref('');

const dialogTitle = computed(
  () => title.value || $t('system.scheduleJob.log.name'),
);

function open(detailTitle: string, detailContent?: string) {
  title.value = detailTitle;
  content.value = detailContent || '';
  visible.value = true;
}

function close() {
  visible.value = false;
  title.value = '';
  content.value = '';
}

defineExpose({
  close,
  open,
});
</script>

<template>
  <ElDialog
    v-model="visible"
    :title="dialogTitle"
    width="720px"
    @closed="close"
  >
    <ElInput v-model="content" :rows="16" readonly type="textarea" />
  </ElDialog>
</template>
