'use client';

import React from 'react';
import StartRefactoringForm from '@/mikado-graph/component/start-refactoring-form';
import useMikadoGraph from '@/mikado-graph/use-case/mikado-graph';
import styles from './page.module.css';

export default function StartRefactoring() {
  const { startTask } = useMikadoGraph();

  return (
    <div className={styles.dashboard}>
      <StartRefactoringForm onSubmit={startTask} />
    </div>
  );
}
