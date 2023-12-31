'use client';

import { useServiceContainer } from '@/tools/service-container-context';
import { useIntl } from '@/tools/i18n/intl-provider';
import { MikadoGraphView, StatusView } from '@/api/mikado-graph/mikado-graph';
import Dagre from '@dagrejs/dagre';
import { useState } from 'react';

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

export type GaolData = {
  goal: string,
  done: boolean
  onAddPrerequisiteButtonClick: (parentNodeId: string) => void
};

export type NewPrerequisiteData = {
  onPrerequisiteSubmit: (label: string, prerequisiteId?: string) => void
};

export type PrerequisiteData = {
  label: string,
  status: 'experimenting' | 'done' | 'todo',
  canBeCommitted: boolean,
  onStartExperimentationButtonClick: () => void,
  onCommitChangesButtonClick: () => void,
  onAddPrerequisiteButtonClick: (parentNodeId: string) => void
};

export type Node = {
  id: string,
  type: 'goal' | 'prerequisite' | 'newPrerequisite'
  data: GaolData | PrerequisiteData | NewPrerequisiteData,
  parentId?: string,
  position: { x: number, y: number }
};

export type Edge = {
  id: string,
  source: string,
  target: string,
};

export type MikadoGraph = {
  nodes: Node[],
  edges: Edge[],
};

export default function useMikadoGraph(defaultMikadoGraphView: MikadoGraphView) {
  const { mikadoGraphApi, useNotification } = useServiceContainer();
  const notifier = useNotification();
  const { translation } = useIntl();

  const [mikadoGraphView, setMikadoGraphView] = useState<MikadoGraphView>(defaultMikadoGraphView);

  const dagreGraph = new Dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });

  const nodeWidth = 500;
  const nodeHeight = 350;

  const openPrerequisiteForm = (parentId: string) => {
    const prerequisiteWithoutNodeForm = mikadoGraphView.prerequisites.filter((p) => p.prerequisiteId !== 'new-prerequisite');

    setMikadoGraphView({
      ...mikadoGraphView,
      prerequisites: [...prerequisiteWithoutNodeForm, {
        prerequisiteId: 'new-prerequisite',
        parentId,
        label: '',
        status: StatusView.TODO,
        canBeCommitted: false,
      }],
    });
  };

  const startExperimentation = async (prerequisiteId: string) => {
    try {
      setMikadoGraphView(await mikadoGraphApi.startExperimentation(defaultMikadoGraphView.mikadoGraphId, prerequisiteId));
      notifier.success(translation('prerequisite.notification.start-experimentation.success'));
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const addPrerequisite = async (label: string, prerequisiteId?: string) => {
    try {
      setMikadoGraphView(await mikadoGraphApi.addPrerequisite(defaultMikadoGraphView.mikadoGraphId, label, prerequisiteId));
      notifier.success(translation('prerequisite.notification.add-prerequisite.success'));
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const commitChanges = async (prerequisiteId: string) => {
    try {
      const mikadoGraph = await mikadoGraphApi.commitChanges(defaultMikadoGraphView.mikadoGraphId, prerequisiteId);
      setMikadoGraphView(mikadoGraph);
      if (mikadoGraph.done) {
        notifier.success(translation('mikado-graph.done'));
      } else {
        notifier.success(translation('prerequisite.notification.success.commit-changes'));
      }
    } catch (e) {
      notifier.error(translation('notification.error'));
    }
  };

  const getMikadoGraph = (graph: MikadoGraphView): MikadoGraph => {
    const mikadoGraphNode: Node = {
      id: graph.mikadoGraphId,
      type: 'goal',
      data: {
        goal: graph.goal,
        done: graph.done,
        onAddPrerequisiteButtonClick: openPrerequisiteForm,
      },
      position: { x: 0, y: 0 },
    };
    dagreGraph.setNode(graph.mikadoGraphId, { width: nodeWidth, height: nodeHeight });

    const prerequisiteNodes = graph.prerequisites.map((prerequisite): Node => {
      dagreGraph.setNode(prerequisite.prerequisiteId, { width: nodeWidth, height: nodeHeight });

      if (prerequisite.prerequisiteId === 'new-prerequisite') {
        return {
          id: prerequisite.prerequisiteId,
          type: 'newPrerequisite',
          parentId: prerequisite.parentId,
          data: {
            onPrerequisiteSubmit: (label: string) => addPrerequisite(label, prerequisite.parentId),
          },
          position: { x: 0, y: 100 },
        };
      }

      return {
        id: prerequisite.prerequisiteId,
        type: 'prerequisite',
        parentId: prerequisite.parentId,
        data: {
          label: prerequisite.label,
          status: prerequisite.status,
          canBeCommitted: prerequisite.canBeCommitted,
          onStartExperimentationButtonClick: () => startExperimentation(prerequisite.prerequisiteId),
          onCommitChangesButtonClick: () => commitChanges(prerequisite.prerequisiteId),
          onAddPrerequisiteButtonClick: openPrerequisiteForm,
        },
        position: { x: 0, y: 100 },
      };
    });

    const edges = graph.prerequisites.map((prerequisite): Edge => {
      dagreGraph.setEdge(prerequisite.parentId, prerequisite.prerequisiteId);
      return {
        id: `${prerequisite.parentId}-${prerequisite.prerequisiteId}`,
        source: prerequisite.parentId,
        target: prerequisite.prerequisiteId,
      };
    });

    Dagre.layout(dagreGraph);

    const nodes = [mikadoGraphNode, ...prerequisiteNodes].map((node) => {
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
    mikadoGraph: getMikadoGraph(mikadoGraphView),
    openPrerequisiteForm,
    startExperimentation,
    addPrerequisite,
    commitChanges,
  };
}
