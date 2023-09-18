'use client';

import { useServiceContainer } from '@/lib/service-container-context';
import { useIntl } from '@/lib/i18n/intl-provider';

export default function useRefactoring() {
  const { refactoringApi, useRouter, useNotification } = useServiceContainer();
  const router = useRouter();
  const notifier = useNotification();
  const { translation } = useIntl();

  const startRefactoring = async (goal: string) => {
    try {
      const refactoringId = await refactoringApi.start(goal);
      notifier.success(translation('refactoring.notification.success'));
      router.push(`/refactoring/${refactoringId}`);
    } catch (e) {
      notifier.error(translation('refactoring.notification.error'));
    }
  };

  const addPrerequisiteToRefactoring = async (refactoringId: string, label: string) => {
    try {
      await refactoringApi.addPrerequisite(refactoringId, label);
      notifier.success(translation('refactoring.prerequisite.notification.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('refactoring.prerequisite.notification.error'));
    }
  };
  const startExperimentation = async (refactoringId: string, prerequisiteId: string) => {
    try {
      await refactoringApi.startExperimentation(refactoringId, prerequisiteId);
      notifier.success(translation('refactoring.prerequisite.start.notification.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('refactoring.prerequisite.start.notification.error'));
    }
  };

  const addPrerequisiteToPrerequisite = async (refactoringId: string, prerequisiteId: string, label: string) => {
    await refactoringApi.addPrerequisiteToPrerequisite(refactoringId, prerequisiteId, label);
    notifier.success(translation('refactoring.prerequisite.notification.success'));
  };

  return {
    startExperimentation,
    startRefactoring,
    addPrerequisiteToRefactoring,
    addPrerequisiteToPrerequisite,
  };
}
