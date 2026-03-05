import type { ScheduleJobActionAuthorities } from './authority';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ScheduleJobApi } from '#/api/system/schedule-job';

import { z } from '#/adapter/form';
import {
  buildEnabledDisabledTagOptions,
  SYSTEM_STATUS,
} from '#/constants/system-status';
import { $t } from '#/locales';

import { buildScheduleJobOperationCodes } from './authority';
import { parseJobParamsText, resolveJobStatusActionState } from './helpers';

export {
  formatJobParamsForForm,
  parseJobParamsText,
  resolveJobStatusActionState,
} from './helpers';

export function getJobStatusOptions() {
  return buildEnabledDisabledTagOptions(
    SYSTEM_STATUS.ENABLED,
    SYSTEM_STATUS.DISABLED,
    $t('system.scheduleJob.status.enabled'),
    $t('system.scheduleJob.status.disabled'),
  );
}

export function getLogStatusOptions() {
  return [
    {
      color: 'warning',
      label: $t('system.scheduleJob.log.executeStatus.running'),
      value: 'RUNNING',
    },
    {
      color: 'success',
      label: $t('system.scheduleJob.log.executeStatus.success'),
      value: 'SUCCESS',
    },
    {
      color: 'danger',
      label: $t('system.scheduleJob.log.executeStatus.failed'),
      value: 'FAILED',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'jobName',
      label: $t('system.scheduleJob.fields.jobName'),
    },
    {
      component: 'Input',
      fieldName: 'beanName',
      label: $t('system.scheduleJob.fields.beanName'),
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        options: getJobStatusOptions().map((item) => ({
          label: item.label,
          value: item.value,
        })),
      },
      fieldName: 'jobStatus',
      label: $t('system.scheduleJob.fields.jobStatus'),
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'jobName',
      label: $t('system.scheduleJob.fields.jobName'),
      componentProps: (values) => ({
        disabled: Boolean(values.id),
      }),
      rules: z
        .string()
        .min(
          1,
          $t('ui.formRules.required', [
            $t('system.scheduleJob.fields.jobName'),
          ]),
        )
        .max(
          120,
          $t('ui.formRules.maxLength', [
            $t('system.scheduleJob.fields.jobName'),
            120,
          ]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'beanName',
      label: $t('system.scheduleJob.fields.beanName'),
      componentProps: (values) => ({
        disabled: Boolean(values.id),
      }),
      rules: z
        .string()
        .min(
          1,
          $t('ui.formRules.required', [
            $t('system.scheduleJob.fields.beanName'),
          ]),
        )
        .max(
          120,
          $t('ui.formRules.maxLength', [
            $t('system.scheduleJob.fields.beanName'),
            120,
          ]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'cronExpression',
      label: $t('system.scheduleJob.fields.cronExpression'),
      rules: z
        .string()
        .min(
          1,
          $t('ui.formRules.required', [
            $t('system.scheduleJob.fields.cronExpression'),
          ]),
        )
        .max(
          120,
          $t('ui.formRules.maxLength', [
            $t('system.scheduleJob.fields.cronExpression'),
            120,
          ]),
        ),
    },
    {
      component: 'RadioGroup',
      componentProps: (values) => ({
        disabled: Boolean(values.id),
        options: getJobStatusOptions().map((item) => ({
          label: item.label,
          value: item.value,
        })),
      }),
      defaultValue: SYSTEM_STATUS.ENABLED,
      fieldName: 'jobStatus',
      label: $t('system.scheduleJob.fields.jobStatus'),
    },
    {
      component: 'Input',
      componentProps: {
        maxlength: 255,
        rows: 3,
        showWordLimit: true,
        type: 'textarea',
      },
      fieldName: 'jobDescription',
      label: $t('system.scheduleJob.fields.jobDescription'),
    },
    {
      component: 'Input',
      componentProps: {
        rows: 6,
        type: 'textarea',
      },
      fieldName: 'jobParams',
      help: $t('system.scheduleJob.validation.jobParamsHelp'),
      label: $t('system.scheduleJob.fields.jobParams'),
      rules: z
        .string()
        .optional()
        .or(z.literal(''))
        .refine((value) => !parseJobParamsText(value).error, {
          message: $t('system.scheduleJob.validation.jobParamsInvalidJson'),
        }),
    },
  ];
}

export function useColumns(
  onActionClick?: OnActionClickFn<ScheduleJobApi.ScheduleJob>,
  authorities: Pick<
    ScheduleJobActionAuthorities,
    'canDelete' | 'canEdit' | 'canOperate'
  > = defaultActionAuthorities,
): VxeTableGridOptions<ScheduleJobApi.ScheduleJob>['columns'] {
  const operationCodes = buildScheduleJobOperationCodes(authorities);
  const operationOptions = operationCodes.map((code) => {
    switch (code) {
      case 'disable': {
        return {
          code: 'disable',
          disabled: (row: ScheduleJobApi.ScheduleJob) =>
            !resolveJobStatusActionState(row.jobStatus).canDisable,
          text: $t('system.scheduleJob.actions.disable'),
        };
      }
      case 'enable': {
        return {
          code: 'enable',
          disabled: (row: ScheduleJobApi.ScheduleJob) =>
            !resolveJobStatusActionState(row.jobStatus).canEnable,
          text: $t('system.scheduleJob.actions.enable'),
        };
      }
      case 'execute': {
        return {
          code: 'execute',
          text: $t('system.scheduleJob.actions.executeNow'),
        };
      }
      case 'logs': {
        return {
          code: 'logs',
          text: $t('system.scheduleJob.actions.logs'),
        };
      }
      default: {
        return code;
      }
    }
  });

  return [
    {
      field: 'jobName',
      title: $t('system.scheduleJob.fields.jobName'),
      width: 160,
    },
    {
      field: 'beanName',
      title: $t('system.scheduleJob.fields.beanName'),
      width: 180,
    },
    {
      field: 'cronExpression',
      title: $t('system.scheduleJob.fields.cronExpression'),
      minWidth: 160,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: getJobStatusOptions(),
      },
      field: 'jobStatus',
      title: $t('system.scheduleJob.fields.jobStatus'),
      width: 110,
    },
    {
      field: 'nextExecuteTime',
      title: $t('system.scheduleJob.fields.nextExecuteTime'),
      width: 180,
    },
    {
      field: 'lastExecuteTime',
      title: $t('system.scheduleJob.fields.lastExecuteTime'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'jobName',
          nameTitle: $t('system.scheduleJob.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: operationOptions,
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.scheduleJob.fields.operation'),
      width: 300,
    },
  ];
}

const defaultActionAuthorities = {
  canDelete: true,
  canEdit: true,
  canOperate: true,
};

export function useLogColumns(
  onActionClick?: OnActionClickFn<ScheduleJobApi.ScheduleJobLog>,
): VxeTableGridOptions<ScheduleJobApi.ScheduleJobLog>['columns'] {
  return [
    {
      field: 'executeTime',
      title: $t('system.scheduleJob.log.fields.executeTime'),
      width: 170,
    },
    {
      field: 'finishTime',
      title: $t('system.scheduleJob.log.fields.finishTime'),
      width: 170,
    },
    {
      field: 'durationMs',
      title: $t('system.scheduleJob.log.fields.durationMs'),
      width: 110,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: getLogStatusOptions(),
      },
      field: 'executeStatus',
      title: $t('system.scheduleJob.log.fields.executeStatus'),
      width: 120,
    },
    {
      field: 'executeResult',
      slots: { default: 'executeResult' },
      title: $t('system.scheduleJob.log.fields.executeResult'),
      minWidth: 220,
    },
    {
      field: 'errorMessage',
      slots: { default: 'errorMessage' },
      title: $t('system.scheduleJob.log.fields.errorMessage'),
      minWidth: 220,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'id',
          nameTitle: $t('system.scheduleJob.log.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'viewResult',
            disabled: (row: ScheduleJobApi.ScheduleJobLog) =>
              !row.executeResult,
            text: $t('system.scheduleJob.log.actions.viewResult'),
          },
          {
            code: 'viewError',
            disabled: (row: ScheduleJobApi.ScheduleJobLog) => !row.errorMessage,
            text: $t('system.scheduleJob.log.actions.viewError'),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.scheduleJob.fields.operation'),
      width: 170,
    },
  ];
}
