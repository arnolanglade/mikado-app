'use client';

import { useServiceContainer } from '@/lib/service-container-context';
import { useIntl } from '@/lib/i18n/intl-provider';
import { MikadoGraphView } from '@/api/mikado-graph/mikako-graph';
import { Edge, MikadoGraph, Node } from '@/mikado-graph/mikado-graph';
import Dagre from '@dagrejs/dagre';

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

  const dagreGraph = new Dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });

  const nodeWidth = 300;
  const nodeHeight = 150;

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

  const getMikadoGraph = (): MikadoGraph => {
    const refactoringNode: Node = {
      id: mikadoGraphView.mikadoGraphId,
      type: 'refactoring',
      data: { goal: mikadoGraphView.goal, done: mikadoGraphView.done, addPrerequisiteToRefactoring: (label: string) => addPrerequisiteToMikadoGraph(label) },
      position: { x: 0, y: 0 },
    };
    dagreGraph.setNode(mikadoGraphView.mikadoGraphId, { width: nodeWidth, height: nodeHeight });

    const prerequisiteNodes = mikadoGraphView.prerequisites.map((prerequisite): Node => {
      dagreGraph.setNode(prerequisite.prerequisiteId, { width: nodeWidth, height: nodeHeight });

      return {
        id: prerequisite.prerequisiteId,
        type: 'prerequisite',
        parentId: prerequisite.parentId,
        data: {
          label: prerequisite.label,
          status: prerequisite.status,
          startExperimentation: () => startExperimentation(prerequisite.prerequisiteId),
          addPrerequisiteToPrerequisite: (label: string) => addPrerequisiteToPrerequisite(prerequisite.prerequisiteId, label),
          commitChanges: () => commitChanges(prerequisite.prerequisiteId),
        },
        position: { x: 0, y: 100 },
      };
    });

    const edges = mikadoGraphView.prerequisites.map((prerequisite): Edge => {
      dagreGraph.setEdge(prerequisite.parentId, prerequisite.prerequisiteId);
      return {
        id: `${prerequisite.parentId}-${prerequisite.prerequisiteId}`,
        source: prerequisite.parentId,
        target: prerequisite.prerequisiteId,
      };
    });

    Dagre.layout(dagreGraph);

    const nodes = [refactoringNode, ...prerequisiteNodes].map((node) => {
      const { x, y } = dagreGraph.node(node.id);
      return {
        ...node,
        ...{
          position: {
            x: x - nodeWidth / 2,
            y: y - nodeHeight / 2,
          },
        },
      };
    });

    return {
      nodes,
      edges,
    };
  };

  return {
    getMikadoGraph,
    startExperimentation,
    addPrerequisiteToMikadoGraph,
    addPrerequisiteToPrerequisite,
    commitChanges,
  };
}
