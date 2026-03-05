import { beforeEach, describe, expect, it, vi } from 'vitest';

const postMock = vi.fn();

vi.mock('#/api/request', () => ({
  requestClient: {
    post: postMock,
  },
}));

describe('saobei token api', () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it('sends update token request with id params and tokenString payload', async () => {
    postMock.mockResolvedValue(undefined);

    const { updateTokenString } = await import('../token');

    await updateTokenString(12, 'long-token-content');

    expect(postMock).toHaveBeenCalledWith(
      '/admin/saobei/token/updateTokenString',
      { tokenString: 'long-token-content' },
      {
        params: { id: 12 },
      },
    );
  });
});
