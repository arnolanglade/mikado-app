'use client';

import React, { FormEvent, useState } from 'react';
import { Translation, useIntl } from '@/tools/i18n/intl-provider';
import {
  Button, ButtonGroup, Form, FormError, SubmitButton, Textarea,
} from '@/tools/design-system/form';

export default function AddPrerequisiteForm(
  { onSubmit, onCancel }:
  { onSubmit: (label: string) => void, onCancel?: () => void },
) {
  const { translation } = useIntl();
  const [error, setError] = useState<string | null>(null);

  const addPrerequisite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get('label') === '') {
      setError(translation('prerequisite.error.emptyLabel'));
      return;
    }
    onSubmit(formData.get('label') as string);
  };

  return (
    <Form onSubmit={addPrerequisite}>
      <Textarea name="label" />
      <FormError error={error} />
      <ButtonGroup>
        {onCancel && (
        <Button variant="secondary" onClick={onCancel}>
          <Translation id="cancel" />
        </Button>
        )}
        <SubmitButton>
          <Translation id="add" />
        </SubmitButton>
      </ButtonGroup>
    </Form>
  );
}
