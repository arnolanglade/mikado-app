'use client';

import { useServiceContainer } from '@/lib/service-container-context';

export default function useRefactoring() {
  const { httpClient: { post }, useRouter, useNotification } = useServiceContainer();
  const router = useRouter();
  const notifier = useNotification();

  const startRefactoring = async (goal: string) => {
    await post('/api/refactoring', {
      goal,
    });

    notifier.success('The refactoring has been started');
    router.push('/refactoring');
  };

  return {
    startRefactoring,
  };
}
