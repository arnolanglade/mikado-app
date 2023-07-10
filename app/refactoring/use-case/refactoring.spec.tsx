'use client';

import { act, renderHook } from '@testing-library/react';
import useRefactoring from '@/refactoring/use-case/refactoring';
import { jest } from '@jest/globals';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { HttpClient } from '@/lib/http-client';
import { createWrapper } from '@/lib/test-utils';

describe('useRefactoring', () => {
  test('The developer starts a refactoring', async () => {
    const post = jest.fn();
    const push = jest.fn();
    const { result } = renderHook(useRefactoring, {
      wrapper: createWrapper({
        httpClient: ({ post } as HttpClient), useRouter: () => ({ push } as AppRouterInstance),
      }),
    });

    await act(() => result.current.startRefactoring('Refactor method'));

    expect(post).toHaveBeenCalledWith('/api/refactoring', { goal: 'Refactor method' });
    expect(push).toHaveBeenCalledWith('/refactoring');
  });
});
