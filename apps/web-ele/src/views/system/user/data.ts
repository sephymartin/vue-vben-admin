import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api/system/user';

import { z } from '#/adapter/form';
import { adaptDeptData, getDeptList } from '#/api/system/dept';
import { getRoleList } from '#/api/system/role';
import {
  buildEnabledDisabledTagOptions,
  resolveSystemStatusActionState,
  SYSTEM_STATUS,
} from '#/constants/system-status';
import { $t } from '#/locales';

function getUserStatusOptions() {
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
      fieldName: 'username',
      label: $t('system.user.username'),
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', [$t('system.user.username'), 2]))
        .max(
          20,
          $t('ui.formRules.maxLength', [$t('system.user.username'), 20]),
        ),
    },
    {
      component: 'Input',
      componentProps: {
        type: 'password',
        showPassword: true,
      },
      dependencies: {
        show: (values) => !values.id,
        triggerFields: ['id'],
      },
      fieldName: 'pwd',
      label: $t('system.user.password'),
      rules: z
        .string()
        .min(6, $t('ui.formRules.minLength', [$t('system.user.password'), 6]))
        .optional(),
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
    },
    {
      component: 'Input',
      fieldName: 'mobile',
      label: $t('system.user.mobile'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
      rules: z
        .string()
        .email($t('ui.formRules.invalidEmail'))
        .optional()
        .or(z.literal('')),
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        clearable: true,
        api: getDeptList,
        afterFetch: adaptDeptData,
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
      },
      fieldName: 'deptId',
      label: $t('system.user.dept'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        clearable: true,
        multiple: true,
        api: async () => {
          const res = await getRoleList({});
          return Array.isArray(res) ? res : (res as any).items || [];
        },
        labelField: 'name',
        valueField: 'id',
        class: 'w-full',
      },
      fieldName: 'roleIds',
      label: $t('system.user.role'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: getUserStatusOptions().map((item) => ({
          label: item.label,
          value: item.value,
        })),
      },
      defaultValue: SYSTEM_STATUS.ENABLED,
      fieldName: 'userStatus',
      label: $t('system.user.status'),
    },
    {
      component: 'Input',
      componentProps: {
        maxlength: 200,
        rows: 3,
        showWordLimit: true,
        type: 'textarea',
      },
      fieldName: 'remark',
      label: $t('system.user.remark'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
    },
    {
      component: 'Input',
      fieldName: 'mobile',
      label: $t('system.user.mobile'),
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        options: getUserStatusOptions().map((item) => ({
          label: item.label,
          value: item.value,
        })),
      },
      fieldName: 'userStatus',
      label: $t('system.user.status'),
    },
    {
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
      },
      fieldName: 'createdTime',
      label: $t('system.user.createTime'),
    },
  ];
}

export function useColumns<T = SystemUserApi.SystemUser>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'username',
      title: $t('system.user.username'),
      width: 120,
    },
    {
      field: 'nickname',
      title: $t('system.user.nickname'),
      minWidth: 120,
    },
    {
      field: 'mobile',
      title: $t('system.user.mobile'),
      width: 140,
    },
    {
      field: 'email',
      title: $t('system.user.email'),
      minWidth: 180,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: getUserStatusOptions(),
      },
      field: 'userStatus',
      title: $t('system.user.status'),
      width: 100,
    },
    {
      field: 'createdTime',
      title: $t('system.user.createTime'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'username',
          nameTitle: $t('system.user.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'disable',
            disabled: (row: SystemUserApi.SystemUser) =>
              !resolveSystemStatusActionState(row.userStatus).canDisable,
            text: $t('system.user.actions.disable'),
          },
          {
            code: 'enable',
            disabled: (row: SystemUserApi.SystemUser) =>
              !resolveSystemStatusActionState(row.userStatus).canEnable,
            text: $t('system.user.actions.enable'),
          },
          'edit',
          'delete',
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      width: 230,
    },
  ];
}
