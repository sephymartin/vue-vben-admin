import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:credit-card',
      order: 9996,
      title: $t('saobei.title'),
      authority: 'saobei:view',
    },
    name: 'Saobei',
    path: '/saobei',
    children: [
      {
        path: '/saobei/merchant',
        name: 'SaobeiMerchant',
        meta: {
          icon: 'mdi:store',
          title: $t('saobei.merchant.title'),
          authority: 'saobei:merchant:view',
        },
        component: () => import('#/views/saobei/merchant/list.vue'),
      },
      {
        path: '/saobei/token',
        name: 'SaobeiToken',
        meta: {
          icon: 'mdi:key',
          title: $t('saobei.token.title'),
          authority: 'saobei:token:view',
        },
        component: () => import('#/views/saobei/token/list.vue'),
      },
      {
        path: '/saobei/payment',
        name: 'SaobeiPayment',
        meta: {
          icon: 'mdi:cash-multiple',
          title: $t('saobei.payment.title'),
          authority: 'saobei:payment:view',
        },
        component: () => import('#/views/saobei/payment/list.vue'),
      },
    ],
  },
];

export default routes;
