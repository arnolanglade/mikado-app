'use client';

import React, { FormEvent, useState } from 'react';
import { Translation, useIntl } from '@/tools/i18n/intl-provider';
import {
  Form, FormError, SubmitButton, Textarea,
} from '@/tools/design-system/form';
import Typography from '@/tools/design-system/typography';
import Link from 'next/link';
import styles from './start-task-form.module.css';

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
    <Form onSubmit={startTask} className={styles.form}>
      <Typography variant="h1">
        <Translation id="mikado-graph.goal-and-objective" />
      </Typography>
      <Textarea name="goal" placeholder={translation('mikado-graph.placeholder')} />
      <FormError error={error} />
      <SubmitButton>
        <Translation id="mikado-graph.start" />
      </SubmitButton>
      <Link
        className={styles.docLink}
        href="https://arnolanglade.github.io/mikado-app/"
      >
        <Translation id="documentation-link" />

      </Link>
    </Form>
  );
}
