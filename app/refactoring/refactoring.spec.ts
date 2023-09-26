import { mapResponseToRefactoringGraph } from '@/refactoring/refactoring';
import { aRefactoringGraph } from '@/test/test-utils';
import { jest } from '@jest/globals';

describe('mapResponseToRefactoringGraph', () => {
  it('turns refactoring info into the first node of the refactoring graph', async () => {
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

  it('turns prerequisite into refactoring graph node', async () => {
    const label = 'label';
    const prerequisiteId = 'prerequisiteId';

    const refactoringGraph = mapResponseToRefactoringGraph(
      aRefactoringGraph({
        prerequisites: [{ prerequisiteId, label }],
      }),
      { addPrerequisiteToRefactoring: jest.fn() },
    )[1];

    expect(refactoringGraph).toEqual(
      {
        id: prerequisiteId,
        type: 'prerequisite',
        data: { label },
        position: { x: 0, y: 0 },
      },
    );
  });
});
