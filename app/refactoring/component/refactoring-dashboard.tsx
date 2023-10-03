'use client';

import React from 'react';
import { RefactoringGraph, Status } from '@/api/refactoring/mikako-graph';
import styles from '@/refactoring/[id]/page.module.css';
import AddPrerequisiteForm from '@/refactoring/component/add-prerequisite-form';
import { Translation } from '@/lib/i18n/intl-provider';
import { mapResponseToRefactoringGraph } from '@/refactoring/refactoring';
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
    startExperimentation: (prerequisiteId: string) => () => void,
    addPrerequisiteToPrerequisite: (prerequisiteId: string) => (label: string) => void,
    commitChanges: (prerequisiteId: string) => () => void,
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
        onClick={startExperimentation(id)}
      >
        <Translation id="prerequisite.start-experimentation" />
      </button>
      )}
      {status === Status.EXPERIMENTING && (
      <>
        <AddPrerequisiteForm
          onSubmit={addPrerequisiteToPrerequisite(id)}
        />
        <button
          type="button"
          onClick={commitChanges(id)}
        >
          <Translation id="prerequisite.commit-changes" />
        </button>
      </>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default function RefactoringDashboard({
  refactoring,
  onAddPrerequisiteToRefactoring,
  onStartExperimentation,
  onAddPrerequisiteToPrerequisite,
  onCommitChanges,
}: {
  refactoring: RefactoringGraph,
  onAddPrerequisiteToRefactoring: (refactoringId: string, label: string) => void,
  onStartExperimentation: (refactoringId: string, prerequisiteId: string) => void,
  onAddPrerequisiteToPrerequisite: (refactoringId: string, prerequisiteId: string, label: string) => void,
  onCommitChanges: (refactoringId: string, prerequisiteId: string) => void,
}) {
  const addPrerequisiteToRefactoring = (label: string) => onAddPrerequisiteToRefactoring(refactoring.refactoringId, label);
  const addPrerequisiteToPrerequisite = (prerequisiteId: string) => (label: string) => onAddPrerequisiteToPrerequisite(refactoring.refactoringId, prerequisiteId, label);
  const startExperimentation = (prerequisiteId: string) => () => onStartExperimentation(refactoring.refactoringId, prerequisiteId);
  const commitChanges = (prerequisiteId: string) => () => onCommitChanges(refactoring.refactoringId, prerequisiteId);

  const { nodes, edges } = mapResponseToRefactoringGraph(
    refactoring,
    { addPrerequisiteToRefactoring },
    { startExperimentation, addPrerequisiteToPrerequisite, commitChanges },
  );

  const nodeTypes = {
    prerequisite: PrerequisiteNode,
    refactoring: RefactoringNode,
  };

  return (
    <div className={styles.dashboard}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}
