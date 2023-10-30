'use client';

import React, { FormEvent, useState } from 'react';
import { Translation, useIntl } from '@/tools/i18n/intl-provider';
import {
  Form, FormError, SubmitButton, Textarea,
} from '@/tools/design-system/form';
import Typography from '@/tools/design-system/typography';

export default function StartTaskForm({ onSubmit }: { onSubmit: (goal: string) => void }) {
  const { translation } = useIntl();
  const [error, setError] = useState<string | null>(null);

  const startTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get('goal') === '') {
      setError(translation('mikado-graph.error.emptyGoal'));
      return;
    }

    onSubmit(formData.get('goal') as string);
  };

  return (
    <Form onSubmit={startTask}>
      <Typography variant="h1">
        <Translation id="mikado-graph.goal-and-objective" />
      </Typography>
      <Textarea name="goal" />
      <FormError error={error} />
      <SubmitButton>
        <Translation id="mikado-graph.start" />
      </SubmitButton>
    </Form>
  );
}
