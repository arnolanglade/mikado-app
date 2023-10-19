'use client';

import React, { FormEvent, useRef } from 'react';
import { Translation } from '@/tools/i18n/intl-provider';
import { Form, SubmitButton, Textarea } from '@/tools/design-system/form';

export default function StartTaskForm({ onSubmit }: { onSubmit: (goal: string) => void }) {
  const goalref = useRef<HTMLTextAreaElement>(null);

  const startTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(goalref.current?.value!);
  };

  return (
    <Form onSubmit={startTask}>
      <Textarea ref={goalref} />
      <SubmitButton label={<Translation id="mikado-graph.start" />} />
    </Form>
  );
}
