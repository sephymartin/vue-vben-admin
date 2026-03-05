import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:settings-outline',
      order: 9997,
      title: $t('system.title'),
      authority: 'system:view',
    },
    name: 'System',
    path: '/system',
    children: [
      {
        path: '/system/user',
        name: 'SystemUser',
        meta: {
          icon: 'mdi:account',
          title: $t('system.user.title'),
          authority: 'system:user:view',
        },
        component: () => import('#/views/system/user/list.vue'),
      },
      {
        path: '/system/role',
        name: 'SystemRole',
        meta: {
          icon: 'mdi:account-group',
          title: $t('system.role.title'),
          authority: 'system:role:view',
        },
        component: () => import('#/views/system/role/list.vue'),
      },
      {
        path: '/system/dept',
        name: 'SystemDept',
        meta: {
          icon: 'charm:organisation',
          title: $t('system.dept.title'),
          authority: 'system:dept:view',
        },
        component: () => import('#/views/system/dept/list.vue'),
      },
      {
        path: '/system/dict',
        name: 'SystemDict',
        meta: {
          icon: 'mdi:book-alphabet',
          title: $t('system.dict.title'),
          authority: 'system:dict:view',
        },
        component: () => import('#/views/system/dict/list.vue'),
      },
      {
        path: '/system/schedule-job',
        name: 'SystemScheduleJob',
        meta: {
          icon: 'mdi:calendar-clock-outline',
          title: $t('system.scheduleJob.title'),
          authority: 'system:schedule-job:view',
        },
        component: () => import('#/views/system/schedule-job/list.vue'),
      },
    ],
  },
];

export default routes;
