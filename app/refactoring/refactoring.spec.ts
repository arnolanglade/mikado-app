import { mapRefactoringGraphToNodes } from '@/refactoring/refactoring';
import { aRefactoringGraph } from '@/test/test-utils';

describe('mapReafactoringGraphToNodes', () => {
  it('turns refactoring info into the first node of the refactoring graph', async () => {
    const goal = 'goal';
    const refactoringId = 'refactoringId';
    const done = false;
    const refactoringGraph = {
      refactoringId,
      goal,
      done,
      prerequisites: [],
    };

    expect(mapRefactoringGraphToNodes(refactoringGraph)).toEqual([
      {
        id: refactoringId,
        type: 'refactoring',
        data: { label: goal, done },
        position: { x: 0, y: 0 },
      },
    ]);
  });

  it('turns prerequisite info into refactoring graph nodes', async () => {
    const label = 'label';
    const prerequisiteId = 'prerequisiteId';

    const refactoringGraph = aRefactoringGraph({
      prerequisites: [{ prerequisiteId, label }],
    });

    expect(mapRefactoringGraphToNodes(refactoringGraph)[1]).toEqual(
      {
        id: prerequisiteId,
        type: 'prerequisite',
        data: { label },
        position: { x: 0, y: 0 },
      },
    );
  });
});
