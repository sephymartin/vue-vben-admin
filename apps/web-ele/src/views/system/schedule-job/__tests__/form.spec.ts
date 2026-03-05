import { describe, expect, it, vi } from 'vitest';

import { resolveJobStatusActionState } from '../helpers';

vi.mock('#/locales', () => ({
  $t: (key: string) => key,
}));

describe('schedule-job form/list safety', () => {
  it('falls back safely when jobStatus is unknown', () => {
    const result = resolveJobStatusActionState('PAUSED');

    expect(result.canDisable).toBe(false);
    expect(result.canEnable).toBe(false);
  });
});
