'use client';

import { act, renderHook } from '@testing-library/react';
import useMikadoGraph, { PrerequisiteData, useStartTask } from '@/mikado-graph/mikado-graph.usecase';
import { jest } from '@jest/globals';
import {
  aMikadoGraphApi, aMikadoGraphView, aNotifier, aRouter, createWrapper,
} from '@/test/test-utils';
import { v4 as uuidv4 } from 'uuid';
import { StatusView } from '@/api/mikado-graph/mikado-graph';

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
  describe('compute mikado graph nodes', () => {
    test('it computes the goal information to create a node with that display it', async () => {
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

      expect(result.current.mikadoGraph).toEqual({
        nodes: [
          {
            id: mikadoGraphId,
            type: 'goal',
            data: { goal, done, onAddPrerequisiteButtonClick: expect.any(Function) },
            position: { x: 0, y: 0 },
          },
        ],
        edges: [],
      });
    });

    test('it computes a prerequisite to create a node that display it', async () => {
      const MikadoGraphId = uuidv4();
      const prerequisiteId = uuidv4();
      const label = 'label';
      const status = StatusView.TODO;
      const canBeCommitted = false;

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({
        mikadoGraphId: MikadoGraphId,
        prerequisites: [{
          prerequisiteId, label, status, canBeCommitted,
        }],
      })), {
        wrapper: createWrapper({}, {}),
      });

      expect(result.current.mikadoGraph.nodes[1]).toEqual({
        id: prerequisiteId,
        type: 'prerequisite',
        parentId: MikadoGraphId,
        data: {
          label,
          status,
          canBeCommitted,
          onStartExperimentationButtonClick: expect.any(Function),
          onCommitChangesButtonClick: expect.any(Function),
          onAddPrerequisiteButtonClick: expect.any(Function),
        },
        position: { x: 0, y: 400 },
      });
    });

    test('it computes a new prerequisite to create a node that display the add prerequisite form', async () => {
      const mikadoGraphId = uuidv4();
      const prerequisiteId = 'new-prerequisite';
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({
        mikadoGraphId,
        prerequisites: [{
          prerequisiteId,
        }],
      })), {
        wrapper: createWrapper({}, {}),
      });

      expect(result.current.mikadoGraph.nodes[1]).toEqual({
        id: prerequisiteId,
        type: 'newPrerequisite',
        parentId: mikadoGraphId,
        data: {
          onPrerequisiteSubmit: expect.any(Function),
        },
        position: { x: 0, y: 400 },
      });
    });

    test('it computes edges between mikado graph goal and its prerequisite children', async () => {
      const MikadoGraphId = uuidv4();
      const prerequisiteId = uuidv4();
      const otherPrerequisiteId = uuidv4();

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({
        mikadoGraphId: MikadoGraphId,
        prerequisites: [
          { prerequisiteId },
          { prerequisiteId: otherPrerequisiteId },
        ],
      })), {
        wrapper: createWrapper({}, {}),
      });

      expect(result.current.mikadoGraph.edges).toEqual([
        { id: `${MikadoGraphId}-${prerequisiteId}`, source: MikadoGraphId, target: prerequisiteId },
        { id: `${MikadoGraphId}-${otherPrerequisiteId}`, source: MikadoGraphId, target: otherPrerequisiteId },
      ]);
    });

    test('it computes edges between prerequisites and its prerequisites children', async () => {
      const MikadoGraphId = uuidv4();
      const firstLevelPrerequisiteId = uuidv4();
      const secondLevelPrerequisiteId = uuidv4();

      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({
        mikadoGraphId: MikadoGraphId,
        prerequisites: [
          { prerequisiteId: firstLevelPrerequisiteId },
          { prerequisiteId: secondLevelPrerequisiteId, parentId: firstLevelPrerequisiteId },
        ],
      })), {
        wrapper: createWrapper({}, {}),
      });

      expect(result.current.mikadoGraph.edges).toEqual([
        { id: `${MikadoGraphId}-${firstLevelPrerequisiteId}`, source: MikadoGraphId, target: firstLevelPrerequisiteId },
        { id: `${firstLevelPrerequisiteId}-${secondLevelPrerequisiteId}`, source: firstLevelPrerequisiteId, target: secondLevelPrerequisiteId },
      ]);
    });
  });

  describe('open prerequisite form', () => {
    test('The developer opens the prerequisite form to add new a new prerequisite', async () => {
      const mikadoGraphId = uuidv4();
      const mikadoGraphView = aMikadoGraphView({ mikadoGraphId, prerequisites: [] });
      const { result } = renderHook(() => useMikadoGraph(mikadoGraphView), {
        wrapper: createWrapper(),
      });

      await act(() => result.current.openPrerequisiteForm(mikadoGraphId));

      expect(result.current.mikadoGraph.nodes[1]).toMatchObject({
        id: 'new-prerequisite',
        type: 'newPrerequisite',
        parentId: mikadoGraphId,
      }); // 0: Goal + 1: prerequisite
      expect(result.current.mikadoGraph.edges[0]).toEqual({
        id: `${mikadoGraphId}-new-prerequisite`,
        source: mikadoGraphId,
        target: 'new-prerequisite',
      });
    });

    test('The prerequisite form can only be opened once', async () => {
      const parentId = uuidv4();
      const mikadoGraphView = aMikadoGraphView({
        mikadoGraphId: parentId,
        prerequisites: [
          { prerequisiteId: 'new-prerequisite', parentId: uuidv4() },
        ],
      });
      const { result } = renderHook(() => useMikadoGraph(mikadoGraphView), {
        wrapper: createWrapper(),
      });

      await act(() => result.current.openPrerequisiteForm(parentId));

      expect(result.current.mikadoGraph.nodes[1]).toMatchObject({
        id: 'new-prerequisite',
        parentId,
      }); // 0: Goal + 1: prerequisite
    });
  });

  describe('add prerequisite', () => {
    test('The developer is notified after adding a prerequisite that everything went well', async () => {
      const success = jest.fn();
      const prerequisiteLabel = 'Do that';
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView({ prerequisites: [] })), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({
              addPrerequisite: () => Promise.resolve(
                aMikadoGraphView({ prerequisites: [{ label: prerequisiteLabel }] }),
              ),
            }),
            useNotification: aNotifier({ success }),
          },
          { 'prerequisite.notification.add-prerequisite.success': 'The prerequisite has been added' },
        ),
      });

      await act(() => result.current.addPrerequisite(
        prerequisiteLabel,
      ));

      expect((result.current.mikadoGraph.nodes[1].data as PrerequisiteData).label).toEqual(prerequisiteLabel); // 0: Goal + 1: prerequisite
      expect(success).toHaveBeenCalledWith('The prerequisite has been added');
    });

    test('The developer is notified that something went wrong', async () => {
      const error = jest.fn();
      const { result } = renderHook(() => useMikadoGraph(aMikadoGraphView()), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({
              addPrerequisite: async () => {
                throw Error();
              },
            }),
            useNotification: aNotifier({ error }),
          },
          { 'notification.error': 'Something went wrong' },
        ),
      });

      await act(() => result.current.addPrerequisite(
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
      const { result } = renderHook(() => useMikadoGraph(
        aMikadoGraphView({ mikadoGraphId, prerequisites: [{ prerequisiteId, status: StatusView.TODO }] }),
      ), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({
              startExperimentation: () => Promise.resolve(
                aMikadoGraphView({ prerequisites: [{ prerequisiteId, status: StatusView.EXPERIMENTING }] }),
              ),
            }),
            useNotification: aNotifier({ success }),
          },
          { 'prerequisite.notification.start-experimentation.success': 'The experimentation has started' },
        ),
      });

      await act(() => result.current.startExperimentation(
        prerequisiteId,
      ));

      expect((result.current.mikadoGraph.nodes[1].data as PrerequisiteData).status).toBe(StatusView.EXPERIMENTING); // 0:Goal + 1:prerequisite
      expect(success).toHaveBeenCalledWith('The experimentation has started');
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

      const { result } = renderHook(() => useMikadoGraph(
        aMikadoGraphView({ prerequisites: [{ prerequisiteId }] }),
      ), {
        wrapper: createWrapper(
          {
            mikadoGraphApi: aMikadoGraphApi({
              commitChanges: async () => aMikadoGraphView(
                { done: false, prerequisites: [{ prerequisiteId, status: StatusView.DONE }] },
              ),
            }),
            useNotification: aNotifier({ success }),
          },
          { 'prerequisite.notification.success.commit-changes': 'Changes committed' },
        ),
      });

      await act(() => result.current.commitChanges(
        prerequisiteId,
      ));

      expect((result.current.mikadoGraph.nodes[1].data as PrerequisiteData).status).toBe(StatusView.DONE); // 0:Goal + 1:prerequisite
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
