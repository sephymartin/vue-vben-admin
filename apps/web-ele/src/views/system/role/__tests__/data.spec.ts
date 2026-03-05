import { describe, expect, it, vi } from 'vitest';

import { useColumns } from '../data';

vi.mock('#/locales', () => ({
  $t: (key: string) => key,
}));

describe('system role columns', () => {
  it('uses schedule-job style status column and operation actions', () => {
    const columns = useColumns(vi.fn()) ?? [];

    const statusColumn = columns.find((column) => column.field === 'status');
    expect(statusColumn?.cellRender?.name).toBe('CellTag');
    expect(statusColumn?.cellRender?.options).toEqual([
      {
        type: 'success',
        label: 'common.enabled',
        value: 'ENABLED',
      },
      {
        type: 'warning',
        label: 'common.disabled',
        value: 'DISABLED',
      },
    ]);

    const operationColumn = columns.find(
      (column) => column.field === 'operation',
    );
    const options = (operationColumn?.cellRender?.options ?? []) as Array<any>;
    const enableOption = options.find((option) => option.code === 'enable');
    const disableOption = options.find((option) => option.code === 'disable');

    expect(enableOption).toBeTruthy();
    expect(disableOption).toBeTruthy();
    expect(enableOption.disabled({ status: 'ENABLED' })).toBe(true);
    expect(enableOption.disabled({ status: 'DISABLED' })).toBe(false);
    expect(disableOption.disabled({ status: 'ENABLED' })).toBe(false);
    expect(disableOption.disabled({ status: 'DISABLED' })).toBe(true);
  });
});
