'use client';

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { aRefactoringGraph, createWrapper } from '@/test/test-utils';
import RefactoringDashboard from '@/refactoring/component/refactoring-dashboard';
import { Status } from '@/api/refactoring/refactoring';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

describe('RefactoringDashboard', () => {
  test('The developer sees the refactoring with its prerequisites', async () => {
    render(<RefactoringDashboard
      refactoring={aRefactoringGraph({
        goal: 'Refactor this method',
        prerequisites: [
          {
            label: 'Do this',
          },
        ],
      })}
      onStartExperimentation={jest.fn()}
      onAddPrerequisite={jest.fn()}
    />, {
      wrapper: createWrapper(
        {},
        { 'refactoring.prerequisite.start.button': 'Start experimentation' },
      ),
    });

    expect(screen.getByText('Refactor this method')).toBeInTheDocument();
    expect(screen.getByText('Do this')).toBeInTheDocument();
  });

  test('The onAddPrerequisite callback when a developer add a prerequisite to a refactoring', async () => {
    const onAddPrerequisite = jest.fn();
    const refactoringId = uuidv4();
    const label = 'Refactor method';
    render(<RefactoringDashboard
      refactoring={aRefactoringGraph({ refactoringId, prerequisites: [] })}
      onStartExperimentation={onAddPrerequisite}
      onAddPrerequisite={onAddPrerequisite}
    />, {
      wrapper: createWrapper(
        {},
        { 'refactoring.prerequisite.add"': 'Add prerequisite' },
      ),
    });

    await userEvent.type(within(screen.getByTestId('refactoring')).getByRole('textbox'), label);
    await userEvent.click(screen.getByText('Add prerequisite'));

    expect(onAddPrerequisite).toHaveBeenCalledWith(refactoringId, label);
  });

  test('The onStartExperimentation callback when a developer starts an experimentation on a todo prerequisite', async () => {
    const onStartExperimentation = jest.fn();
    const refactoringId = uuidv4();
    const prerequisiteId = uuidv4();
    render(<RefactoringDashboard
      refactoring={aRefactoringGraph({
        refactoringId,
        prerequisites: [
          { prerequisiteId, status: Status.TODO },
        ],
      })}
      onStartExperimentation={onStartExperimentation}
      onAddPrerequisite={jest.fn()}
    />, {
      wrapper: createWrapper(
        {},
        { 'refactoring.prerequisite.start.button': 'Start experimentation' },
      ),
    });

    await userEvent.click(screen.getByText('Start experimentation'));

    expect(onStartExperimentation).toHaveBeenCalledWith(refactoringId, prerequisiteId);
  });

  test.each([
    Status.EXPERIMENTING,
    Status.DONE,
  ])('The start experimentation button is hidden for a %s prerequisite', async (status: Status) => {
    render(<RefactoringDashboard
      refactoring={aRefactoringGraph({
        prerequisites: [{ status }],
      })}
      onStartExperimentation={jest.fn()}
      onAddPrerequisite={jest.fn()}
    />, {
      wrapper: createWrapper(
        {},
        { 'refactoring.prerequisite.start.button': 'Start experimentation' },
      ),
    });

    expect(screen.queryByText('Start experimentation')).not.toBeInTheDocument();
  });
});
