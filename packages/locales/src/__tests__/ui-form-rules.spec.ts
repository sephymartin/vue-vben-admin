import { describe, expect, it } from 'vitest';

import enUSUI from '../langs/en-US/ui.json';
import zhCNUI from '../langs/zh-CN/ui.json';

describe('ui form rules locales', () => {
  it('defines invalidEmail message in zh-CN and en-US', () => {
    expect(zhCNUI.formRules.invalidEmail).toBeTruthy();
    expect(enUSUI.formRules.invalidEmail).toBeTruthy();
  });
});
