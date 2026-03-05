import { beforeEach, describe, expect, it, vi } from 'vitest';

const postMock = vi.fn();
const getMock = vi.fn();

vi.mock('#/api/request', () => ({
  requestClient: {
    get: getMock,
    post: postMock,
  },
}));

describe('schedule-job api', () => {
  beforeEach(() => {
    postMock.mockReset();
    getMock.mockReset();
  });

  it('posts list queries to the schedule job endpoint and transforms paging', async () => {
    postMock.mockResolvedValue({
      list: [{ id: 1, jobName: 'demo' }],
      total: 1,
    });

    const { queryScheduleJobs } = await import('../schedule-job');

    const result = await queryScheduleJobs({
      beanName: 'syncTask',
      jobName: 'sync-user',
      jobStatus: 'ENABLED',
      pageNum: 2,
      pageSize: 20,
    });

    expect(postMock).toHaveBeenCalledWith(
      '/admin-api/schedule/job/list',
      {
        beanName: 'syncTask',
        jobName: 'sync-user',
        jobStatus: 'ENABLED',
      },
      {
        params: {
          pageNum: 2,
          pageSize: 20,
        },
      },
    );
    expect(result).toEqual({
      items: [{ id: 1, jobName: 'demo' }],
      total: 1,
    });
  });

  it('serializes jobParams payload for create and update', async () => {
    postMock.mockResolvedValue(undefined);

    const { createScheduleJob, updateScheduleJob } = await import(
      '../schedule-job'
    );

    await createScheduleJob({
      beanName: 'beanA',
      cronExpression: '0/10 * * * * ?',
      jobName: 'jobA',
      jobParams: '{"foo":"bar"}',
      jobStatus: 'ENABLED',
    });

    await updateScheduleJob({
      id: 8,
      cronExpression: '0/30 * * * * ?',
      jobParams: { retry: 3 },
    });

    expect(postMock).toHaveBeenNthCalledWith(1, '/admin-api/schedule/job/create', {
      beanName: 'beanA',
      cronExpression: '0/10 * * * * ?',
      jobName: 'jobA',
      jobParams: { foo: 'bar' },
      jobStatus: 'ENABLED',
    });

    expect(postMock).toHaveBeenNthCalledWith(2, '/admin-api/schedule/job/update', {
      id: 8,
      cronExpression: '0/30 * * * * ?',
      jobParams: { retry: 3 },
    });
  });

  it('sends id as params for delete enable disable and execute', async () => {
    const {
      deleteScheduleJob,
      disableScheduleJob,
      enableScheduleJob,
      executeScheduleJob,
    } = await import('../schedule-job');

    await deleteScheduleJob(1);
    await enableScheduleJob(2);
    await disableScheduleJob(3);
    await executeScheduleJob(4);

    expect(postMock).toHaveBeenNthCalledWith(
      1,
      '/admin-api/schedule/job/delete',
      null,
      { params: { id: 1 } },
    );
    expect(postMock).toHaveBeenNthCalledWith(
      2,
      '/admin-api/schedule/job/enable',
      null,
      { params: { id: 2 } },
    );
    expect(postMock).toHaveBeenNthCalledWith(
      3,
      '/admin-api/schedule/job/disable',
      null,
      { params: { id: 3 } },
    );
    expect(postMock).toHaveBeenNthCalledWith(
      4,
      '/admin-api/schedule/job/execute',
      null,
      { params: { id: 4 } },
    );
  });

  it('sends log list request with paging and jobId params', async () => {
    postMock.mockResolvedValue({
      list: [{ id: 11, jobId: 8 }],
      total: 1,
    });

    const { queryScheduleJobLogs } = await import('../schedule-job');

    const result = await queryScheduleJobLogs({
      jobId: 8,
      pageNum: 1,
      pageSize: 10,
    });

    expect(postMock).toHaveBeenCalledWith(
      '/admin-api/schedule/job/log/list',
      null,
      {
        params: {
          jobId: 8,
          pageNum: 1,
          pageSize: 10,
        },
      },
    );
    expect(result).toEqual({
      items: [{ id: 11, jobId: 8 }],
      total: 1,
    });
  });
});
