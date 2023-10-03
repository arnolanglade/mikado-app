'use client';

import { act, renderHook } from '@testing-library/react';
import useMikadoGraph, { useStartTask } from '@/mikado-graph/use-case/mikado-graph';
import { jest } from '@jest/globals';
import {
  aNotifier, aMikadoGraphApi, aMikadoGraphView, aRouter, createWrapper,
} from '@/test/test-utils';
import mikadoGraphApi from '@/mikado-graph/mikado-graph';
import { v4 as uuidv4 } from 'uuid';
import { Mock } from 'jest-mock';
import { Status } from '@/api/mikado-graph/mikako-graph';

describe('useStartTask', () => {
  test('The developer is notified after starting a mikado graph that everything went well', async () => {
    const success = jest.fn();
    const { result } = renderHook(useStartTask, {
      wrapper: createWrapper(
        {
          mikadoGraphApi: aMikadoGraphApi({ start: async () => aMikadoGraphView() }),
          useNotification: aNotifier({ success }),
        },
        { 'mikado-graph.notification.success.start': 'The mikado graph has been started' },
      ),
    });

    await act(() => result.current.startTask('Refactor method'));

    expect(success).toHaveBeenCalledWith('The mikado graph has been started');
  });

  test('The developer is redirected to the mikado graph page', async () => {
    const push = jest.fn();
    const mikadoGraphId = uuidv4();
    const { result } = renderHook(useStartTask, {
      wrapper: createWrapper(
        {
          useRouter: aRouter({ push }),
          mikadoGraphApi: aMikadoGraphApi({ start: async () => aMikadoGraphView({ mikadoGraphId }) }),
        },
      ),
    });

    await act(() => result.current.startTask('Refactor method'));

    expect(push).toHaveBeenCalledWith(`/mikado-graph/${mikadoGraphId}`);
  });

  test('The developer is notified that something went wrong', async () => {
    const error = jest.fn();
    const { result } = renderHook(useStartTask, {
      wrapper: createWrapper(
        {
          mikadoGraphApi: aMikadoGraphApi({
            start: async () => {
              throw Error();
            },
          }),
          useNotification: aNotifier({ error }),
        },
        { 'notification.error': 'Something went wrong' },
      ),
    });

    await act(() => result.current.startTask('Refactor method'));

    expect(error).toHaveBeenCalledWith('Something went wrong');
  });
});

describe('useMikadoGraph', () => {
  describe('get mikado graph', () => {
    test('the first node of the refactoring graph contains the refactoring information', async () => {
      const goal = 'goal';
      const mikadoGraphId = uuidv4();
      const done = false;

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({
        mikadoGraphId,
        goal,
        done,
        prerequisites: [],
      })), {
        wrapper: createWrapper({}, {}),
      });

      expect(result.current.getMikadoGraph()).toEqual({
        nodes: [
          {
            id: mikadoGraphId,
            type: 'refactoring',
            data: { goal, done, addPrerequisiteToRefactoring: expect.any(Function) },
            position: { x: 0, y: 0 },
          },
        ],
        edges: [],
      });
    });

    test('the next nodes contain the prerequisite information', async () => {
      const refactoringId = uuidv4();
      const prerequisiteId = uuidv4();
      const label = 'label';
      const status = Status.TODO;

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({
        mikadoGraphId: refactoringId,
        prerequisites: [{ prerequisiteId, label, status }],
      })), {
        wrapper: createWrapper({}, {}),
      });

      expect(result.current.getMikadoGraph().nodes[1]).toEqual({
        id: prerequisiteId,
        type: 'prerequisite',
        parentId: refactoringId,
        data: {
          label,
          status,
          startExperimentation: expect.any(Function),
          addPrerequisiteToPrerequisite: expect.any(Function),
          commitChanges: expect.any(Function),
        },
        position: { x: 0, y: 100 },
      });
    });

    test('it computes edges between refactoring and its prerequisite children', async () => {
      const refactoringId = uuidv4();
      const prerequisiteId = uuidv4();
      const otherPrerequisiteId = uuidv4();

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({
        mikadoGraphId: refactoringId,
        prerequisites: [
          { prerequisiteId },
          { prerequisiteId: otherPrerequisiteId },
        ],
      })), {
        wrapper: createWrapper({}, {}),
      });

      expect(result.current.getMikadoGraph().edges).toEqual([
        { id: `${refactoringId}-${prerequisiteId}`, source: refactoringId, target: prerequisiteId },
        { id: `${refactoringId}-${otherPrerequisiteId}`, source: refactoringId, target: otherPrerequisiteId },
      ]);
    });

    test('it computes edges between prerequisites and its prerequisites children', async () => {
      const refactoringId = uuidv4();
      const firstLevelPrerequisiteId = uuidv4();
      const secondLevelPrerequisiteId = uuidv4();

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({
        mikadoGraphId: refactoringId,
        prerequisites: [
          { prerequisiteId: firstLevelPrerequisiteId },
          { prerequisiteId: secondLevelPrerequisiteId, parentId: firstLevelPrerequisiteId },
        ],
      })), {
        wrapper: createWrapper({}, {}),
      });

      expect(result.current.getMikadoGraph().edges).toEqual([
        { id: `${refactoringId}-${firstLevelPrerequisiteId}`, source: refactoringId, target: firstLevelPrerequisiteId },
        { id: `${firstLevelPrerequisiteId}-${secondLevelPrerequisiteId}`, source: firstLevelPrerequisiteId, target: secondLevelPrerequisiteId },
      ]);
    });
  });

  describe('add prerequisite to a mikado graph', () => {
    test('The developer is notified after adding a prerequisite that everything went well', async () => {
      const addPrerequisiteToMikadoGraph = jest.fn() as jest.Mocked<typeof mikadoGraphApi.addPrerequisiteToMikadoGraph>;
      const success = jest.fn();
      const mikadoGraphId = uuidv4();
      const prerequisiteLabel = 'Do that';
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({ mikadoGraphId })), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({ addPrerequisiteToMikadoGraph }),
            useNotification: aNotifier({ success }),
          },
          { 'prerequisite.notification.add-prerequisite.success': 'The prerequisite has been added' },
        ),
      });

      await act(() => result.current.addPrerequisiteToMikadoGraph(
        prerequisiteLabel,
      ));

      expect(addPrerequisiteToMikadoGraph).toHaveBeenCalledWith(mikadoGraphId, prerequisiteLabel);
      expect(success).toHaveBeenCalledWith('The prerequisite has been added');
    });

    test('The mikado graph graph is refresh after adding a prerequisite', async () => {
      const refresh = jest.fn();

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({ addPrerequisiteToMikadoGraph: async () => aMikadoGraphView() }),
            useRouter: aRouter({ refresh }),
          },
        ),
      });

      await act(() => result.current.addPrerequisiteToMikadoGraph(
        'Do this',
      ));

      expect(refresh).toHaveBeenCalled();
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({
              addPrerequisiteToMikadoGraph: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          { 'notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.addPrerequisiteToMikadoGraph(
        'Do this',
      ));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  describe('add prerequisite to a prerequisite', () => {
    test('The developer is notified after adding a prerequisite that everything went well', async () => {
      const addPrerequisiteToPrerequisite = jest.fn() as jest.Mocked<typeof mikadoGraphApi.addPrerequisiteToPrerequisite>;
      const success = jest.fn();
      const mikadoGraphId = uuidv4();
      const prerequisiteId = uuidv4();
      const prerequisiteLabel = 'Do that';
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({ mikadoGraphId })), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({ addPrerequisiteToPrerequisite }),
            useNotification: aNotifier({ success }),
          },
          { 'prerequisite.notification.add-prerequisite.success': 'The prerequisite has been added' },
        ),
      });

      await act(() => result.current.addPrerequisiteToPrerequisite(
        prerequisiteId,
        prerequisiteLabel,
      ));

      expect(addPrerequisiteToPrerequisite).toHaveBeenCalledWith(mikadoGraphId, prerequisiteId, prerequisiteLabel);
      expect(success).toHaveBeenCalledWith('The prerequisite has been added');
    });

    test('The mikado graph graph is refresh after adding a prerequisite', async () => {
      const refresh = jest.fn();

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({ addPrerequisiteToPrerequisite: async () => aMikadoGraphView() }),
            useRouter: aRouter({ refresh }),
          },
        ),
      });

      await act(() => result.current.addPrerequisiteToPrerequisite(
        uuidv4(),
        'Do this',
      ));

      expect(refresh).toHaveBeenCalled();
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({
              addPrerequisiteToPrerequisite: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          { 'notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.addPrerequisiteToPrerequisite(
        uuidv4(),
        'Do this',
      ));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  describe('start experimentation', () => {
    test('The developer is notified after starting an experimentation that everything went well', async () => {
      const success = jest.fn();
      const mikadoGraphId = uuidv4();
      const prerequisiteId = uuidv4();
      const startExperimentation = jest.fn() as jest.Mocked<typeof mikadoGraphApi.startExperimentation>;

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({ mikadoGraphId })), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({ startExperimentation }),
            useNotification: aNotifier({ success }),
          },
          { 'prerequisite.notification.start-experimentation.success': 'The experimentation has started' },
        ),
      });

      await act(() => result.current.startExperimentation(
        prerequisiteId,
      ));

      expect(startExperimentation).toHaveBeenCalledWith(mikadoGraphId, prerequisiteId);
      expect(success).toHaveBeenCalledWith('The experimentation has started');
    });

    test('The mikado graph graph is refresh after starting an experimentation', async () => {
      const refresh = jest.fn();
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({ startExperimentation: async () => aMikadoGraphView() }),
            useRouter: aRouter({ refresh }),
          },
        ),
      });

      await act(() => result.current.startExperimentation(
        uuidv4(),
      ));

      expect(refresh).toHaveBeenCalled();
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({
              startExperimentation: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          { 'notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.startExperimentation(
        uuidv4(),
      ));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  describe('commit changes', () => {
    test('The developer is notified after commit changes that everything went well', async () => {
      const success = jest.fn();
      const prerequisiteId = uuidv4();

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({ commitChanges: async () => aMikadoGraphView({ done: false }) }),
            useNotification: aNotifier({ success }),
          },
          { 'prerequisite.notification.add-prerequisite.success': 'Changes committed' },
        ),
      });

      await act(() => result.current.commitChanges(
        prerequisiteId,
      ));

      expect(success).toHaveBeenCalledWith('Changes committed');
    });

    test('The developer is notified after commit changes that the mikado graph is done', async () => {
      const success = jest.fn();

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({ commitChanges: async () => aMikadoGraphView({ done: true }) }),
            useNotification: aNotifier({ success }),
          },
          { 'mikado-graph.done': 'Mikado Graph done' },
        ),
      });

      await act(() => result.current.commitChanges(
        uuidv4(),
      ));

      expect(success).toHaveBeenCalledWith('Mikado Graph done');
    });

    test('The mikado graph graph is refresh after committing changes', async () => {
      const refresh = jest.fn();
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({ commitChanges: async () => aMikadoGraphView() }),
            useRouter: aRouter({ refresh }),
          },
        ),
      });

      await act(() => result.current.commitChanges(
        uuidv4(),
      ));

      expect(refresh).toHaveBeenCalled();
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({
              commitChanges: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          { 'notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.commitChanges(
        uuidv4(),
      ));

      expect(error).toHaveBeenCalledWith('Something went wrong');
    });
  });
});