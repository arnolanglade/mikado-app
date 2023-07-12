'use client';

import { act, renderHook } from '@testing-library/react';
import useRefactoring from '@/refactoring/use-case/refactoring';
import { jest } from '@jest/globals';
import httpClient from '@/lib/http-client';
import {
  aHttpClient, aNotifier, aRouter, createWrapper,
} from '@/test/test-utils';

describe('useRefactoring', () => {
  test('The developer provide a goal to start a refactoring', async () => {
    const post = jest.fn() as jest.Mocked<typeof httpClient.post>;
    const push = jest.fn();
    const { result } = renderHook(useRefactoring, {
      wrapper: createWrapper({
        httpClient: aHttpClient({ post }), useRouter: aRouter({ push }),
      }),
    });

    await act(() => result.current.startRefactoring('Refactor method'));

    expect(post).toHaveBeenCalledWith('/api/refactoring', { goal: 'Refactor method' });
    expect(push).toHaveBeenCalledWith('/refactoring');
  });

  test('The developer is notified when the refactoring starts', async () => {
    const success = jest.fn();
    const { result } = renderHook(useRefactoring, {
      wrapper: createWrapper(
        {
          httpClient: aHttpClient(), useRouter: aRouter(), useNotification: aNotifier({ success }),
        },
        {
          'refactoring.notification.success': 'The refactoring has been started',
        },
      ),
    });

    await act(() => result.current.startRefactoring('Refactor method'));

    expect(success).toHaveBeenCalledWith('The refactoring has been started');
  });
});
