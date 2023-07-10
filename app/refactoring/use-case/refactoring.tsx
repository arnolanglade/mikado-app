'use client';

import { useServiceContainer } from '@/lib/service-container-context';

export default function useRefactoring() {
  const { httpClient: { post }, useRouter } = useServiceContainer();
  const router = useRouter();

  const startRefactoring = async (goal: string) => {
    await post('/api/refactoring', {
      goal,
    });

    router.push('/refactoring');
  };

  return {
    startRefactoring,
  };
}
