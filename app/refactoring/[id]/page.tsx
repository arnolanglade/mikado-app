import React from 'react';
import { getRefactoringById } from '@/api/refactoring/refactoring';
import styles from './page.module.css';

export default async function Refactoring({ params: { id } }: { params: { id: string } }) {
  const refactoring = (await getRefactoringById(id));

  return (
    <div className={styles.dashboard}>
      <div className={styles.refactoringGoal}>
        { refactoring.goal }
      </div>
    </div>
  );
}
