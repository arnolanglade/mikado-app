'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWrapper } from '@/test/test-utils';
import AddPrerequisiteForm from '@/mikado-graph/component/add-prerequisite-form';
import { jest } from '@jest/globals';

describe('AddPrerequisiteForm', () => {
  test('The onSubmit callback is called when the form is submitted', async () => {
    const onSubmit = jest.fn();
    render(<AddPrerequisiteForm onSubmit={onSubmit} />, {
      wrapper: createWrapper(
        {},
        { add: 'Add prerequisite' },
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
        { add: 'Add prerequisite' },
      ),
    });
    const prerequisiteInput = screen.getByRole<HTMLInputElement>('textbox');

    await userEvent.type(screen.getByRole('textbox'), 'Refactor method');
    await userEvent.click(screen.getByText('Add prerequisite'));

    expect(prerequisiteInput.value).toBe('');
  });

  describe('Cancel button', () => {
    test('The cancel button is hidden when the cancel callback is not provided', async () => {
      render(<AddPrerequisiteForm onSubmit={jest.fn()} />, {
        wrapper: createWrapper(
          {},
          { cancel: 'Cancel' },
        ),
      });

      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    test('The cancel button is display when the cancel callback is  provided', async () => {
      render(<AddPrerequisiteForm onSubmit={jest.fn()} onCancel={jest.fn()} />, {
        wrapper: createWrapper(
          {},
          { cancel: 'Cancel' },
        ),
      });

      expect(screen.queryByText('Cancel')).toBeInTheDocument();
    });

    test('The onCancel callback is called when the button is clicked', async () => {
      const onCancel = jest.fn();
      render(<AddPrerequisiteForm onSubmit={jest.fn()} onCancel={onCancel} />, {
        wrapper: createWrapper(
          {},
          { cancel: 'Cancel' },
        ),
      });

      await userEvent.click(screen.getByText('Cancel'));

      expect(onCancel).toBeCalled();
    });
  });
});
