import type { Recordable } from '@vben/types';

import { isString } from '@vben/utils';

import { objectOmit } from '@vueuse/core';

type OperationButtonOption = Recordable<any>;

type OperationPopconfirmSlots = {
  reference: () => unknown;
};

export function normalizeOperationButtonOption(opt: OperationButtonOption): {
  buttonProps: OperationButtonOption;
  label: string;
} {
  if (isString(opt.label)) {
    return {
      buttonProps: objectOmit(opt, ['label', 'text']),
      label: opt.label,
    };
  }

  if (isString(opt.text)) {
    return {
      buttonProps: objectOmit(opt, ['text']),
      label: opt.text,
    };
  }

  return {
    buttonProps: objectOmit(opt, ['label']),
    label: '',
  };
}

export function buildOperationPopconfirmSlots(
  renderReference: () => unknown,
): OperationPopconfirmSlots {
  return {
    reference: renderReference,
  };
}
