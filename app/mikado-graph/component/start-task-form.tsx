'use client';

import React, { FormEvent, useRef } from 'react';
import { Translation } from '@/lib/i18n/intl-provider';

export default function StartTaskForm({ onSubmit }: { onSubmit: (goal: string) => void }) {
  const goalInput = useRef<HTMLInputElement>(null);

  const startRefactoring = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(goalInput.current?.value!);
  };

  return (
    <form onSubmit={startRefactoring}>
      <input required ref={goalInput} type="text" />
      <button type="submit" aria-label="start refactoring">
        <Translation id="mikado-graph.start" />
      </button>
    </form>
  );
}
