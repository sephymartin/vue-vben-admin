import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:settings-outline',
      order: 9997,
      title: $t('invest.title'),
    },
    name: 'Invest',
    path: '/invest',
    children: [
      {
        path: '/invest/project',
        name: 'InvestProject',
        meta: {
          icon: 'mdi:account-group',
          title: $t('invest.project.title'),
        },
        component: () => import('#/views/invest/project/list.vue'),
      },
      {
        path: '/invest/user',
        name: 'InvestUser',
        meta: {
          icon: 'mdi:account-group',
          title: $t('invest.user.title'),
        },
        component: () => import('#/views/invest/user/list.vue'),
      },
    ],
  },
];

export default routes;
