import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace InvestProjectApi {
  export interface Project {
    [key: number]: any;
    id: number;
    /**
     * Investment project name
     */
    projectName: string;

    /**
     * Project type
     */
    projectType: string;

    /**
     * Expected total amount
     */
    expectTotalAmt: number;

    /**
     * Actual raised amount
     */
    realTotalAmt: number;

    /**
     * Start date
     */
    startDate: string;

    /**
     * End date
     */
    endDate: string;

    /**
     * Manager ID
     */
    managerId: number;

    /**
     * Project status
     * Values: 'PREPARE' | 'INPROCESS' | 'FINISHED' | 'CANCELLED'
     */
    projectStatus: string;

    /**
     * Project remarks
     */
    projectRemark: string;
  }

  export interface ProjectFund {
    [key: number]: any;
    id: null | number;

    investUserId: null | number;

    investAmt: number;
  }
}

/**
 * 获取投资项目列表数据
 */
export async function listInvestProjectList(params: Recordable<any>) {
  return requestClient.get<Array<InvestProjectApi.Project>>(
    '/admin/invest/project/queryProject',
    { params },
  );
}

/**
 * 创建项目
 * @param data 项目数据
 */
export async function createInvestProject(
  data: Omit<InvestProjectApi.Project, 'id'>,
) {
  return requestClient.post('/admin/invest/project/createProject', data);
}

/**
 * 更新项目
 *
 * @param id 项目 ID
 * @param data 项目数据
 */
export async function updateInvestProject(
  id: string,
  data: Omit<InvestProjectApi.Project, 'id'>,
) {
  return requestClient.post(`/admin/invest/project/updateProject/${id}`, data);
}

/**
 * 删除项目
 * @param id 项目 ID
 */
export async function deleteInvestProject(id: number) {
  return requestClient.post(`/admin/invest/project/delete/${id}`);
}

export async function getFundListByProjectId(projectId: number) {
  return requestClient.get(
    `/admin/invest/project/listProjectFunds?projectId=${projectId}`,
  );
}

export async function saveFundList(
  projectId: number,
  fundList: InvestProjectApi.ProjectFund[],
) {
  return requestClient.post(`/admin/invest/project/saveProjectFunds`, {
    projectId,
    fundList,
  });
}
