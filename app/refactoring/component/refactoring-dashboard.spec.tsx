'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { createWrapper } from '@/test/test-utils';
import RefactoringDashboard from '@/refactoring/component/refactoring-dashboard';

describe('RefactoringDashboard', () => {
  test('The developer sees the refactoring graph thanks to its id', async () => {
    render(<RefactoringDashboard refactoring={{
      id: '86be6200-1303-48dc-9403-fe497186a0e4',
      goal: 'Refactor this method',
      prerequisites: [],
    }}
    />, {
      wrapper: createWrapper(
        {},
        { 'refactoring.add-prerequisite': 'Add prerequisite' },
      ),
    });

    expect(screen.getByText('Refactor this method')).toBeInTheDocument();
  });
});
