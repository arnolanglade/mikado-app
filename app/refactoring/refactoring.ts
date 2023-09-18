import httpClient from '@/lib/http-client';

export type RefactoringApi = {
  start: (goal: string) => Promise<string>
  addPrerequisite: (refactoringId: string, label: string) => Promise<string>
  startExperimentation: (refactoringId: string, prerequisiteId: string) => Promise<void>
};

const refactoringApi: RefactoringApi = {
  start: async (goal: string) => {
    const response = await httpClient.post('/api/refactoring', { goal });
    const { refactoringId } = await response.json();
    return refactoringId;
  },
  addPrerequisite: async (refactoringId: string, label: string) => {
    const response = await httpClient.post(
      `/api/refactoring/${refactoringId}/prerequisite`,
      { refactoringId, label },
    );
    const { prerequisiteId } = await response.json();
    return prerequisiteId;
  },
  startExperimentation: async (refactoringId: string, prerequisiteId: string) => {
    await httpClient.post(
      `/api/refactoring/${refactoringId}/prerequisite/start-experimentation`,
      { refactoringId, prerequisiteId },
    );
  },
};

export default refactoringApi;
