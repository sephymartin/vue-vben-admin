import { describe, expect, it } from 'vitest';

import {
  isSystemStatusDisabled,
  isSystemStatusEnabled,
  normalizeSystemStatus,
  resolveSystemStatusActionState,
  SYSTEM_STATUS,
} from '../system-status';

describe('system status helpers', () => {
  it('normalizes status values case-insensitively', () => {
    expect(normalizeSystemStatus('enabled')).toBe(SYSTEM_STATUS.ENABLED);
    expect(normalizeSystemStatus('DISABLED')).toBe(SYSTEM_STATUS.DISABLED);
  });

  it('returns unknown for unsupported status values', () => {
    expect(normalizeSystemStatus('paused')).toBe('UNKNOWN');
    expect(normalizeSystemStatus(undefined)).toBe('UNKNOWN');
  });

  it('provides reusable status checks and action state', () => {
    expect(isSystemStatusEnabled('ENABLED')).toBe(true);
    expect(isSystemStatusDisabled('ENABLED')).toBe(false);

    expect(resolveSystemStatusActionState('DISABLED')).toEqual({
      canDisable: false,
      canEnable: true,
    });
  });
});
