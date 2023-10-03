'use client';

import React from 'react';
import StartRefactoringForm from '@/refactoring/component/start-refactoring-form';
import useRefactoring from '@/refactoring/use-case/mikado-graph';
import styles from './page.module.css';

export default function StartRefactoring() {
  const { startRefactoring } = useRefactoring();

  return (
    <div className={styles.dashboard}>
      <StartRefactoringForm onSubmit={startRefactoring} />
    </div>
  );
}
