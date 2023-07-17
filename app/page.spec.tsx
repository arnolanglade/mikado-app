import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartRefactoring from '@/page';
import { aRouter, createWrapper } from '@/test/test-utils';
import { jest } from '@jest/globals';

describe('StartRefactoring Page', () => {
  test('The developer provides a goal to start a refactoring', async () => {
    const push = jest.fn();
    render(<StartRefactoring />, {
      wrapper: createWrapper(
        {
          refactoringApi: {
            start: async () => '86be6200-1303-48dc-9403-fe497186a0e4',
          },
          useRouter: aRouter({ push }),
        },
        {
          'refactoring.start': 'Start refactoring',
          'refactoring.notification.success': 'The refactoring has been started',
        },
      ),
    });

    await userEvent.type(screen.getByRole('textbox'), 'Refactor method');
    await userEvent.click(screen.getByText('Start refactoring'));

    expect(push).toHaveBeenCalledWith('/refactoring/86be6200-1303-48dc-9403-fe497186a0e4');
  });
});
