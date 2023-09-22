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
      notifier.success(translation('refactoring.notification.success.start'));
      router.push(`/refactoring/${refactoringId}`);
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const addPrerequisiteToRefactoring = async (refactoringId: string, label: string) => {
    try {
      await refactoringApi.addPrerequisiteToRefactoring(refactoringId, label);
      notifier.success(translation('prerequisite.notification.add-prerequisite.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };
  const startExperimentation = async (refactoringId: string, prerequisiteId: string) => {
    try {
      await refactoringApi.startExperimentation(refactoringId, prerequisiteId);
      notifier.success(translation('prerequisite.notification.start-experimentation.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const addPrerequisiteToPrerequisite = async (refactoringId: string, prerequisiteId: string, label: string) => {
    try {
      await refactoringApi.addPrerequisiteToPrerequisite(refactoringId, prerequisiteId, label);
      notifier.success(translation('prerequisite.notification.add-prerequisite.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const commitChanges = async (refactoringId: string, prerequisiteId: string) => {
    try {
      const refactoring = await refactoringApi.commitChanges(refactoringId, prerequisiteId);
      if (refactoring.done) {
        notifier.success(translation('refactoring.done'));
      } else {
        notifier.success(translation('prerequisite.notification.success.commit-changes'));
      }
      router.refresh();
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  return {
    startExperimentation,
    startRefactoring,
    addPrerequisiteToRefactoring,
    addPrerequisiteToPrerequisite,
    commitChanges,
  };
}
