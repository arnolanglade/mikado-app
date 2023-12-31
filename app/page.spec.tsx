import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartTask from '@/page';
import {
  aMikadoGraphApi, aMikadoGraphView, aRouter, createWrapper,
} from '@/test/test-utils';
import { jest } from '@jest/globals';

describe('StartTask Page (SSR)', () => {
  test('The developer provides a goal to start a task', async () => {
    const push = jest.fn();
    render(<StartTask />, {
      wrapper: createWrapper(
        {
          mikadoGraphApi: aMikadoGraphApi({
            start: async () => aMikadoGraphView({
              mikadoGraphId: '86be6200-1303-48dc-9403-fe497186a0e4',
            }),
          }),
          useRouter: aRouter({ push }),
        },
        {
          'mikado-graph.start': 'Start a task',
        },
      ),
    });

    await userEvent.type(screen.getByRole('textbox'), 'Refactor method');
    await userEvent.click(screen.getByText('Start a task'));

    expect(push).toHaveBeenCalledWith('/mikado-graph/86be6200-1303-48dc-9403-fe497186a0e4');
  });
});
