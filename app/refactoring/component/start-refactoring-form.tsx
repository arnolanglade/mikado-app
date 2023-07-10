'use client';

import React, { FormEvent, useRef } from 'react';

export default function StartRefactoringForm({ onSubmit }: { onSubmit: (goal: string) => void }) {
  const goalInput = useRef<HTMLInputElement>(null);

  const startRefactoring = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(goalInput.current?.value!);
  };

  return (
    <form onSubmit={startRefactoring}>
      <input required ref={goalInput} type="text" />
      <button type="submit">Start refactoring</button>
    </form>
  );
}
