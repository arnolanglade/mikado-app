import httpClient from '@/tools/http-client';
import { MikadoGraphView } from '@/api/mikado-graph/mikado-graph';

export type MikadoGraphApi = {
  start: (goal: string) => Promise<MikadoGraphView>
  addPrerequisiteToMikadoGraph: (mikadoGraphId: string, label: string) => Promise<MikadoGraphView>
  startExperimentation: (mikadoGraphId: string, prerequisiteId: string) => Promise<MikadoGraphView>
  addPrerequisiteToPrerequisite: (mikadoGraphId: string, prerequisiteId: string, label: string) => Promise<MikadoGraphView>
  addPrerequisite: (mikadoGraphId: string, label: string, parentId?: string) => Promise<MikadoGraphView>
  commitChanges: (mikadoGraphId: string, prerequisiteId: string) => Promise<MikadoGraphView>
};

const mikadoGraphApi: MikadoGraphApi = {
  start: async (goal: string) => {
    const response = await httpClient.post('/api/mikado-graph', { goal });
    return response.json();
  },
  addPrerequisiteToMikadoGraph: async (mikadoGraphId: string, label: string) => {
    const response = await httpClient.post(
      '/api/mikado-graph/prerequisite/add-to-mikado-graph',
      { mikadoGraphId, label },
    );
    return response.json();
  },
  startExperimentation: async (mikadoGraphId: string, prerequisiteId: string) => {
    const response = await httpClient.post(
      '/api/mikado-graph/prerequisite/start-experimentation',
      { mikadoGraphId, prerequisiteId },
    );
    return response.json();
  },
  addPrerequisiteToPrerequisite: async (mikadoGraphId: string, parentId: string, label: string) => {
    const response = await httpClient.post(
      '/api/mikado-graph/prerequisite/add-to-prerequisite',
      { mikadoGraphId, parentId, label },
    );
    return response.json();
  },
  addPrerequisite: async (mikadoGraphId: string, label: string, parentId?: string) => {
    if (!parentId) {
      const response = await httpClient.post(
        '/api/mikado-graph/prerequisite/add-to-mikado-graph',
        { mikadoGraphId, label },
      );
      return response.json();
    }

    const response = await httpClient.post(
      '/api/mikado-graph/prerequisite/add-to-prerequisite',
      { mikadoGraphId, parentId, label },
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
