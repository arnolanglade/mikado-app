import httpClient from '@/lib/http-client';
import { getMikadoGraphById, MikadoGraphView as Refactoring } from '@/api/refactoring/mikako-graph';

type RefactoringData = {
  goal: string,
  done: boolean
  addPrerequisiteToRefactoring: (label: string) => void
};

type PrerequisiteData = {
  label: string,
  status: 'experimenting' | 'done' | 'todo',
  startExperimentation: (prerequisiteId: string) => () => void,
  addPrerequisiteToPrerequisite: (prerequisiteId: string) => (label: string) => void,
  commitChanges: (prerequisiteId: string) => () => void,
};

type Node = {
  id: string,
  type: 'refactoring' | 'prerequisite',
  data: RefactoringData | PrerequisiteData,
  parentId?: string,
  position: { x: number, y: number }
};
type Edge = {
  id: string,
  source: string,
  target: string,
};

type RefactoringGraph = {
  nodes:Node[],
  edges: Edge[],
};

export const mapResponseToRefactoringGraph = (
  refactoringGraph: Refactoring,
  refactoringActions: { addPrerequisiteToRefactoring: (label: string) => void },
  prerequisiteActions: {
    startExperimentation: (prerequisiteId: string) => () => void,
    addPrerequisiteToPrerequisite: (prerequisiteId: string) => (label: string) => void,
    commitChanges: (prerequisiteId: string) => () => void,
  },
): RefactoringGraph => {
  const refactoringNode: Node = {
    id: refactoringGraph.refactoringId,
    type: 'refactoring',
    data: { goal: refactoringGraph.goal, done: refactoringGraph.done, ...refactoringActions },
    position: { x: 0, y: 0 },
  };

  const prerequisiteNodes = refactoringGraph.prerequisites.map((prerequisite): Node => ({
    id: prerequisite.prerequisiteId,
    type: 'prerequisite',
    parentId: prerequisite.parentId,
    data: { label: prerequisite.label, status: prerequisite.status, ...prerequisiteActions },
    position: { x: 0, y: 100 },
  }));

  const edges = refactoringGraph.prerequisites.map((prerequisite): Edge => ({
    id: `${prerequisite.parentId}-${prerequisite.prerequisiteId}`,
    source: prerequisite.parentId,
    target: prerequisite.prerequisiteId,
  }));

  return {
    nodes: [refactoringNode, ...prerequisiteNodes],
    edges,
  };
};

export type RefactoringApi = {
  getById: (id: string) => Promise<Refactoring>
  start: (goal: string) => Promise<Refactoring>
  addPrerequisiteToRefactoring: (refactoringId: string, label: string) => Promise<Refactoring>
  startExperimentation: (refactoringId: string, prerequisiteId: string) => Promise<Refactoring>
  addPrerequisiteToPrerequisite: (refactoringId: string, prerequisiteId: string, label: string) => Promise<Refactoring>
  commitChanges: (refactoringId: string, prerequisiteId: string) => Promise<Refactoring>
};

const refactoringApi: RefactoringApi = {
  getById: async (id: string) => getMikadoGraphById(id),
  start: async (goal: string) => {
    const response = await httpClient.post('/api/refactoring', { goal });
    return response.json();
  },
  addPrerequisiteToRefactoring: async (refactoringId: string, label: string) => {
    const response = await httpClient.post(
      '/api/refactoring/prerequisite/add-to-mikado-graph',
      { refactoringId, label },
    );
    return response.json();
  },
  startExperimentation: async (refactoringId: string, prerequisiteId: string) => {
    const response = await httpClient.post(
      '/api/refactoring/prerequisite/start-experimentation',
      { refactoringId, prerequisiteId },
    );
    return response.json();
  },
  addPrerequisiteToPrerequisite: async (refactoringId: string, prerequisiteId: string, label: string) => {
    const response = await httpClient.post(
      '/api/refactoring/prerequisite/add-to-prerequisite',
      { refactoringId, prerequisiteId, label },
    );
    return response.json();
  },
  commitChanges: async (refactoringId: string, prerequisiteId: string) => {
    const response = await httpClient.post(
      '/api/refactoring/prerequisite/commit-changes',
      { refactoringId, prerequisiteId },
    );
    return response.json();
  },
};

export default refactoringApi;
