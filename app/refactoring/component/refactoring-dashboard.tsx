'use client';

import React from 'react';
import { RefactoringGraph } from '@/api/refactoring/refactoring';
import useRefactoring from '@/refactoring/use-case/refactoring';
import styles from '@/refactoring/[id]/page.module.css';
import AddPrerequisiteForm from '@/refactoring/component/add-prerequisite-form';

export default function RefactoringDashboard({ refactoring }: { refactoring: RefactoringGraph }) {
  const { addPrerequisite, startExperimentation } = useRefactoring();

  const submitPrerequisite = (label: string) => addPrerequisite(refactoring.id, label);

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
            <button
              type="button"
              onClick={() => startExperimentation(refactoring.id, prerequisite.prerequisiteId)}
            >
              Start experimentation
            </button>
          </div>
        ),
      )}
    </div>
  );
}
