export type ScheduleJobActionAuthorities = {
  canAdd: boolean;
  canDelete: boolean;
  canEdit: boolean;
  canOperate: boolean;
};

const WILDCARD_PERMISSION = '*:*:*';

export function hasScheduleJobPermission(
  permissions: string[],
  requiredPermission: string,
) {
  return (
    permissions.includes(WILDCARD_PERMISSION) ||
    permissions.includes(requiredPermission)
  );
}

export function resolveScheduleJobAuthorities(
  permissions: string[],
): ScheduleJobActionAuthorities {
  return {
    canAdd: hasScheduleJobPermission(permissions, 'system:schedule-job:add'),
    canDelete: hasScheduleJobPermission(
      permissions,
      'system:schedule-job:delete',
    ),
    canEdit: hasScheduleJobPermission(permissions, 'system:schedule-job:edit'),
    canOperate: hasScheduleJobPermission(
      permissions,
      'system:schedule-job:operate',
    ),
  };
}

export function buildScheduleJobOperationCodes(
  authorities: Pick<
    ScheduleJobActionAuthorities,
    'canDelete' | 'canEdit' | 'canOperate'
  >,
) {
  const codes: string[] = [];

  if (authorities.canOperate) {
    codes.push('logs', 'execute', 'enable', 'disable');
  }

  if (authorities.canEdit) {
    codes.push('edit');
  }

  if (authorities.canDelete) {
    codes.push('delete');
  }

  return codes;
}
