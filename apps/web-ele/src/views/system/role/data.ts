import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api/system/role';

import {
  buildEnabledDisabledTagOptions,
  resolveSystemStatusActionState,
  SYSTEM_STATUS,
} from '#/constants/system-status';
import { $t } from '#/locales';

function getRoleStatusOptions() {
  return buildEnabledDisabledTagOptions(
    SYSTEM_STATUS.ENABLED,
    SYSTEM_STATUS.DISABLED,
    $t('common.enabled'),
    $t('common.disabled'),
  );
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.role.roleName'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: getRoleStatusOptions().map((item) => ({
          label: item.label,
          value: item.value,
        })),
      },
      defaultValue: SYSTEM_STATUS.ENABLED,
      fieldName: 'status',
      label: $t('system.role.status'),
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
      },
      fieldName: 'remark',
      label: $t('system.role.remark'),
    },
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      label: $t('system.role.setPermissions'),
      modelPropName: 'modelValue',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.role.roleName'),
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: $t('system.role.roleCode'),
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        options: getRoleStatusOptions().map((item) => ({
          label: item.label,
          value: item.value,
        })),
      },
      fieldName: 'status',
      label: $t('system.role.status'),
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: $t('system.role.remark'),
    },
    {
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
      },
      fieldName: 'createTime',
      label: $t('system.role.createTime'),
    },
  ];
}

export function useColumns<T = SystemRoleApi.SystemRole>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: $t('system.role.roleName'),
      width: 200,
    },
    {
      field: 'code',
      title: $t('system.role.roleCode'),
      width: 200,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: getRoleStatusOptions(),
      },
      field: 'status',
      title: $t('system.role.status'),
      width: 100,
    },
    {
      field: 'remark',
      minWidth: 100,
      title: $t('system.role.remark'),
    },
    {
      field: 'createTime',
      title: $t('system.role.createTime'),
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.role.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'disable',
            disabled: (row: SystemRoleApi.SystemRole) =>
              !resolveSystemStatusActionState(row.status).canDisable,
            text: $t('system.role.actions.disable'),
          },
          {
            code: 'enable',
            disabled: (row: SystemRoleApi.SystemRole) =>
              !resolveSystemStatusActionState(row.status).canEnable,
            text: $t('system.role.actions.enable'),
          },
          'edit',
          'delete',
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.role.operation'),
      width: 240,
    },
  ];
}
