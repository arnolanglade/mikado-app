'use client';

import React, { FormEvent, useRef } from 'react';
import { Translation } from '@/tools/i18n/intl-provider';
import { Form, SubmitButton, Textarea } from '@/tools/design-system/form';
import Typography from '@/tools/design-system/Typography';

export default function StartTaskForm({ onSubmit }: { onSubmit: (goal: string) => void }) {
  const goalRef = useRef<HTMLTextAreaElement>(null);

  const startTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(goalRef.current?.value!);
  };

  return (
    <Form onSubmit={startTask}>
      <Typography variant="h1">
        <Translation id="mikado-graph.goal-and-objective" />
      </Typography>
      <Textarea ref={goalRef} />
      <SubmitButton label={<Translation id="mikado-graph.start" />} />
    </Form>
  );
}
