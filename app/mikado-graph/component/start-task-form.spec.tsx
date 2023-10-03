'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartTaskForm from '@/mikado-graph/component/start-task-form';
import { createWrapper } from '@/test/test-utils';

describe('StartTaskForm', () => {
  test('The onSubmit callback is called when the form is submitted', async () => {
    const onSubmit = jest.fn();
    render(<StartTaskForm onSubmit={onSubmit} />, {
      wrapper: createWrapper(
        {},
        { 'refactoring.start': 'Start refactoring' },
      ),
    });

    await userEvent.type(screen.getByRole('textbox'), 'Refactor method');
    await userEvent.click(screen.getByText('Start refactoring'));

    expect(onSubmit).toHaveBeenCalledWith('Refactor method');
  });
});
