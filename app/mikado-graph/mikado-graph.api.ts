import httpClient from '@/tools/http-client';
import { MikadoGraphView } from '@/api/mikado-graph/mikado-graph';

export type MikadoGraphApi = {
  start: (goal: string) => Promise<MikadoGraphView>
  startExperimentation: (mikadoGraphId: string, prerequisiteId: string) => Promise<MikadoGraphView>
  addPrerequisite: (mikadoGraphId: string, label: string, parentId?: string) => Promise<MikadoGraphView>
  commitChanges: (mikadoGraphId: string, prerequisiteId: string) => Promise<MikadoGraphView>
};

const mikadoGraphApi: MikadoGraphApi = {
  start: async (goal: string) => {
    const response = await httpClient.post('/api/mikado-graph', { goal });
    return response.json();
  },
  startExperimentation: async (mikadoGraphId: string, prerequisiteId: string) => {
    const response = await httpClient.post(
      '/api/mikado-graph/prerequisite/start-experimentation',
      { mikadoGraphId, prerequisiteId },
    );
    return response.json();
  },
  addPrerequisite: async (mikadoGraphId: string, label: string, parentId?: string) => {
    const response = await httpClient.post(
      '/api/mikado-graph/prerequisite/add',
      { mikadoGraphId, label, parentId },
    );
    return response.json();
  },
  commitChanges: async (mikadoGraphId: string, prerequisiteId: string) => {
    const response = await httpClient.post(
      '/api/mikado-graph/prerequisite/commit-changes',
      { mikadoGraphId, prerequisiteId },
    );
    return response.json();
  },
};

export default mikadoGraphApi;
