<script lang="ts" setup>
import type { InvestProjectApi } from '#/api/invest/project';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { getFundListByProjectId } from '#/api/invest/project';

const formData = ref<InvestProjectApi.Project>();

const loading = ref(false);

// 投资明细列表
const fundList = ref<InvestProjectApi.ProjectFund[]>([]);

const [CustomLayoutForm, formApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  schema: [
    {
      component: 'Select',
      fieldName: 'field1',
      label: '字符串',
    },
    {
      component: 'TreeSelect',
      fieldName: 'field2',
      label: '字符串',
    },
    {
      component: 'Mentions',
      fieldName: 'field3',
      label: '字符串',
    },
    {
      component: 'Input',
      fieldName: 'field4',
      label: '字符串',
    },
    {
      component: 'InputNumber',
      fieldName: 'field5',
      // 从第三列开始 相当于中间空了一列
      formItemClass: 'col-start-3',
      label: '前面空了一列',
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      formItemClass: 'col-span-3',
      hideLabel: true,
      renderComponentContent: () => {
        return {
          default: () => h('div', '分割线'),
        };
      },
    },
    {
      component: 'Textarea',
      fieldName: 'field6',
      // 占满三列空间 基线对齐
      formItemClass: 'col-span-3 items-baseline',
      label: '占满三列',
    },
    {
      component: 'Input',
      fieldName: 'field7',
      // 占满2列空间 从第二列开始 相当于前面空了一列
      formItemClass: 'col-span-2 col-start-2',
      label: '占满2列',
    },
    {
      component: 'Input',
      fieldName: 'field8',
      // 左右留空
      formItemClass: 'col-start-2',
      label: '左右留空',
    },
    {
      component: 'InputPassword',
      fieldName: 'field9',
      formItemClass: 'col-start-1',
      label: '字符串',
    },
  ],
  // 一共三列
  wrapperClass: 'grid-cols-3',
});

// 加载投资明细列表
async function loadFundList(projectId: number) {
  try {
    loading.value = true;
    const data = await getFundListByProjectId(projectId);
    fundList.value = data;
  } finally {
    loading.value = false;
  }
}

// 在抽屉打开时加载数据
const [Drawer, drawerApi] = useVbenDrawer({
  // ...existing code...
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<InvestProjectApi.Project>();

      formApi.resetForm();
      if (data) {
        formData.value = data;
        formApi.setValues(data);
        // 加载投资明细
        loadFundList(data.id);
      } else {
        fundList.value = [];
      }
    }
  },
});
</script>
<template>
  <Drawer>
    <CustomLayoutForm />
  </Drawer>
</template>
