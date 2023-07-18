'use client';

import { act, renderHook } from '@testing-library/react';
import useRefactoring from '@/refactoring/use-case/refactoring';
import { jest } from '@jest/globals';
import {
  aNotifier, aRefactoringApi, aRouter, createWrapper,
} from '@/test/test-utils';
import refactoringApi from '@/refactoring/refactoring';

describe('useRefactoring', () => {
  describe('start refactoring', () => {
    test('The goal of the refactoring is saved', async () => {
      const start = jest.fn() as jest.Mocked<typeof refactoringApi.start>;
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ start }),
          },
          {
            'refactoring.notification.success': 'The refactoring has been started',
          },
        ),
      });

      await act(() => result.current.startRefactoring('Refactor method'));

      expect(start).toHaveBeenCalledWith('Refactor method');
    });

    test('The developer is redirected to the refactoring page', async () => {
      const push = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            useRouter: aRouter({ push }),
            refactoringApi: aRefactoringApi({ start: async () => '86be6200-1303-48dc-9403-fe497186a0e4' }),
          },
          {
            'refactoring.notification.success': 'The refactoring has been started',
          },
        ),
      });

      await act(() => result.current.startRefactoring('Refactor method'));

      expect(push).toHaveBeenCalledWith('/refactoring/86be6200-1303-48dc-9403-fe497186a0e4');
    });

    test('The developer is notified that everything went well', async () => {
      const success = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ start: async () => '86be6200-1303-48dc-9403-fe497186a0e4' }),
            useNotification: aNotifier({ success }),
          },
          {
            'refactoring.notification.success': 'The refactoring has been started',
          },
        ),
      });

      await act(() => result.current.startRefactoring('Refactor method'));

      expect(success).toHaveBeenCalledWith('The refactoring has been started');
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({
              start: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          {
            'refactoring.notification.error': 'Something went wrong',
          },
        ),
      });

      await act(() => result.current.startRefactoring('Refactor method'));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  describe('add prerequisite', () => {
    test('The prerequisite is saved', async () => {
      const addPrerequisite = jest.fn() as jest.Mocked<typeof refactoringApi.addPrerequisite>;
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          { refactoringApi: aRefactoringApi({ addPrerequisite }) },
          { 'refactoring.notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.addPrerequisite(
        '86be6200-1303-48dc-9403-fe497186a0e4',
        'Do this',
      ));

      expect(addPrerequisite).toHaveBeenCalledWith('86be6200-1303-48dc-9403-fe497186a0e4', 'Do this');
    });

    test('The developer is notified that everything went well', async () => {
      const success = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ addPrerequisite: async () => 'f446e9e6-08b7-4a5b-bc37-50606f421806' }),
            useNotification: aNotifier({ success }),
          },
          { 'refactoring.prerequisite.notification.success': 'The prerequisite has been added' },
        ),
      });

      await act(() => result.current.addPrerequisite(
        '86be6200-1303-48dc-9403-fe497186a0e4',
        'Do this',
      ));

      expect(success).toHaveBeenCalledWith('The prerequisite has been added');
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({
              addPrerequisite: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          { 'refactoring.prerequisite.notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.addPrerequisite(
        '86be6200-1303-48dc-9403-fe497186a0e4',
        'Do this',
      ));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });
});
