'use client';

import React from 'react';
import { Status } from '@/api/mikado-graph/mikako-graph';
import styles from '@/mikado-graph/[id]/page.module.css';
import AddPrerequisiteForm from '@/mikado-graph/component/add-prerequisite-form';
import { Translation } from '@/lib/i18n/intl-provider';
import { MikadoGraph } from '@/mikado-graph/mikado-graph';
import { Handle, Position, ReactFlow } from 'reactflow';

import 'reactflow/dist/style.css';

export function RefactoringNode({
  data: { goal, done, addPrerequisiteToRefactoring },
} : {
  data: { goal: string, done: boolean, addPrerequisiteToRefactoring: (label: string) => void },
}) {
  return (
    <div className={styles.refactoringGoal}>
      <p>{goal}</p>
      {done ? <Translation id="prerequisite.done" />
        : <AddPrerequisiteForm onSubmit={addPrerequisiteToRefactoring} />}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function PrerequisiteNode({
  id,
  data: {
    label,
    status,
    startExperimentation,
    addPrerequisiteToPrerequisite,
    commitChanges,
  },
}: {
  id: string,
  data: {
    label: string,
    status: 'experimenting' | 'done' | 'todo',
    startExperimentation: () => void,
    addPrerequisiteToPrerequisite: (label: string) => void,
    commitChanges:() => void,
  }
}) {
  return (
    <div
      className={styles.prerequisite}
      key={id}
    >
      <Handle type="target" position={Position.Top} />
      <p>
        {label}
        {' '}
        {status === Status.DONE && <Translation id="prerequisite.done" />}
      </p>
      {status === Status.TODO && (
      <button
        type="button"
        onClick={startExperimentation}
      >
        <Translation id="prerequisite.start-experimentation" />
      </button>
      )}
      {status === Status.EXPERIMENTING && (
      <>
        <AddPrerequisiteForm
          onSubmit={addPrerequisiteToPrerequisite}
        />
        <button
          type="button"
          onClick={commitChanges}
        >
          <Translation id="prerequisite.commit-changes" />
        </button>
      </>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  prerequisite: PrerequisiteNode,
  refactoring: RefactoringNode,
};

export default function Graph({
  mikadoGraph,
}: {
  mikadoGraph: MikadoGraph,
}) {
  return (
    <div className={styles.dashboard}>
      <ReactFlow
        nodes={mikadoGraph.nodes}
        edges={mikadoGraph.edges}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}