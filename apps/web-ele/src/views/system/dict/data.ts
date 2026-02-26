import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DictApi } from '#/api/system/dict';

import { z } from '#/adapter/form';
import { $t } from '#/locales';

// ========== 字典分类表单配置 ==========

export function useTypeFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'typeCode',
      label: $t('system.dict.type.typeCode'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.dict.type.typeCode')]))
        .max(
          50,
          $t('ui.formRules.maxLength', [$t('system.dict.type.typeCode'), 50]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'typeName',
      label: $t('system.dict.type.typeName'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.dict.type.typeName')]))
        .max(
          100,
          $t('ui.formRules.maxLength', [$t('system.dict.type.typeName'), 100]),
        ),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        class: 'w-full',
      },
      defaultValue: 0,
      fieldName: 'sortOrder',
      label: $t('system.dict.type.sortOrder'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('common.enabled'), value: true },
          { label: $t('common.disabled'), value: false },
        ],
      },
      defaultValue: true,
      fieldName: 'enabled',
      label: $t('system.dict.type.enabled'),
    },
    {
      component: 'Input',
      componentProps: {
        maxlength: 255,
        rows: 3,
        showWordLimit: true,
        type: 'textarea',
      },
      fieldName: 'typeDesc',
      label: $t('system.dict.type.typeDesc'),
    },
  ];
}

// ========== 字典分类表格列配置 ==========

export function useTypeColumns(
  onActionClick?: OnActionClickFn<DictApi.DictType>,
): VxeTableGridOptions<DictApi.DictType>['columns'] {
  return [
    {
      field: 'typeCode',
      title: $t('system.dict.type.typeCode'),
      width: 150,
    },
    {
      field: 'typeName',
      title: $t('system.dict.type.typeName'),
      minWidth: 120,
    },
    {
      field: 'sortOrder',
      title: $t('system.dict.type.sortOrder'),
      width: 80,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'enabled',
      title: $t('system.dict.type.enabled'),
      width: 80,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'typeName',
          nameTitle: $t('system.dict.type.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          { code: 'manage', text: $t('system.dict.manageItems') },
          'edit',
          {
            code: 'delete',
            disabled: (row: DictApi.DictType) => Boolean(row.sysBuildIn),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.dict.type.operation'),
      width: 180,
    },
  ];
}

// ========== 字典明细表单配置 ==========

export function useItemFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'itemCode',
      label: $t('system.dict.item.itemCode'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.dict.item.itemCode')]))
        .max(
          50,
          $t('ui.formRules.maxLength', [$t('system.dict.item.itemCode'), 50]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'itemLabel',
      label: $t('system.dict.item.itemLabel'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.dict.item.itemLabel')]))
        .max(
          100,
          $t('ui.formRules.maxLength', [$t('system.dict.item.itemLabel'), 100]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'itemValue',
      label: $t('system.dict.item.itemValue'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        class: 'w-full',
      },
      defaultValue: 0,
      fieldName: 'sortOrder',
      label: $t('system.dict.item.sortOrder'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('common.enabled'), value: true },
          { label: $t('common.disabled'), value: false },
        ],
      },
      defaultValue: true,
      fieldName: 'enabled',
      label: $t('system.dict.item.enabled'),
    },
    {
      component: 'Input',
      componentProps: {
        maxlength: 255,
        rows: 3,
        showWordLimit: true,
        type: 'textarea',
      },
      fieldName: 'itemDesc',
      label: $t('system.dict.item.itemDesc'),
    },
  ];
}

// ========== 字典明细表格列配置 ==========

export function useItemColumns(
  onActionClick?: OnActionClickFn<DictApi.DictItem>,
  onStatusChange?: (
    newStatus: any,
    row: DictApi.DictItem,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions<DictApi.DictItem>['columns'] {
  return [
    {
      field: 'itemCode',
      title: $t('system.dict.item.itemCode'),
      width: 120,
    },
    {
      field: 'itemLabel',
      title: $t('system.dict.item.itemLabel'),
      width: 150,
    },
    {
      field: 'itemValue',
      title: $t('system.dict.item.itemValue'),
      width: 120,
    },
    {
      field: 'sortOrder',
      title: $t('system.dict.item.sortOrder'),
      width: 80,
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          checkedValue: true,
          uncheckedValue: false,
        },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'enabled',
      title: $t('system.dict.item.enabled'),
      width: 80,
    },
    {
      field: 'itemDesc',
      title: $t('system.dict.item.itemDesc'),
      minWidth: 150,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'itemLabel',
          nameTitle: $t('system.dict.item.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit',
          {
            code: 'delete',
            disabled: (row: DictApi.DictItem) => Boolean(row.sysBuildIn),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.dict.item.operation'),
      width: 120,
    },
  ];
}
