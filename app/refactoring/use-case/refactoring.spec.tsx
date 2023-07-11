'use client';

import { act, renderHook } from '@testing-library/react';
import useRefactoring from '@/refactoring/use-case/refactoring';
import { jest } from '@jest/globals';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import httpClient, { HttpClient } from '@/lib/http-client';
import { createWrapper } from '@/lib/test-utils';

const aHttpClient = (client: Partial<HttpClient>): HttpClient => ({
  post: jest.fn() as jest.Mocked<typeof httpClient.post>,
  get: jest.fn() as jest.Mocked<typeof httpClient.get>,
  ...client,
});
const aRouter = (router: Partial<AppRouterInstance>): AppRouterInstance => ({
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  ...router,
});

describe('useRefactoring', () => {
  test('The developer starts a refactoring', async () => {
    const post = jest.fn() as jest.Mocked<typeof httpClient.post>;
    const push = jest.fn();
    const { result } = renderHook(useRefactoring, {
      wrapper: createWrapper({
        httpClient: (aHttpClient({ post })), useRouter: () => (aRouter({ push })),
      }),
    });

    await act(() => result.current.startRefactoring('Refactor method'));

    expect(post).toHaveBeenCalledWith('/api/refactoring', { goal: 'Refactor method' });
    expect(push).toHaveBeenCalledWith('/refactoring');
  });
});
