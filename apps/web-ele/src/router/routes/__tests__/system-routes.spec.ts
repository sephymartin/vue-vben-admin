import { describe, expect, it, vi } from 'vitest';

import systemRoutes from '../modules/system';

vi.mock('#/locales', () => ({
  $t: (key: string) => key,
}));

describe('system routes', () => {
  it('does not expose menu management route', () => {
    const systemRoute = systemRoutes.find((route) => route.name === 'System');
    const children = systemRoute?.children ?? [];

    expect(children.some((route) => route.name === 'SystemMenu')).toBe(false);
    expect(children.some((route) => route.path === '/system/menu')).toBe(false);
  });
});
