'use client';

import React from 'react';
import { StatusView } from '@/api/mikado-graph/mikado-graph';
import AddPrerequisiteForm from '@/mikado-graph/component/add-prerequisite-form';
import { Translation } from '@/tools/i18n/intl-provider';
import { Handle, Position, ReactFlow } from 'reactflow';
import { MikadoGraph } from '@/mikado-graph/mikado-graph.usecase';
import Typography from '@/tools/design-system/typography';
import 'reactflow/dist/style.css';
import { Button } from '@/tools/design-system/form';
import Alert from '@/tools/design-system/alert';
import styles from './mikado-graph.module.css';

export function MikadoGraphNode({
  data: { goal, done, addPrerequisiteToMikadoGraph },
} : {
  data: { goal: string, done: boolean, addPrerequisiteToMikadoGraph: (label: string) => void },
}) {
  return (
    <div className={styles.container}>
      <Typography variant="p">
        <Translation id="mikado-graph.your-goal" values={{ goal }} />
      </Typography>
      {
        done ? (
          <Alert severity="success">
            <Translation id="mikado-graph.done" />
          </Alert>
        ) : <AddPrerequisiteForm onSubmit={addPrerequisiteToMikadoGraph} />
      }
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function PrerequisiteNode({
  id,
  data: {
    label,
    status,
    canBeCommitted,
    startExperimentation,
    addPrerequisiteToPrerequisite,
    commitChanges,
  },
}: {
  id: string,
  data: {
    label: string,
    status: 'experimenting' | 'done' | 'todo',
    canBeCommitted: boolean,
    startExperimentation: () => void,
    addPrerequisiteToPrerequisite: (label: string) => void,
    commitChanges:() => void,
  }
}) {
  return (
    <div
      className={styles.container}
      key={id}
    >
      <Handle type="target" position={Position.Top} />
      <Translation id="prerequisite.label" values={{ label }} />
      {
        status === StatusView.DONE && (
          <Alert severity="success">
            <Translation id="prerequisite.done" />
          </Alert>
        )
      }
      {status === StatusView.TODO && (
      <Button onClick={startExperimentation}>
        <Translation id="prerequisite.start-experimentation" />
      </Button>
      )}
      {status === StatusView.EXPERIMENTING && (
      <>
        <AddPrerequisiteForm onSubmit={addPrerequisiteToPrerequisite} />
        { canBeCommitted && (
        <Button onClick={commitChanges}>
          <Translation id="prerequisite.commit-changes" />
        </Button>
        )}
      </>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  prerequisite: PrerequisiteNode,
  mikadoGraph: MikadoGraphNode,
};

export default function Graph({
  mikadoGraph,
}: {
  mikadoGraph: MikadoGraph,
}) {
  return (
    <ReactFlow
      nodes={mikadoGraph.nodes}
      edges={mikadoGraph.edges}
      nodeTypes={nodeTypes}
      fitView
    />
  );
}
