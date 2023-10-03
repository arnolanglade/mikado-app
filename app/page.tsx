'use client';

import React from 'react';
import StartTaskForm from '@/mikado-graph/component/start-task-form';
import useMikadoGraph from '@/mikado-graph/use-case/mikado-graph';
import styles from './page.module.css';

export default function StartRefactoring() {
  const { startTask } = useMikadoGraph();

  return (
    <div className={styles.dashboard}>
      <StartTaskForm onSubmit={startTask} />
    </div>
  );
}
