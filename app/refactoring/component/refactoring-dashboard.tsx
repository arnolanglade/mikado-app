'use client';

import React from 'react';
import { PrerequisiteGraph, RefactoringGraph, Status } from '@/api/refactoring/refactoring';
import styles from '@/refactoring/[id]/page.module.css';
import AddPrerequisiteForm from '@/refactoring/component/add-prerequisite-form';
import { Translation } from '@/lib/i18n/intl-provider';

function RefactoringNode({
  refactoring,
  addPrerequisiteToRefactoring,
}: {
  refactoring: RefactoringGraph,
  addPrerequisiteToRefactoring: (label: string) => void
}) {
  return (
    <div className={styles.refactoringGoal} data-testid="refactoring">
      {refactoring.goal}
      {' '}
      {refactoring.done ? <Translation id="prerequisite.done" />
        : <AddPrerequisiteForm onSubmit={addPrerequisiteToRefactoring} />}
    </div>
  );
}

function PrerequisiteNode({
  prerequisites,
  startExperimentation,
  addPrerequisiteToPrerequisite,
  commitChanges,
} : {
  prerequisites: PrerequisiteGraph[]
  startExperimentation: (prerequisiteId: string) => () => void,
  addPrerequisiteToPrerequisite: (prerequisiteId: string) => (label: string) => void,
  commitChanges: (prerequisiteId: string) => () => void,
}) {
  return (
    <div data-testid="prerequisites">
      {prerequisites.map(
        (prerequisite) => (
          <div
            className={styles.prerequisite}
            key={prerequisite.prerequisiteId}
          >
            <p>
              {prerequisite.label}
              {' '}
              {prerequisite.status === Status.DONE && <Translation id="prerequisite.done" />}
            </p>
            {prerequisite.status === Status.TODO && (
            <button
              type="button"
              onClick={startExperimentation(prerequisite.prerequisiteId)}
            >
              <Translation id="prerequisite.start-experimentation" />
            </button>
            )}
            {prerequisite.status === Status.EXPERIMENTING && (
            <>
              <AddPrerequisiteForm
                onSubmit={addPrerequisiteToPrerequisite(prerequisite.prerequisiteId)}
              />
              <button
                type="button"
                onClick={commitChanges(prerequisite.prerequisiteId)}
              >
                <Translation id="prerequisite.commit-changes" />
              </button>
            </>
            )}
          </div>
        ),
      )}
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

  return (
    <div className={styles.dashboard}>
      <RefactoringNode
        refactoring={refactoring}
        addPrerequisiteToRefactoring={addPrerequisiteToRefactoring}
      />
      <PrerequisiteNode
        prerequisites={refactoring.prerequisites}
        startExperimentation={startExperimentation}
        addPrerequisiteToPrerequisite={addPrerequisiteToPrerequisite}
        commitChanges={commitChanges}
      />
    </div>
  );
}
