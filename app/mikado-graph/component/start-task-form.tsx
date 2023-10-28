'use client';

import React, { FormEvent, useRef, useState } from 'react';
import { Translation, useIntl } from '@/tools/i18n/intl-provider';
import {
  Form, FormError, SubmitButton, Textarea,
} from '@/tools/design-system/form';
import Typography from '@/tools/design-system/typography';

export default function StartTaskForm({ onSubmit }: { onSubmit: (goal: string) => void }) {
  const goalRef = useRef<HTMLTextAreaElement>(null);
  const { translation } = useIntl();
  const [error, setError] = useState<string | null>(null);

  const startTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (goalRef.current) {
      if (goalRef.current.value === '') {
        setError(translation('mikado-graph.error.emptyGoal'));
        return;
      }
      onSubmit(goalRef.current.value);
      goalRef.current.value = '';
    }
  };

  return (
    <Form onSubmit={startTask}>
      <Typography variant="h1">
        <Translation id="mikado-graph.goal-and-objective" />
      </Typography>
      <Textarea ref={goalRef} />
      <FormError error={error} />
      <SubmitButton>
        <Translation id="mikado-graph.start" />
      </SubmitButton>
    </Form>
  );
}
