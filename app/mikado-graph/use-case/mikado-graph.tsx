'use client';

import { useServiceContainer } from '@/lib/service-container-context';
import { useIntl } from '@/lib/i18n/intl-provider';
import { MikadoGraphView } from '@/api/mikado-graph/mikako-graph';

export function useStartTask() {
  const { mikadoGraphApi, useRouter, useNotification } = useServiceContainer();
  const router = useRouter();
  const notifier = useNotification();
  const { translation } = useIntl();

  const startTask = async (goal: string) => {
    try {
      const { mikadoGraphId } = await mikadoGraphApi.start(goal);
      notifier.success(translation('mikado-graph.notification.success.start'));
      router.push(`/mikado-graph/${mikadoGraphId}`);
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  return {
    startTask,
  };
}

export default function useMikadoGraph(mikadoGraphView: MikadoGraphView) {
  const { mikadoGraphApi, useRouter, useNotification } = useServiceContainer();
  const router = useRouter();
  const notifier = useNotification();
  const { translation } = useIntl();

  const addPrerequisiteToMikadoGraph = async (label: string) => {
    try {
      await mikadoGraphApi.addPrerequisiteToMikadoGraph(mikadoGraphView.mikadoGraphId, label);
      notifier.success(translation('prerequisite.notification.add-prerequisite.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };
  const startExperimentation = async (prerequisiteId: string) => {
    try {
      await mikadoGraphApi.startExperimentation(mikadoGraphView.mikadoGraphId, prerequisiteId);
      notifier.success(translation('prerequisite.notification.start-experimentation.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const addPrerequisiteToPrerequisite = async (prerequisiteId: string, label: string) => {
    try {
      await mikadoGraphApi.addPrerequisiteToPrerequisite(mikadoGraphView.mikadoGraphId, prerequisiteId, label);
      notifier.success(translation('prerequisite.notification.add-prerequisite.success'));
      router.refresh();
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const commitChanges = async (prerequisiteId: string) => {
    try {
      const mikadoGraph = await mikadoGraphApi.commitChanges(mikadoGraphView.mikadoGraphId, prerequisiteId);
      if (mikadoGraph.done) {
        notifier.success(translation('mikado-graph.done'));
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
    addPrerequisiteToMikadoGraph,
    addPrerequisiteToPrerequisite,
    commitChanges,
  };
}
