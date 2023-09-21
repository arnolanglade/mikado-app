'use client';

import React, { FormEvent, useRef } from 'react';
import { Translation } from '@/lib/i18n/intl-provider';

export default function AddPrerequisiteForm({ onSubmit }: { onSubmit: (label: string) => void }) {
  const prerequisiteLabel = useRef<HTMLInputElement>(null);

  const addPrerequisite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prerequisiteLabel.current) {
      onSubmit(prerequisiteLabel.current?.value!);
      prerequisiteLabel.current.value = '';
    }
  };

  return (
    <form onSubmit={addPrerequisite}>
      <input required ref={prerequisiteLabel} type="text" />
      <button type="submit" aria-label="add prerequisite">
        <Translation id="prerequisite.add" />
      </button>
    </form>
  );
}
