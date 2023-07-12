'use client';

import { useServiceContainer } from '@/lib/service-container-context';
import { useIntl } from '@/lib/i18n/intl-provider';

export default function useRefactoring() {
  const { httpClient: { post }, useRouter, useNotification } = useServiceContainer();
  const router = useRouter();
  const notifier = useNotification();
  const { translation } = useIntl();

  const startRefactoring = async (goal: string) => {
    try {
      await post('/api/refactoring', {
        goal,
      });

      notifier.success(translation('refactoring.notification.success'));
      router.push('/refactoring');
    } catch (e) {
      notifier.error(translation('refactoring.notification.error'));
    }
  };

  return {
    startRefactoring,
  };
}
