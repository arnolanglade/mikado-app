'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { aRefactoringApi, aRefactoringGraph, createWrapper } from '@/test/test-utils';
import RefactoringDashboard from '@/refactoring/component/refactoring-dashboard';
import { Status } from '@/api/refactoring/refactoring';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import refactoringApi from '@/refactoring/refactoring';

describe('RefactoringDashboard', () => {
  test('The developer sees the goal of the refactoring', async () => {
    render(<RefactoringDashboard refactoring={aRefactoringGraph({
      goal: 'Refactor this method',
    })}
    />, {
      wrapper: createWrapper(
        {},
        { 'refactoring.add-prerequisite': 'Add prerequisite' },
      ),
    });

    expect(screen.getByText('Refactor this method')).toBeInTheDocument();
  });

  test('The developer sees the prerequisite of the refactoring', async () => {
    render(<RefactoringDashboard refactoring={aRefactoringGraph({
      prerequisites: [
        {
          prerequisiteId: '44abee80-8630-4077-9f14-f31dca577d7d',
          label: 'Do this',
          status: Status.TODO,
        },
      ],
    })}
    />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Do this')).toBeInTheDocument();
  });

  test('The developer starts an experimentation on a todo prerequisite', async () => {
    const startExperimentation = jest.fn() as jest.Mocked<typeof refactoringApi.startExperimentation>;
    const refactoringId = uuidv4();
    const prerequisiteId = uuidv4();
    render(<RefactoringDashboard refactoring={aRefactoringGraph({
      id: refactoringId,
      prerequisites: [
        {
          prerequisiteId,
          label: 'Do this',
          status: Status.TODO,
        },
      ],
    })}
    />, {
      wrapper: createWrapper({ refactoringApi: aRefactoringApi({ startExperimentation }) }),
    });

    await userEvent.click(screen.getByText('Start experimentation'));

    expect(startExperimentation).toHaveBeenCalledWith(refactoringId, prerequisiteId);
  });
});
