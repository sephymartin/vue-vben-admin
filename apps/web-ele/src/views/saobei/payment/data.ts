import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SaobeiPaymentApi } from '#/api/saobei/payment';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'merchantNo',
      label: $t('saobei.payment.merchantNo'),
    },
    {
      component: 'Input',
      fieldName: 'merchantOrderNo',
      label: $t('saobei.payment.merchantOrderNo'),
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        options: [
          { label: $t('saobei.payment.paymentStatus.INIT'), value: 'INIT' },
          {
            label: $t('saobei.payment.paymentStatus.SUCCESS'),
            value: 'SUCCESS',
          },
          { label: $t('saobei.payment.paymentStatus.ERROR'), value: 'ERROR' },
          {
            label: $t('saobei.payment.paymentStatus.CANCELLED'),
            value: 'CANCELLED',
          },
        ],
      },
      fieldName: 'paymentStatus',
      label: $t('saobei.payment.paymentStatus.label'),
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        options: [
          { label: $t('saobei.payment.notifyStatus.INIT'), value: 'INIT' },
          {
            label: $t('saobei.payment.notifyStatus.PROCESSING'),
            value: 'PROCESSING',
          },
          {
            label: $t('saobei.payment.notifyStatus.SUCCESS'),
            value: 'SUCCESS',
          },
          { label: $t('saobei.payment.notifyStatus.FAILED'), value: 'FAILED' },
        ],
      },
      fieldName: 'notifyStatus',
      label: $t('saobei.payment.notifyStatus.label'),
    },
    {
      component: 'Input',
      fieldName: 'batchNo',
      label: $t('saobei.payment.batchNo'),
    },
    {
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
      },
      fieldName: 'createdAt',
      label: $t('saobei.payment.createdAt'),
    },
  ];
}

export function useColumns<T = SaobeiPaymentApi.SaobeiPayment>(
  _onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'title',
      title: $t('saobei.payment.orderTitle'),
      minWidth: 180,
    },
    {
      field: 'amount',
      title: $t('saobei.payment.amount'),
      width: 120,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Intl.NumberFormat('zh-CN', {
          style: 'currency',
          currency: 'CNY',
        }).format(cellValue);
      },
    },
    {
      field: 'merchantOrderNo',
      title: $t('saobei.payment.merchantOrderNo'),
      minWidth: 180,
    },
    {
      field: 'merchantNo',
      title: $t('saobei.payment.merchantNo'),
      width: 150,
    },
    {
      field: 'batchNo',
      title: $t('saobei.payment.batchNo'),
      minWidth: 180,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          {
            label: $t('saobei.payment.paymentStatus.INIT'),
            type: 'warning',
            value: 'INIT',
          },
          {
            label: $t('saobei.payment.paymentStatus.SUCCESS'),
            type: 'success',
            value: 'SUCCESS',
          },
          {
            label: $t('saobei.payment.paymentStatus.ERROR'),
            type: 'danger',
            value: 'ERROR',
          },
          {
            label: $t('saobei.payment.paymentStatus.CANCELLED'),
            type: 'info',
            value: 'CANCELLED',
          },
        ],
      },
      field: 'paymentStatus',
      title: $t('saobei.payment.paymentStatus.label'),
      width: 120,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          {
            label: $t('saobei.payment.notifyStatus.INIT'),
            type: 'info',
            value: 'INIT',
          },
          {
            label: $t('saobei.payment.notifyStatus.PROCESSING'),
            type: 'warning',
            value: 'PROCESSING',
          },
          {
            label: $t('saobei.payment.notifyStatus.SUCCESS'),
            type: 'success',
            value: 'SUCCESS',
          },
          {
            label: $t('saobei.payment.notifyStatus.FAILED'),
            type: 'danger',
            value: 'FAILED',
          },
        ],
      },
      field: 'notifyStatus',
      title: $t('saobei.payment.notifyStatus.label'),
      width: 120,
    },
    {
      field: 'notifyCount',
      title: $t('saobei.payment.notifyCount'),
      width: 100,
    },
    {
      field: 'notifyTime',
      title: $t('saobei.payment.notifyTime'),
      width: 180,
    },
    {
      field: 'nextNotifyTime',
      title: $t('saobei.payment.nextNotifyTime'),
      width: 180,
    },
    {
      field: 'errorMsg',
      title: $t('saobei.payment.errorMsg'),
      minWidth: 220,
    },
    {
      field: 'beginTime',
      title: $t('saobei.payment.beginTime'),
      width: 180,
    },
    {
      field: 'endTime',
      title: $t('saobei.payment.endTime'),
      width: 180,
    },
    {
      field: 'createdAt',
      title: $t('saobei.payment.createdAt'),
      width: 180,
    },
  ];
}
