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
import styles from './mikado-graph.module.css';

export function MikadoGraphNode({
  data: { goal, done, addPrerequisiteToMikadoGraph },
} : {
  data: { goal: string, done: boolean, addPrerequisiteToMikadoGraph: (label: string) => void },
}) {
  return (
    <div className={styles.goalContainer}>
      <Typography variant="p">
        <Translation id="mikado-graph.your-goal" values={{ goal }} />
      </Typography>
      {done ? <Translation id="prerequisite.done" />
        : <AddPrerequisiteForm onSubmit={addPrerequisiteToMikadoGraph} />}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function PrerequisiteNode({
  id,
  data: {
    label,
    status,
    allChildrenDone,
    startExperimentation,
    addPrerequisiteToPrerequisite,
    commitChanges,
  },
}: {
  id: string,
  data: {
    label: string,
    status: 'experimenting' | 'done' | 'todo',
    allChildrenDone: boolean,
    startExperimentation: () => void,
    addPrerequisiteToPrerequisite: (label: string) => void,
    commitChanges:() => void,
  }
}) {
  return (
    <div
      className={styles.prerequisiteContainer}
      key={id}
    >
      <Handle type="target" position={Position.Top} />
      <p>
        {label}
        {' '}
        {status === StatusView.DONE && <Translation id="prerequisite.done" />}
      </p>
      {status === StatusView.TODO && (
      <Button onClick={startExperimentation}>
        <Translation id="prerequisite.start-experimentation" />
      </Button>
      )}
      {status === StatusView.EXPERIMENTING && (
      <>
        <AddPrerequisiteForm
          onSubmit={addPrerequisiteToPrerequisite}
        />
        { allChildrenDone && (
          <button
            type="button"
            onClick={commitChanges}
          >
            <Translation id="prerequisite.commit-changes" />
          </button>
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
