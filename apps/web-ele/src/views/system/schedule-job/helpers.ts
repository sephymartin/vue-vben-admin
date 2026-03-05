import {
  normalizeSystemStatus,
  resolveSystemStatusActionState,
} from '#/constants/system-status';
import { $t } from '#/locales';

export type KnownJobStatus = 'DISABLED' | 'ENABLED';

export function normalizeJobStatus(
  status?: string,
): 'UNKNOWN' | KnownJobStatus {
  return normalizeSystemStatus(status);
}

export function resolveJobStatusActionState(status?: string) {
  return resolveSystemStatusActionState(status);
}

export function parseJobParamsText(text?: string): {
  error?: string;
  value?: Record<string, any>;
} {
  if (!text || text.trim().length === 0) {
    return { value: undefined };
  }

  try {
    const parsed = JSON.parse(text);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {
        error: $t('system.scheduleJob.validation.jobParamsMustObject'),
      };
    }

    return { value: parsed };
  } catch {
    return {
      error: $t('system.scheduleJob.validation.jobParamsInvalidJson'),
    };
  }
}

export function formatJobParamsForForm(
  jobParams?: Record<string, any>,
): string | undefined {
  if (!jobParams || Object.keys(jobParams).length === 0) {
    return undefined;
  }
  return JSON.stringify(jobParams, null, 2);
}
