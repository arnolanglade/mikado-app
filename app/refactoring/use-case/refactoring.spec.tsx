'use client';

import { act, renderHook } from '@testing-library/react';
import useRefactoring from '@/refactoring/use-case/refactoring';
import { jest } from '@jest/globals';
import {
  aNotifier, aRefactoringApi, aRouter, createWrapper,
} from '@/test/test-utils';
import refactoringApi from '@/refactoring/refactoring';
import { v4 as uuidv4 } from 'uuid';

describe('useRefactoring', () => {
  describe('start refactoring', () => {
    test('The developer is notified after starting a refactoring that everything went well', async () => {
      const success = jest.fn();
      const start = jest.fn() as jest.Mocked<typeof refactoringApi.start>;
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ start }),
            useNotification: aNotifier({ success }),
          },
          { 'refactoring.notification.success': 'The refactoring has been started' },
        ),
      });

      await act(() => result.current.startRefactoring('Refactor method'));

      expect(start).toHaveBeenCalledWith('Refactor method');
      expect(success).toHaveBeenCalledWith('The refactoring has been started');
    });

    test('The developer is redirected to the refactoring page', async () => {
      const push = jest.fn();
      const refactoringId = uuidv4();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            useRouter: aRouter({ push }),
            refactoringApi: aRefactoringApi({ start: async () => refactoringId }),
          },
        ),
      });

      await act(() => result.current.startRefactoring('Refactor method'));

      expect(push).toHaveBeenCalledWith(`/refactoring/${refactoringId}`);
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
          { 'refactoring.notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.startRefactoring('Refactor method'));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  describe('add prerequisite to a refactoring', () => {
    test('The developer is notified after adding a prerequisite that everything went well', async () => {
      const addPrerequisiteToRefactoring = jest.fn() as jest.Mocked<typeof refactoringApi.addPrerequisiteToRefactoring>;
      const success = jest.fn();
      const refactoringId = uuidv4();
      const prerequisiteLabel = 'Do that';
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ addPrerequisiteToRefactoring }),
            useNotification: aNotifier({ success }),
          },
          { 'refactoring.prerequisite.notification.success': 'The prerequisite has been added' },
        ),
      });

      await act(() => result.current.addPrerequisiteToRefactoring(
        refactoringId,
        prerequisiteLabel,
      ));

      expect(addPrerequisiteToRefactoring).toHaveBeenCalledWith(refactoringId, prerequisiteLabel);
      expect(success).toHaveBeenCalledWith('The prerequisite has been added');
    });

    test('The refactoring graph is refresh after adding a prerequisite', async () => {
      const refresh = jest.fn();

      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ addPrerequisiteToRefactoring: async () => uuidv4() }),
            useRouter: aRouter({ refresh }),
          },
        ),
      });

      await act(() => result.current.addPrerequisiteToRefactoring(
        uuidv4(),
        'Do this',
      ));

      expect(refresh).toHaveBeenCalled();
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({
              addPrerequisiteToRefactoring: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          { 'refactoring.prerequisite.notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.addPrerequisiteToRefactoring(
        uuidv4(),
        'Do this',
      ));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  describe('add prerequisite to a prerequisite', () => {
    test('The developer is notified after adding a prerequisite that everything went well', async () => {
      const addPrerequisiteToPrerequisite = jest.fn() as jest.Mocked<typeof refactoringApi.addPrerequisiteToPrerequisite>;
      const success = jest.fn();
      const refactoringId = uuidv4();
      const prerequisiteId = uuidv4();
      const prerequisiteLabel = 'Do that';
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ addPrerequisiteToPrerequisite }),
            useNotification: aNotifier({ success }),
          },
          { 'refactoring.prerequisite.notification.success': 'The prerequisite has been added' },
        ),
      });

      await act(() => result.current.addPrerequisiteToPrerequisite(
        refactoringId,
        prerequisiteId,
        prerequisiteLabel,
      ));

      expect(addPrerequisiteToPrerequisite).toHaveBeenCalledWith(refactoringId, prerequisiteId, prerequisiteLabel);
      expect(success).toHaveBeenCalledWith('The prerequisite has been added');
    });

    test('The refactoring graph is refresh after adding a prerequisite', async () => {
      const refresh = jest.fn();

      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ addPrerequisiteToPrerequisite: async () => uuidv4() }),
            useRouter: aRouter({ refresh }),
          },
        ),
      });

      await act(() => result.current.addPrerequisiteToPrerequisite(
        uuidv4(),
        uuidv4(),
        'Do this',
      ));

      expect(refresh).toHaveBeenCalled();
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({
              addPrerequisiteToPrerequisite: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          { 'refactoring.prerequisite.notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.addPrerequisiteToPrerequisite(
        uuidv4(),
        uuidv4(),
        'Do this',
      ));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  describe('start experimentation', () => {
    test('The developer is notified after starting an experimentation that everything went well', async () => {
      const success = jest.fn();
      const refactoringId = uuidv4();
      const prerequisiteId = uuidv4();
      const startExperimentation = jest.fn() as jest.Mocked<typeof refactoringApi.startExperimentation>;

      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ startExperimentation }),
            useNotification: aNotifier({ success }),
          },
          { 'refactoring.prerequisite.start.notification.success': 'The experimentation has started' },
        ),
      });

      await act(() => result.current.startExperimentation(
        refactoringId,
        prerequisiteId,
      ));

      expect(startExperimentation).toHaveBeenCalledWith(refactoringId, prerequisiteId);
      expect(success).toHaveBeenCalledWith('The experimentation has started');
    });

    test('The refactoring graph is refresh after starting an experimentation', async () => {
      const refresh = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ startExperimentation: async () => {} }),
            useRouter: aRouter({ refresh }),
          },
        ),
      });

      await act(() => result.current.startExperimentation(
        uuidv4(),
        uuidv4(),
      ));

      expect(refresh).toHaveBeenCalled();
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({
              startExperimentation: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          { 'refactoring.prerequisite.start.notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.startExperimentation(
        uuidv4(),
        uuidv4(),
      ));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  describe('commit changes', () => {
    test('The developer is notified after commit changes that everything went well', async () => {
      const success = jest.fn();
      const refactoringId = uuidv4();
      const prerequisiteId = uuidv4();
      const commitChanges = jest.fn() as jest.Mocked<typeof refactoringApi.commitChanges>;

      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ commitChanges }),
            useNotification: aNotifier({ success }),
          },
          { 'refactoring.prerequisite.notification.success': 'Changes committed' },
        ),
      });

      await act(() => result.current.commitChanges(
        refactoringId,
        prerequisiteId,
      ));

      expect(commitChanges).toHaveBeenCalledWith(refactoringId, prerequisiteId);
      expect(success).toHaveBeenCalledWith('Changes committed');
    });

    test('The refactoring graph is refresh after committing changes', async () => {
      const refresh = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({ commitChanges: async () => {} }),
            useRouter: aRouter({ refresh }),
          },
        ),
      });

      await act(() => result.current.commitChanges(
        uuidv4(),
        uuidv4(),
      ));

      expect(refresh).toHaveBeenCalled();
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(useRefactoring, {
        wrapper: createWrapper(
          {
            refactoringApi: aRefactoringApi({
              commitChanges: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          { 'refactoring.prerequisite.start.notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.commitChanges(
        uuidv4(),
        uuidv4(),
      ));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });
});
