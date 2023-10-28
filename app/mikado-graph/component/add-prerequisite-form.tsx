'use client';

import React, { FormEvent, useRef, useState } from 'react';
import { Translation, useIntl } from '@/tools/i18n/intl-provider';
import {
  Button, ButtonGroup, Form, FormError, SubmitButton, Textarea,
} from '@/tools/design-system/form';
import Typography from '@/tools/design-system/typography';

export default function AddPrerequisiteForm(
  { onSubmit, onCancel }:
  { onSubmit: (label: string) => void, onCancel?: () => void },
) {
  const { translation } = useIntl();
  const LabelRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);

  const addPrerequisite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (LabelRef.current) {
      if (LabelRef.current.value === '') {
        setError(translation('prerequisite.error.emptyLabel'));
        return;
      }
      onSubmit(LabelRef.current.value);
      LabelRef.current.value = '';
    }
  };

  return (
    <Form onSubmit={addPrerequisite}>
      <Textarea ref={LabelRef} />
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
