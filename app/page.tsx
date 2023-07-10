'use client';

import React, { FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { post } from '@/lib/http-client';

export default function StartRefactoring() {
  const router = useRouter();
  const goalInput = useRef<HTMLInputElement>(null);

  const startRefactoring = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await post('/api/refactoring', {
      goal: goalInput.current?.value,
    });
    router.push('/refactoring');
  };

  return (
    <div className={styles.dashboard}>
      <form onSubmit={startRefactoring}>
        <input required ref={goalInput} />
        <button type="submit">Start refactoring</button>
      </form>
    </div>
  );
}
