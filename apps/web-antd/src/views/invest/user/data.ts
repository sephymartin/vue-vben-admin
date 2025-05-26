import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { InvestUserApi } from '#/api';

import { useDictStore } from '#/store';

const dictStore = useDictStore();

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'investUserName',
      label: '投资人',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '电子邮件',
      rules: [
        { required: true, message: '请输入邮箱地址' },
        { type: 'email', message: '请输入正确的邮箱地址' },
      ],
    },
    {
      component: 'Select',
      fieldName: 'enableStatus',
      label: '状态',
      componentProps: {
        options: dictStore.getDictItems('enable_status'),
      },
      defaultValue: true,
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'investUserName',
      label: '投资人',
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '电子邮件',
    },
    {
      component: 'Select',
      fieldName: 'enableStatus',
      label: '状态',
      componentProps: {
        options: dictStore.getDictItems('enable_status'),
        allowClear: true,
      },
    },
  ];
}

export function useColumns<T = InvestUserApi.User>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'investUserName',
      title: '投资人',
      width: 150,
    },
    {
      field: 'email',
      title: '电子邮件',
      width: 200,
    },
    {
      field: 'enableStatus',
      title: '状态',
      width: 100,
      slots: { default: 'enableStatus' },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'investUserName',
          nameTitle: '操作',
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
    },
  ];
}
