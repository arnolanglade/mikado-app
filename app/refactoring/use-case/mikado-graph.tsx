'use client';

import { useServiceContainer } from '@/lib/service-container-context';
import { useIntl } from '@/lib/i18n/intl-provider';

export default function useMikadoGraph() {
  const { refactoringApi, useRouter, useNotification } = useServiceContainer();
  const router = useRouter();
  const notifier = useNotification();
  const { translation } = useIntl();

  const startTask = async (goal: string) => {
    try {
      const { mikadoGraphId } = await refactoringApi.start(goal);
      notifier.success(translation('refactoring.notification.success.start'));
      router.push(`/refactoring/${mikadoGraphId}`);
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const addPrerequisiteToMikadoGraph = async (mikadoGraphId: string, label: string) => {
    try {
      await refactoringApi.addPrerequisiteToRefactoringMikadoGraph(mikadoGraphId, label);
      notifier.success(translation('prerequisite.notification.add-prerequisite.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };
  const startExperimentation = async (mikadoGraphId: string, prerequisiteId: string) => {
    try {
      await refactoringApi.startExperimentation(mikadoGraphId, prerequisiteId);
      notifier.success(translation('prerequisite.notification.start-experimentation.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const addPrerequisiteToPrerequisite = async (mikadoGraphId: string, prerequisiteId: string, label: string) => {
    try {
      await refactoringApi.addPrerequisiteToPrerequisite(mikadoGraphId, prerequisiteId, label);
      notifier.success(translation('prerequisite.notification.add-prerequisite.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const commitChanges = async (mikadoGraphId: string, prerequisiteId: string) => {
    try {
      const refactoring = await refactoringApi.commitChanges(mikadoGraphId, prerequisiteId);
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
    startRefactoring: startTask,
    addPrerequisiteToRefactoring: addPrerequisiteToMikadoGraph,
    addPrerequisiteToPrerequisite,
    commitChanges,
  };
}
