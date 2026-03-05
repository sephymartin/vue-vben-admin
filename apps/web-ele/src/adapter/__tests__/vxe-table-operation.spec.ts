import { describe, expect, it } from 'vitest';

import {
  buildOperationPopconfirmSlots,
  normalizeOperationButtonOption,
} from '../vxe-table-operation';

describe('normalizeOperationButtonOption', () => {
  it('uses string text as label and removes it from button props', () => {
    const result = normalizeOperationButtonOption({
      code: 'disable',
      disabled: false,
      text: '禁用',
      type: 'danger',
    });

    expect(result.label).toBe('禁用');
    expect(result.buttonProps).toEqual({
      code: 'disable',
      disabled: false,
      type: 'danger',
    });
  });

  it('keeps boolean text prop for element-plus style', () => {
    const result = normalizeOperationButtonOption({
      code: 'preview',
      text: true,
      type: 'primary',
    });

    expect(result.label).toBe('');
    expect(result.buttonProps).toEqual({
      code: 'preview',
      text: true,
      type: 'primary',
    });
  });

  it('prefers label over text when both are provided', () => {
    const result = normalizeOperationButtonOption({
      code: 'enable',
      label: '启用',
      text: '禁用',
    });

    expect(result.label).toBe('启用');
    expect(result.buttonProps).toEqual({
      code: 'enable',
    });
  });

  it('creates popconfirm slots with reference trigger only', () => {
    const vnode = { __fake: true };
    const slots = buildOperationPopconfirmSlots(() => vnode);

    expect(Object.keys(slots)).toEqual(['reference']);
    expect(slots.reference()).toBe(vnode);
  });
});
