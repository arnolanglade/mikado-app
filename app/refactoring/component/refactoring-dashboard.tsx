'use client';

import React from 'react';
import { RefactoringGraph, Status } from '@/api/refactoring/refactoring';
import useRefactoring from '@/refactoring/use-case/refactoring';
import styles from '@/refactoring/[id]/page.module.css';
import AddPrerequisiteForm from '@/refactoring/component/add-prerequisite-form';
import { Translation } from '@/lib/i18n/intl-provider';

export default function RefactoringDashboard({ refactoring }: { refactoring: RefactoringGraph }) {
  const { addPrerequisite, startExperimentation } = useRefactoring();

  const submitPrerequisite = (label: string) => addPrerequisite(refactoring.refactoringId, label);

  return (
    <div className={styles.dashboard}>
      <div className={styles.refactoringGoal}>
        { refactoring.goal }
        <AddPrerequisiteForm onSubmit={submitPrerequisite} />
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
              onClick={() => startExperimentation(refactoring.refactoringId, prerequisite.prerequisiteId)}
            >
              Start experimentation
              <Translation id="refactoring.prerequisite.start.button" />
            </button>
            )}
          </div>
        ),
      )}
    </div>
  );
}
