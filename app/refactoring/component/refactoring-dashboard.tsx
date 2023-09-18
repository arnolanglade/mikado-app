'use client';

import React from 'react';
import { RefactoringGraph, Status } from '@/api/refactoring/refactoring';
import styles from '@/refactoring/[id]/page.module.css';
import AddPrerequisiteForm from '@/refactoring/component/add-prerequisite-form';
import { Translation } from '@/lib/i18n/intl-provider';

export default function RefactoringDashboard(
  {
    refactoring,
    onAddPrerequisite,
    onStartExperimentation,
  }: {
    refactoring: RefactoringGraph,
    onAddPrerequisite: (refactoringId: string, label: string) => void,
    onStartExperimentation: (refactoringId: string, prerequisiteId: string) => void,
  },
) {
  const addPrerequisiteToRefactoring = (label: string) => onAddPrerequisite(refactoring.refactoringId, label);
  const startExperimentation = (refactoringId: string, prerequisiteId: string) => () => onStartExperimentation(refactoringId, prerequisiteId);

  return (
    <div className={styles.dashboard}>
      <div className={styles.refactoringGoal} data-testid="refactoring">
        { refactoring.goal }
        <AddPrerequisiteForm onSubmit={addPrerequisiteToRefactoring} />
      </div>
      {refactoring.prerequisites.map(
        (prerequisite) => (
          <div
            className={styles.prerequisite}
            key={prerequisite.prerequisiteId}
          >
            {prerequisite.label}
            { prerequisite.status === Status.TODO && (
            <button
              type="button"
              onClick={startExperimentation(refactoring.refactoringId, prerequisite.prerequisiteId)}
            >
              <Translation id="refactoring.prerequisite.start.button" />
            </button>
            )}
          </div>
        ),
      )}
    </div>
  );
}
