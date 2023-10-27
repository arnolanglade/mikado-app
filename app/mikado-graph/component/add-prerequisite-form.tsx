'use client';

import React, { FormEvent, useRef } from 'react';
import { Translation } from '@/tools/i18n/intl-provider';
import {
  Button, ButtonGroup, Form, SubmitButton, Textarea,
} from '@/tools/design-system/form';

export default function AddPrerequisiteForm(
  { onSubmit, onCancel }:
  { onSubmit: (label: string) => void, onCancel?: () => void },
) {
  const LabelRef = useRef<HTMLTextAreaElement>(null);

  const addPrerequisite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (LabelRef.current) {
      onSubmit(LabelRef.current?.value!);
      LabelRef.current.value = '';
    }
  };

  return (
    <Form onSubmit={addPrerequisite}>
      <Textarea ref={LabelRef} />
      <ButtonGroup>
        {onCancel && (
        <Button onClick={onCancel}>
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
