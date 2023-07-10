'use client';

import React, { FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function StartRefactoring() {
  const router = useRouter();
  const goalInput = useRef<HTMLInputElement>(null);

  const startRefactoring = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch('/api/refactoring', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal: goalInput.current?.value,
      }),
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
