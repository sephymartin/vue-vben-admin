import { describe, expect, it } from 'vitest';

import enSystem from '../langs/en-US/system.json';
import zhSystem from '../langs/zh-CN/system.json';

describe('schedule job locale messages', () => {
  it('avoids raw JSON braces in help text to prevent i18n placeholder parsing', () => {
    expect(enSystem.scheduleJob.validation.jobParamsHelp).not.toContain(
      '{"key":"value"}',
    );
    expect(zhSystem.scheduleJob.validation.jobParamsHelp).not.toContain(
      '{"key":"value"}',
    );
  });
});
