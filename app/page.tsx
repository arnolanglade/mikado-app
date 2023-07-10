'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/http-client';
import StartRefactoringForm from '@/refactoring/component/start-refactoring-form';
import styles from './page.module.css';

export default function StartRefactoring() {
  const router = useRouter();

  const startRefactoring = async (goal: string) => {
    await post('/api/refactoring', {
      goal,
    });

    router.push('/refactoring');
  };

  return (
    <div className={styles.dashboard}>
      <StartRefactoringForm onSubmit={startRefactoring} />
    </div>
  );
}
