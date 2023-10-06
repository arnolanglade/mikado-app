'use client';

import React from 'react';
import StartTaskForm from '@/mikado-graph/component/start-task-form';
import { useStartTask } from '@/mikado-graph/mikado-graph.usecase';
import styles from './page.module.css';

export default function StartTask() {
  const { startTask } = useStartTask();

  return (
    <div className={styles.dashboard}>
      <StartTaskForm onSubmit={startTask} />
    </div>
  );
}
