import { describe, expect, it, vi } from 'vitest';

import { parseJobParamsText } from '../helpers';

vi.mock('#/locales', () => ({
  $t: (key: string) => key,
}));

describe('schedule-job data helpers', () => {
  it('parses valid JSON object text', () => {
    const result = parseJobParamsText('{"retry":3,"enabled":true}');

    expect(result.error).toBeUndefined();
    expect(result.value).toEqual({
      enabled: true,
      retry: 3,
    });
  });

  it('returns useful error for invalid JSON', () => {
    const result = parseJobParamsText('{"retry":}');

    expect(result.error).toBeTruthy();
  });

  it('rejects non-object JSON', () => {
    const result = parseJobParamsText('[1,2,3]');

    expect(result.error).toBeTruthy();
    expect(result.value).toBeUndefined();
  });
});
