import { describe, expect, it } from 'vitest';

import {
  buildScheduleJobOperationCodes,
  hasScheduleJobPermission,
} from '../authority';

describe('schedule-job authority helpers', () => {
  it('allows all permissions for wildcard users', () => {
    expect(hasScheduleJobPermission(['*:*:*'], 'system:schedule-job:add')).toBe(
      true,
    );
  });

  it('builds operation codes from simplified authority set', () => {
    const codes = buildScheduleJobOperationCodes({
      canDelete: true,
      canEdit: false,
      canOperate: true,
    });

    expect(codes).toEqual(['logs', 'execute', 'enable', 'disable', 'delete']);
  });
});
