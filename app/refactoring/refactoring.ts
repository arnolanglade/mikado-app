import httpClient from '@/lib/http-client';

export type RefactoringApi = {
  start: (goal: string) => Promise<string>
  addPrerequisite: (refactoringId: string, label: string) => Promise<string>
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
};

export default refactoringApi;
