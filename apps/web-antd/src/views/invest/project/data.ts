import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { InvestProjectApi } from '#/api';

import { useDictStore } from '#/store';

export function useFormSchema(): VbenFormSchema[] {
  const dictStore = useDictStore();

  return [
    {
      component: 'Input',
      fieldName: 'projectName',
      label: '项目名称',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'projectType',
      label: '项目类型',
      componentProps: {
        options: dictStore.getDictItems('invest_project_type'),
      },
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'expectTotalAmt',
      label: '目标筹集金额',
      componentProps: {
        min: 0,
        precision: 2,
        style: { width: '100%' },
      },
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'realTotalAmt',
      label: '实际筹集金额',
      componentProps: {
        min: 0,
        precision: 2,
        style: { width: '100%' },
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'startDate',
      label: '项目开始日期',
      rules: 'required',
    },
    {
      component: 'DatePicker',
      fieldName: 'endDate',
      label: '项目结束日期',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'managerId',
      label: '项目经理',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'projectStatus',
      label: '项目状态',
      componentProps: {
        options: dictStore.getDictItems('invest_project_status'),
      },
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'projectRemark',
      label: '项目备注',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'projectName',
      label: '项目名称',
    },
    {
      component: 'Select',
      fieldName: 'projectType',
      label: '项目类型',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '准备中', value: 'PREPARE' },
          { label: '进行中', value: 'INPROCESS' },
          { label: '已结束', value: 'FINISHED' },
          { label: '已取消', value: 'CANCELLED' },
        ],
        allowClear: true,
      },
      fieldName: 'projectStatus',
      label: '项目状态',
    },
  ];
}

export function useColumns<T = InvestProjectApi.InvestProject>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'projectName',
      title: '项目名称',
      width: 200,
    },
    {
      field: 'projectType',
      title: '项目类型',
      width: 120,
    },
    {
      field: 'expectTotalAmt',
      title: '目标筹集金额',
      width: 150,
    },
    {
      field: 'realTotalAmt',
      title: '实际筹集金额',
      width: 150,
    },
    {
      field: 'startDate',
      title: '项目开始日期',
      width: 120,
    },
    {
      field: 'endDate',
      title: '项目结束日期',
      width: 120,
    },
    {
      field: 'projectStatus',
      title: '项目状态',
      width: 100,
      cellRender: {
        name: 'CellTag',
      },
    },
    {
      field: 'projectRemark',
      title: '项目备注',
      minWidth: 150,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'projectName',
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
