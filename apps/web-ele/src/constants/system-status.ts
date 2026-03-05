export const SYSTEM_STATUS = {
  DISABLED: 'DISABLED',
  ENABLED: 'ENABLED',
} as const;

export type KnownSystemStatus =
  (typeof SYSTEM_STATUS)[keyof typeof SYSTEM_STATUS];

export type NormalizedSystemStatus = 'UNKNOWN' | KnownSystemStatus;

export type StatusTagOption<TValue> = {
  label: string;
  type: 'danger' | 'info' | 'primary' | 'success' | 'warning';
  value: TValue;
};

export function normalizeSystemStatus(status?: null | number | string) {
  const normalized = String(status ?? '')
    .trim()
    .toUpperCase();

  if (normalized === SYSTEM_STATUS.ENABLED || normalized === '1') {
    return SYSTEM_STATUS.ENABLED;
  }

  if (normalized === SYSTEM_STATUS.DISABLED || normalized === '0') {
    return SYSTEM_STATUS.DISABLED;
  }

  return 'UNKNOWN';
}

export function isSystemStatusEnabled(status?: null | number | string) {
  return normalizeSystemStatus(status) === SYSTEM_STATUS.ENABLED;
}

export function isSystemStatusDisabled(status?: null | number | string) {
  return normalizeSystemStatus(status) === SYSTEM_STATUS.DISABLED;
}

export function resolveSystemStatusActionState(
  status?: null | number | string,
) {
  const normalizedStatus = normalizeSystemStatus(status);
  return {
    canDisable: normalizedStatus === SYSTEM_STATUS.ENABLED,
    canEnable: normalizedStatus === SYSTEM_STATUS.DISABLED,
  };
}

export function buildEnabledDisabledTagOptions<TEnabled, TDisabled>(
  enabledValue: TEnabled,
  disabledValue: TDisabled,
  enabledLabel: string,
  disabledLabel: string,
): Array<StatusTagOption<TDisabled | TEnabled>> {
  return [
    {
      type: 'success',
      label: enabledLabel,
      value: enabledValue,
    },
    {
      type: 'warning',
      label: disabledLabel,
      value: disabledValue,
    },
  ];
}
