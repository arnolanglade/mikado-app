import httpClient from '@/lib/http-client';

export type RefactoringApi = {
  start: (goal: string) => Promise<string>
};

const refactoringApi: RefactoringApi = {
  start: async (goal: string) => {
    const response = await httpClient.post('/api/refactoring', { goal });
    const { refactoringId } = await response.json();
    return refactoringId;
  },
};

export default refactoringApi;
