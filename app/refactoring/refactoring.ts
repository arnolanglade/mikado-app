import httpClient from '@/lib/http-client';
import { getRefactoringById, RefactoringGraph as Refactoring } from '@/api/refactoring/refactoring';

type RefactoringData = {
  label: string,
  done: boolean
  addPrerequisiteToRefactoring: (label: string) => void
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

export const mapResponseToRefactoringGraph = (
  refactoringGraph: Refactoring,
  refactoringActions: { addPrerequisiteToRefactoring: (label: string) => void },
  prerequisiteActions: {
    onStartExperimentation: (refactoringId: string, prerequisiteId: string) => void,
    onAddPrerequisiteToPrerequisite: (refactoringId: string, prerequisiteId: string, label: string) => void,
    onCommitChanges: (refactoringId: string, prerequisiteId: string) => void,
  },
): RefactoringGraph => {
  const refactoringNode: Node = {
    id: refactoringGraph.refactoringId,
    type: 'refactoring',
    data: { label: refactoringGraph.goal, done: refactoringGraph.done, ...refactoringActions },
    position: { x: 0, y: 0 },
  };

  const prerequisiteNodes = refactoringGraph.prerequisites.map((prerequisite): Node => ({
    id: prerequisite.prerequisiteId,
    type: 'prerequisite',
    data: { label: prerequisite.label, ...prerequisiteActions },
    position: { x: 0, y: 0 },
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
