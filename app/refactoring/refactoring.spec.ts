import { mapRefactoringGraphToNodes } from '@/refactoring/refactoring';

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
});
