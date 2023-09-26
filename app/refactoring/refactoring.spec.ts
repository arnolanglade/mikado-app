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

  it('turns prerequisite into refactoring graph node', async () => {
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

  it('shifts down each prerequisite node by 100 pixels', async () => {
    const refactoringGraph = aRefactoringGraph({
      prerequisites: [
        { prerequisiteId: '1' },
        { prerequisiteId: '2' },
      ],
    });

    const nodes = mapRefactoringGraphToNodes(refactoringGraph);

    expect(nodes[1].position).toEqual({ x: 0, y: 100 });
    expect(nodes[2].position).toEqual({ x: 0, y: 200 });
  });
});
