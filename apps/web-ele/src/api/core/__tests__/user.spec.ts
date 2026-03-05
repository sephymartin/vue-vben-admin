import { beforeEach, describe, expect, it, vi } from 'vitest';

const getMock = vi.fn();

vi.mock('#/api/request', () => ({
  requestClient: {
    get: getMock,
  },
}));

describe('core user api', () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it('maps backend permissions to both roles and permissions fields', async () => {
    getMock.mockResolvedValue({
      avatar: 'avatar.png',
      permissions: ['system:schedule-job:operate', 'system:schedule-job:edit'],
      realName: 'Admin',
      userId: '1',
      username: 'admin',
    });

    const { getUserInfoApi } = await import('../user');
    const result = await getUserInfoApi();

    expect(getMock).toHaveBeenCalledWith('/admin/user/info');
    expect(result.roles).toEqual([
      'system:schedule-job:operate',
      'system:schedule-job:edit',
    ]);
    expect((result as any).permissions).toEqual([
      'system:schedule-job:operate',
      'system:schedule-job:edit',
    ]);
  });
});
