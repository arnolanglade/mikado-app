import httpClient from '@/lib/http-client';
import { RefactoringGraph } from '@/api/refactoring/refactoring';

export type RefactoringApi = {
  start: (goal: string) => Promise<string>
  addPrerequisiteToRefactoring: (refactoringId: string, label: string) => Promise<string>
  startExperimentation: (refactoringId: string, prerequisiteId: string) => Promise<void>
  addPrerequisiteToPrerequisite: (refactoringId: string, prerequisiteId: string, label: string) => Promise<string>
  commitChanges: (refactoringId: string, prerequisiteId: string) => Promise<RefactoringGraph>
};

const refactoringApi: RefactoringApi = {
  start: async (goal: string) => {
    const response = await httpClient.post('/api/refactoring', { goal });
    const { refactoringId } = await response.json();
    return refactoringId;
  },
  addPrerequisiteToRefactoring: async (refactoringId: string, label: string) => {
    const response = await httpClient.post(
      '/api/refactoring/prerequisite/add-to-refactoring',
      { refactoringId, label },
    );
    const { prerequisiteId } = await response.json();
    return prerequisiteId;
  },
  startExperimentation: async (refactoringId: string, prerequisiteId: string) => {
    await httpClient.post(
      '/api/refactoring/prerequisite/start-experimentation',
      { refactoringId, prerequisiteId },
    );
  },
  addPrerequisiteToPrerequisite: async (refactoringId: string, prerequisiteId: string, label: string) => {
    const response = await httpClient.post(
      '/api/refactoring/prerequisite/add-to-prerequisite',
      { refactoringId, prerequisiteId, label },
    );
    const { newPrerequisiteId } = await response.json();
    return newPrerequisiteId;
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
