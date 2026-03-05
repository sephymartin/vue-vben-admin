import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SaobeiTokenApi } from '#/api/saobei/token';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'userId',
      label: $t('saobei.token.userId'),
    },
    {
      component: 'Input',
      fieldName: 'merchantNo',
      label: $t('saobei.token.merchantNo'),
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        options: [
          { label: $t('saobei.token.expired'), value: true },
          { label: $t('saobei.token.notExpired'), value: false },
        ],
      },
      fieldName: 'expired',
      label: $t('saobei.token.expiredStatus'),
    },
  ];
}

export function useColumns<T = SaobeiTokenApi.SaobeiToken>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'userId',
      title: $t('saobei.token.userId'),
      width: 120,
    },
    {
      field: 'nickname',
      title: $t('saobei.token.nickname'),
      minWidth: 140,
    },
    {
      field: 'merchantName',
      title: $t('saobei.token.merchantName'),
      minWidth: 180,
    },
    {
      field: 'merchantNo',
      title: $t('saobei.token.merchantNo'),
      width: 180,
    },
    {
      field: 'token',
      title: $t('saobei.token.token'),
      minWidth: 240,
    },
    {
      field: 'expiresAt',
      title: $t('saobei.token.expiresAt'),
      width: 180,
    },
    {
      cellRender: {
        name: 'CellTag',
        props: {
          type: (row: T) => {
            const record = row as SaobeiTokenApi.SaobeiToken;
            return record.expired ? 'danger' : 'success';
          },
        },
      },
      field: 'expired',
      title: $t('saobei.token.expiredStatus'),
      width: 120,
    },
    {
      field: 'createdAt',
      title: $t('saobei.token.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'merchantNo',
          nameTitle: $t('saobei.token.merchantNo'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'refreshToken',
            text: $t('saobei.token.actions.refreshToken'),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('saobei.token.operation'),
      width: 140,
    },
  ];
}
