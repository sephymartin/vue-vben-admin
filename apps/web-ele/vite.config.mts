import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            // 移除 rewrite，保留 /api 前缀直接转发到后端
            target: 'http://localhost:8080',
            ws: true,
          },
        },
      },
    },
  };
});
