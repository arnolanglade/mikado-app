'use client';

import React from 'react';
import { RefactoringGraph, Status } from '@/api/refactoring/refactoring';
import styles from '@/refactoring/[id]/page.module.css';
import AddPrerequisiteForm from '@/refactoring/component/add-prerequisite-form';
import { Translation } from '@/lib/i18n/intl-provider';

export default function RefactoringDashboard(
  {
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
  },
) {
  const addPrerequisiteToRefactoring = (label: string) => onAddPrerequisiteToRefactoring(refactoring.refactoringId, label);
  const addPrerequisiteToPrerequisite = (prerequisiteId: string) => (label: string) => onAddPrerequisiteToPrerequisite(refactoring.refactoringId, prerequisiteId, label);
  const startExperimentation = (refactoringId: string, prerequisiteId: string) => () => onStartExperimentation(refactoringId, prerequisiteId);
  const commitChanges = (refactoringId: string, prerequisiteId: string) => () => onCommitChanges(refactoringId, prerequisiteId);

  return (
    <div className={styles.dashboard}>
      <div className={styles.refactoringGoal} data-testid="refactoring">
        { refactoring.goal }
        <AddPrerequisiteForm onSubmit={addPrerequisiteToRefactoring} />
      </div>
      <div data-testid="prerequisites">
        {refactoring.prerequisites.map(
          (prerequisite) => (
            <div
              className={styles.prerequisite}
              key={prerequisite.prerequisiteId}
            >
              { prerequisite.label }
              { prerequisite.status === Status.TODO && (
                <button
                  type="button"
                  onClick={startExperimentation(refactoring.refactoringId, prerequisite.prerequisiteId)}
                >
                  <Translation id="prerequisite.start-experimentation" />
                </button>
              )}
              { prerequisite.status === Status.EXPERIMENTING && (
              <>
                <AddPrerequisiteForm onSubmit={addPrerequisiteToPrerequisite(prerequisite.prerequisiteId)} />
                <button
                  type="button"
                  onClick={commitChanges(refactoring.refactoringId, prerequisite.prerequisiteId)}
                >
                  <Translation id="prerequisite.commit-changes" />
                </button>
              </>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
