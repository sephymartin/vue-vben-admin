import type { BackendPagingResult, PagingResult } from '#/api/types';

import { requestClient } from '#/api/request';
import { transformPagingResult } from '#/api/types';

export namespace ScheduleJobApi {
  export type JobStatus = 'DISABLED' | 'ENABLED' | string;

  export interface ScheduleJob {
    [key: string]: any;
    id: number;
    jobName: string;
    jobDescription?: string;
    beanName: string;
    cronExpression: string;
    jobParams?: Record<string, any>;
    jobStatus: JobStatus;
    lastExecuteTime?: string;
    nextExecuteTime?: string;
    createdTime?: string;
    updatedTime?: string;
  }

  export interface ScheduleJobLog {
    [key: string]: any;
    id: number;
    jobId: number;
    jobName: string;
    executeTime?: string;
    finishTime?: string;
    durationMs?: number;
    executeStatus: 'FAILED' | 'RUNNING' | 'SUCCESS' | string;
    executeResult?: string;
    errorMessage?: string;
    createdTime?: string;
  }

  export interface QueryScheduleJobParams {
    pageNum: number;
    pageSize: number;
    jobName?: string;
    beanName?: string;
    jobStatus?: JobStatus;
  }

  export interface QueryScheduleJobLogParams {
    pageNum: number;
    pageSize: number;
    jobId?: number;
  }

  export interface CreateScheduleJobParams {
    jobName: string;
    jobDescription?: string;
    beanName: string;
    cronExpression: string;
    jobParams?: Record<string, any> | string;
    jobStatus?: JobStatus;
  }

  export interface UpdateScheduleJobParams {
    id: number;
    jobDescription?: string;
    cronExpression?: string;
    jobParams?: Record<string, any> | string;
  }
}

function toJobParamsObject(
  jobParams?: Record<string, any> | string,
): Record<string, any> | undefined {
  if (typeof jobParams === 'string') {
    const trimmed = jobParams.trim();
    if (!trimmed) return undefined;
    return JSON.parse(trimmed);
  }
  return jobParams;
}

async function queryScheduleJobs(
  params: ScheduleJobApi.QueryScheduleJobParams,
): Promise<PagingResult<ScheduleJobApi.ScheduleJob>> {
  const { pageNum, pageSize, ...query } = params;
  const res = await requestClient.post<
    BackendPagingResult<ScheduleJobApi.ScheduleJob>
  >('/admin/schedule/job/list', query, {
    params: { pageNum, pageSize },
  });
  return transformPagingResult(res);
}

async function getScheduleJob(id: number) {
  return requestClient.get<ScheduleJobApi.ScheduleJob>(
    `/admin/schedule/job/${id}`,
  );
}

async function queryScheduleJobLogs(
  params: ScheduleJobApi.QueryScheduleJobLogParams,
): Promise<PagingResult<ScheduleJobApi.ScheduleJobLog>> {
  const { jobId, pageNum, pageSize } = params;
  const res = await requestClient.post<
    BackendPagingResult<ScheduleJobApi.ScheduleJobLog>
  >('/admin/schedule/job/log/list', null, {
    params: {
      jobId,
      pageNum,
      pageSize,
    },
  });
  return transformPagingResult(res);
}

async function createScheduleJob(data: ScheduleJobApi.CreateScheduleJobParams) {
  return requestClient.post('/admin/schedule/job/create', {
    ...data,
    jobParams: toJobParamsObject(data.jobParams),
  });
}

async function updateScheduleJob(data: ScheduleJobApi.UpdateScheduleJobParams) {
  return requestClient.post('/admin/schedule/job/update', {
    ...data,
    jobParams: toJobParamsObject(data.jobParams),
  });
}

async function deleteScheduleJob(id: number) {
  return requestClient.post('/admin/schedule/job/delete', null, {
    params: { id },
  });
}

async function enableScheduleJob(id: number) {
  return requestClient.post('/admin/schedule/job/enable', null, {
    params: { id },
  });
}

async function disableScheduleJob(id: number) {
  return requestClient.post('/admin/schedule/job/disable', null, {
    params: { id },
  });
}

async function executeScheduleJob(id: number) {
  return requestClient.post('/admin/schedule/job/execute', null, {
    params: { id },
  });
}

export {
  createScheduleJob,
  deleteScheduleJob,
  disableScheduleJob,
  enableScheduleJob,
  executeScheduleJob,
  getScheduleJob,
  queryScheduleJobLogs,
  queryScheduleJobs,
  updateScheduleJob,
};
