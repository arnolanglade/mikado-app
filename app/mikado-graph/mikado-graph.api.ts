import httpClient from '@/lib/http-client';
import { getMikadoGraphById, MikadoGraphView } from '@/api/mikado-graph/mikako-graph';

type MikadoGraphData = {
  goal: string,
  done: boolean
  addPrerequisiteToMikadoGraph: (label: string) => void
};

type PrerequisiteData = {
  label: string,
  status: 'experimenting' | 'done' | 'todo',
  startExperimentation: () => void,
  addPrerequisiteToPrerequisite: (label: string) => void,
  commitChanges: () => void,
};

export type Node = {
  id: string,
  type: 'mikadoGraph' | 'prerequisite',
  data: MikadoGraphData | PrerequisiteData,
  parentId?: string,
  position: { x: number, y: number }
};
export type Edge = {
  id: string,
  source: string,
  target: string,
};

export type MikadoGraph = {
  nodes:Node[],
  edges: Edge[],
};

export type MikadoGraphApi = {
  getById: (id: string) => Promise<MikadoGraphView>
  start: (goal: string) => Promise<MikadoGraphView>
  addPrerequisiteToMikadoGraph: (mikadoGraphId: string, label: string) => Promise<MikadoGraphView>
  startExperimentation: (mikadoGraphId: string, prerequisiteId: string) => Promise<MikadoGraphView>
  addPrerequisiteToPrerequisite: (mikadoGraphId: string, prerequisiteId: string, label: string) => Promise<MikadoGraphView>
  commitChanges: (mikadoGraphId: string, prerequisiteId: string) => Promise<MikadoGraphView>
};

const mikadoGraphApi: MikadoGraphApi = {
  getById: async (id: string) => getMikadoGraphById(id),
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
  commitChanges: async (mikadoGraphId: string, prerequisiteId: string) => {
    const response = await httpClient.post(
      '/api/mikado-graph/prerequisite/commit-changes',
      { mikadoGraphId, prerequisiteId },
    );
    return response.json();
  },
};

export default mikadoGraphApi;
