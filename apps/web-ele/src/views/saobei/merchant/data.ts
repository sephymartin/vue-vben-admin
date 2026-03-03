import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SaobeiMerchantApi } from '#/api/saobei/merchant';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'merchantNo',
      label: $t('saobei.merchant.merchantNo'),
    },
    {
      component: 'Input',
      fieldName: 'merchantName',
      label: $t('saobei.merchant.merchantName'),
    },
  ];
}

export function useColumns<T = SaobeiMerchantApi.SaobeiMerchant>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'merchantNo',
      title: $t('saobei.merchant.merchantNo'),
      width: 200,
    },
    {
      field: 'merchantName',
      title: $t('saobei.merchant.merchantName'),
      width: 200,
    },
    {
      field: 'merchantSecret',
      title: $t('saobei.merchant.merchantSecret'),
      width: 200,
    },
    {
      cellRender: {
        name: 'CellTag',
        props: {
          type: (row: T) => {
            const record = row as SaobeiMerchantApi.SaobeiMerchant;
            return record.skipSignature ? 'success' : 'info';
          },
        },
      },
      field: 'skipSignature',
      title: $t('saobei.merchant.skipSignature'),
      width: 150,
    },
    {
      field: 'createdAt',
      title: $t('saobei.merchant.createdAt'),
      width: 200,
    },
    {
      field: 'updatedAt',
      title: $t('saobei.merchant.updatedAt'),
      width: 200,
    },
  ];
}
