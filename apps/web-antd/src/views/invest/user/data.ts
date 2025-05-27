import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { InvestUserApi } from '#/api';

import { z } from '#/adapter/form';
import { $t } from '#/locales';
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
      rules: z.string().email('请输入正确的邮箱'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: true },
          { label: $t('common.disabled'), value: false },
        ],
        optionType: 'button',
      },
      defaultValue: true,
      fieldName: 'enableStatus',
      label: '状态',
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
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'investUserName',
      title: '投资人',
      minWidth: 150,
    },
    {
      field: 'email',
      title: '电子邮件',
      minWidth: 200,
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'enableStatus',
      title: '状态',
      minWidth: 150,
    },
    {
      field: 'investAmt',
      title: '投资金额',
      cellRender: { name: 'CellAmount' },
    },
    {
      field: 'investProjectsCount',
      title: '投资项目数',
      minWidth: 150,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'investUserName',
          nameTitle: '操作',
          onClick: onActionClick,
          codes: ['edit', 'delete'],
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
