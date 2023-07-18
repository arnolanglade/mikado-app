'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWrapper } from '@/test/test-utils';
import AddPrerequisiteForm from '@/refactoring/component/add-prerequisite-form';

describe('AddPrerequisiteForm', () => {
  test('The onSubmit callback is called when the form is submitted', async () => {
    const onSubmit = jest.fn();
    render(<AddPrerequisiteForm onSubmit={onSubmit} />, {
      wrapper: createWrapper(
        {},
        { 'refactoring.add-prerequisite': 'Add prerequisite' },
      ),
    });

    await userEvent.type(screen.getByRole('textbox'), 'Refactor method');
    await userEvent.click(screen.getByText('Add prerequisite'));

    expect(onSubmit).toHaveBeenCalledWith('Refactor method');
  });
});
