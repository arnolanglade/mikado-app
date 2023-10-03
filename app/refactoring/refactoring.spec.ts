import { mapResponseToRefactoringGraph } from '@/refactoring/refactoring';
import { aMikadoGraphView } from '@/test/test-utils';
import { jest } from '@jest/globals';
import { Status } from '@/api/mikado-graph/mikako-graph';
import { Mock } from 'jest-mock';
import { v4 as uuidv4 } from 'uuid';

describe('mapResponseToRefactoringGraph', () => {
  test('the first node of the refactoring graph contains the refactoring information', async () => {
    const goal = 'goal';
    const refactoringId = 'refactoringId';
    const done = false;
    const addPrerequisiteToRefactoring = jest.fn();

    const refactoringGraph = mapResponseToRefactoringGraph(
      aMikadoGraphView({
        refactoringId,
        goal,
        done,
        prerequisites: [],
      }),
      { addPrerequisiteToRefactoring },
      {
        startExperimentation: jest.fn() as Mock<() => () => void>,
        addPrerequisiteToPrerequisite: jest.fn() as Mock<() => (label: string) => void>,
        commitChanges: jest.fn() as Mock<() => () => void>,
      },
    );

    expect(refactoringGraph).toEqual({
      nodes: [
        {
          id: refactoringId,
          type: 'refactoring',
          data: { goal, done, addPrerequisiteToRefactoring },
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
    const startExperimentation: Mock<() => () => void> = jest.fn();
    const addPrerequisiteToPrerequisite: Mock<() => (label: string) => void> = jest.fn();
    const commitChanges: Mock<() => () => void> = jest.fn();
    const status = Status.TODO;

    const refactoringGraph = mapResponseToRefactoringGraph(
      aMikadoGraphView({
        refactoringId,
        prerequisites: [{ prerequisiteId, label, status }],
      }),
      { addPrerequisiteToRefactoring: jest.fn() },
      {
        startExperimentation,
        addPrerequisiteToPrerequisite,
        commitChanges,
      },
    );

    expect(refactoringGraph.nodes[1]).toEqual(
      {
        id: prerequisiteId,
        type: 'prerequisite',
        parentId: refactoringId,
        data: {
          label, status, startExperimentation, addPrerequisiteToPrerequisite, commitChanges,
        },
        position: { x: 0, y: 100 },
      },
    );
  });

  test('it computes edges between refactoring and its prerequisite children', async () => {
    const refactoringId = uuidv4();
    const prerequisiteId = uuidv4();
    const otherPrerequisiteId = uuidv4();

    const refactoringGraph = mapResponseToRefactoringGraph(
      aMikadoGraphView({
        refactoringId,
        prerequisites: [
          { prerequisiteId },
          { prerequisiteId: otherPrerequisiteId },
        ],
      }),
      { addPrerequisiteToRefactoring: jest.fn() },
      {
        startExperimentation: jest.fn() as Mock<() => () => void>,
        addPrerequisiteToPrerequisite: jest.fn() as Mock<() => (label: string) => void>,
        commitChanges: jest.fn() as Mock<() => () => void>,
      },
    );

    expect(refactoringGraph.edges).toEqual([
      { id: `${refactoringId}-${prerequisiteId}`, source: refactoringId, target: prerequisiteId },
      { id: `${refactoringId}-${otherPrerequisiteId}`, source: refactoringId, target: otherPrerequisiteId },
    ]);
  });

  test('it computes edges between prerequisites and its prerequisites children', async () => {
    const refactoringId = uuidv4();
    const firstLevelPrerequisiteId = uuidv4();
    const secondLevelPrerequisiteId = uuidv4();

    const refactoringGraph = mapResponseToRefactoringGraph(
      aMikadoGraphView({
        refactoringId,
        prerequisites: [
          { prerequisiteId: firstLevelPrerequisiteId },
          { prerequisiteId: secondLevelPrerequisiteId, parentId: firstLevelPrerequisiteId },
        ],
      }),
      { addPrerequisiteToRefactoring: jest.fn() },
      {
        startExperimentation: jest.fn() as Mock<() => () => void>,
        addPrerequisiteToPrerequisite: jest.fn() as Mock<() => (label: string) => void>,
        commitChanges: jest.fn() as Mock<() => () => void>,
      },
    ).edges;

    expect(refactoringGraph).toEqual([
      { id: `${refactoringId}-${firstLevelPrerequisiteId}`, source: refactoringId, target: firstLevelPrerequisiteId },
      { id: `${firstLevelPrerequisiteId}-${secondLevelPrerequisiteId}`, source: firstLevelPrerequisiteId, target: secondLevelPrerequisiteId },
    ]);
  });
});
