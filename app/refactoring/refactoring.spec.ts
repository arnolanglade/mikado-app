import { mapResponseToRefactoringGraph } from '@/refactoring/refactoring';
import { aRefactoringGraph } from '@/test/test-utils';
import { jest } from '@jest/globals';
import { Status } from '@/api/refactoring/refactoring';
import { Mock } from 'jest-mock';

describe('mapResponseToRefactoringGraph', () => {
  test('the first node of the refactoring graph contains the refactoring information', async () => {
    const goal = 'goal';
    const refactoringId = 'refactoringId';
    const done = false;
    const addPrerequisiteToRefactoring = jest.fn();

    const refactoringGraph = mapResponseToRefactoringGraph(
      aRefactoringGraph({
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

    expect(refactoringGraph).toEqual([
      {
        id: refactoringId,
        type: 'refactoring',
        data: { goal, done, addPrerequisiteToRefactoring },
        position: { x: 0, y: 0 },
      },
    ]);
  });

  test('the next nodes contains the prerequisite information', async () => {
    const label = 'label';
    const prerequisiteId = 'prerequisiteId';
    const startExperimentation: Mock<() => () => void> = jest.fn();
    const addPrerequisiteToPrerequisite: Mock<() => (label: string) => void> = jest.fn();
    const commitChanges: Mock<() => () => void> = jest.fn();
    const status = Status.TODO;

    const refactoringGraph = mapResponseToRefactoringGraph(
      aRefactoringGraph({
        prerequisites: [{ prerequisiteId, label, status }],
      }),
      { addPrerequisiteToRefactoring: jest.fn() },
      {
        startExperimentation,
        addPrerequisiteToPrerequisite,
        commitChanges,
      },
    )[1];

    expect(refactoringGraph).toEqual(
      {
        id: prerequisiteId,
        type: 'prerequisite',
        data: {
          label, status, startExperimentation, addPrerequisiteToPrerequisite, commitChanges,
        },
        position: { x: 0, y: 0 },
      },
    );
  });
});
