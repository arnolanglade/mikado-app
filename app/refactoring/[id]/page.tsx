import React from 'react';
import { getRefactoringById } from '@/api/refactoring/refactoring';
import RefactoringDashboard from '@/refactoring/component/refactoring-dashboard';
import styles from './page.module.css';

export default async function Refactoring({ params: { id } }: { params: { id: string } }) {
  const refactoring = (await getRefactoringById(id));

  return (
    <div className={styles.dashboard}>
      <RefactoringDashboard refactoring={refactoring} />
    </div>
  );
}
