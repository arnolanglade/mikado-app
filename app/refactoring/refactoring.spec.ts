import { mapResponseToRefactoringGraph } from '@/refactoring/refactoring';
import { aRefactoringGraph } from '@/test/test-utils';
import { jest } from '@jest/globals';

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
        onStartExperimentation: jest.fn(),
        onAddPrerequisiteToPrerequisite: jest.fn(),
        onCommitChanges: jest.fn(),
      },
    );

    expect(refactoringGraph).toEqual([
      {
        id: refactoringId,
        type: 'refactoring',
        data: { label: goal, done, addPrerequisiteToRefactoring },
        position: { x: 0, y: 0 },
      },
    ]);
  });

  test('the next nodes contains the prerequisite information', async () => {
    const label = 'label';
    const prerequisiteId = 'prerequisiteId';
    const onStartExperimentation = jest.fn();
    const onAddPrerequisiteToPrerequisite = jest.fn();
    const onCommitChanges = jest.fn();

    const refactoringGraph = mapResponseToRefactoringGraph(
      aRefactoringGraph({
        prerequisites: [{ prerequisiteId, label }],
      }),
      { addPrerequisiteToRefactoring: jest.fn() },
      {
        onStartExperimentation,
        onAddPrerequisiteToPrerequisite,
        onCommitChanges,
      },
    )[1];

    expect(refactoringGraph).toEqual(
      {
        id: prerequisiteId,
        type: 'prerequisite',
        data: {
          label, onStartExperimentation, onAddPrerequisiteToPrerequisite, onCommitChanges,
        },
        position: { x: 0, y: 0 },
      },
    );
  });
});
