'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartRefactoringForm from '@/refactoring/component/start-refactoring-form';

describe('StartRefactoringForm', () => {
  test('The onSubmit callback is called when the form is submitted', async () => {
    const onSubmit = jest.fn();
    render(<StartRefactoringForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByRole('textbox'), 'Refactor method');
    await userEvent.click(screen.getByText('Start refactoring'));

    expect(onSubmit).toHaveBeenCalledWith('Refactor method');
  });
});
