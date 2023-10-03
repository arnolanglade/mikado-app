'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWrapper } from '@/test/test-utils';
import AddPrerequisiteForm from '@/mikado-graph/component/add-prerequisite-form';

describe('AddPrerequisiteForm', () => {
  test('The onSubmit callback is called when the form is submitted', async () => {
    const onSubmit = jest.fn();
    render(<AddPrerequisiteForm onSubmit={onSubmit} />, {
      wrapper: createWrapper(
        {},
        { 'prerequisite.add': 'Add prerequisite' },
      ),
    });

    await userEvent.type(screen.getByRole('textbox'), 'Refactor method');
    await userEvent.click(screen.getByText('Add prerequisite'));

    expect(onSubmit).toHaveBeenCalledWith('Refactor method');
  });

  test('The input value is reset after submitting the form', async () => {
    render(<AddPrerequisiteForm onSubmit={jest.fn()} />, {
      wrapper: createWrapper(
        {},
        { 'prerequisite.add': 'Add prerequisite' },
      ),
    });
    const prerequisiteInput = screen.getByRole<HTMLInputElement>('textbox');

    await userEvent.type(screen.getByRole('textbox'), 'Refactor method');
    await userEvent.click(screen.getByText('Add prerequisite'));

    expect(prerequisiteInput.value).toBe('');
  });
});
