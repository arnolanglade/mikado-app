'use client';

import React, { FormEvent, useRef } from 'react';
import { Translation } from '@/lib/i18n/intl-provider';

export default function StartTaskForm({ onSubmit }: { onSubmit: (goal: string) => void }) {
  const goalInput = useRef<HTMLInputElement>(null);

  const startTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(goalInput.current?.value!);
  };

  return (
    <form onSubmit={startTask}>
      <input required ref={goalInput} type="text" />
      <button type="submit" aria-label="start a task">
        <Translation id="mikado-graph.start" />
      </button>
    </form>
  );
}
