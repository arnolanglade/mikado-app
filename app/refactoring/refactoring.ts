import httpClient from '@/lib/http-client';
import { getRefactoringById, RefactoringGraph as Refactoring } from '@/api/refactoring/refactoring';

type RefactoringData = {
  label: string,
  done: boolean
};

type PrerequisiteData = {
  label: string,
};

type Node = {
  id: string,
  type: 'refactoring' | 'prerequisite',
  data: RefactoringData | PrerequisiteData,
  position: { x: number, y: number }
};

type RefactoringGraph = Node[];

export const mapResponseToRefactoringGraph = (refactoringGraph: Refactoring): RefactoringGraph => {
  const refactoringNode: Node = {
    id: refactoringGraph.refactoringId,
    type: 'refactoring',
    data: { label: refactoringGraph.goal, done: refactoringGraph.done },
    position: { x: 0, y: 0 },
  };

  const prerequisiteNodes = refactoringGraph.prerequisites.map((prerequisite, index): Node => ({
    id: prerequisite.prerequisiteId,
    type: 'prerequisite',
    data: { label: prerequisite.label },
    position: { x: 0, y: (index + 1) * 100 },
  }));

  return [refactoringNode, ...prerequisiteNodes];
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
  getById: async (id: string) => getRefactoringById(id),
  start: async (goal: string) => {
    const response = await httpClient.post('/api/refactoring', { goal });
    return response.json();
  },
  addPrerequisiteToRefactoring: async (refactoringId: string, label: string) => {
    const response = await httpClient.post(
      '/api/refactoring/prerequisite/add-to-refactoring',
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
