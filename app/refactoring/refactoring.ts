import httpClient from '@/lib/http-client';
import { RefactoringGraph } from '@/api/refactoring/refactoring';

export type RefactoringApi = {
  start: (goal: string) => Promise<RefactoringGraph>
  addPrerequisiteToRefactoring: (refactoringId: string, label: string) => Promise<RefactoringGraph>
  startExperimentation: (refactoringId: string, prerequisiteId: string) => Promise<RefactoringGraph>
  addPrerequisiteToPrerequisite: (refactoringId: string, prerequisiteId: string, label: string) => Promise<RefactoringGraph>
  commitChanges: (refactoringId: string, prerequisiteId: string) => Promise<RefactoringGraph>
};

const refactoringApi: RefactoringApi = {
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
