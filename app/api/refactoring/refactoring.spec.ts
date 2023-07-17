import {
  Goal, InMemoryRefactorings, Prerequisite, UnknownRefactoring, Refactoring,
  handleStartRefactoring, handleGetRefactoringById,
} from '@/api/refactoring/refactoring';

const aRefactoring = (state: Partial<{ id: string, goal: string, prerequisites: Prerequisite[] }>) => {
  const newState = {
    id: '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
    goal: 'Refactor this class',
    prerequisites: [],
    ...state,
  };
  return new Refactoring(newState.id, new Goal(newState.goal), newState.prerequisites);
};

describe('Refactoring use cases', () => {
  test('The developer starts a refactoring', async () => {
    const refactorings = new InMemoryRefactorings();
    handleStartRefactoring(refactorings)({
      refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: 'Rework that part',
    });

    expect(await refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
      .toEqual(aRefactoring({
        id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
        goal: 'Rework that part',
        prerequisites: [],
      }));
  });

  test('The developer need to provide a goal to start a refactoring', () => {
    const refactorings = new InMemoryRefactorings();

    expect(() => {
      handleStartRefactoring(refactorings)({
        refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
        goal: '',
      });
    }).toThrow(new Error('The label goal cannot be empty'));
  });

  test('The developer get the refactoring information thanks to the id', async () => {
    const refactorings = new InMemoryRefactorings([aRefactoring({
      id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: 'Rework that part',
      prerequisites: [],
    })]);

    const getRefactoringById = handleGetRefactoringById(refactorings);

    expect(await getRefactoringById('51bb1ce3-d1cf-4d32-9d10-8eea626f4784')).toEqual({
      id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: 'Rework that part',
      prerequisites: [],
    });
  });
});

describe('Refactoring', () => {
  describe('identifyBy', () => {
    it('says yes if the given id match the refactoring id', () => {
      const refactoring = aRefactoring({ id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' });

      expect(refactoring.identifyBy('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
        .toEqual(true);
    });

    it('says no if the given id does not match the refactoring id', () => {
      const refactoring = aRefactoring({ id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' });

      expect(refactoring.identifyBy('c2e2ddf8-534b-4080-b47c-0f4536b54cae'))
        .toEqual(false);
    });
  });

  it('builds a refactoring object without prerequisite when we start a refactoring', () => {
    const refactoring = Refactoring.start('51bb1ce3-d1cf-4d32-9d10-8eea626f4784', 'Rework that part');

    expect(refactoring).toEqual(aRefactoring({
      id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: 'Rework that part',
      prerequisites: [],
    }));
  });

  it('turns a refactoring into a format used by the UI to render it', () => {
    const refactoring = aRefactoring({
      id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: 'My goal',
      prerequisites: [],
    });

    expect(refactoring.render())
      .toEqual({
        id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
        goal: 'My goal',
        prerequisites: [],
      });
  });
});

describe('Refactorings', () => {
  it('persists a refactoring', async () => {
    const refactorings = new InMemoryRefactorings();

    refactorings.add(aRefactoring({ id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' }));

    expect(await refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
      .toEqual(aRefactoring({ id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' }));
  });

  it('raises an error if the given id does not match an existing refactoring', async () => {
    const refactorings = new InMemoryRefactorings([aRefactoring({ id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' })]);

    await expect(refactorings.get('c2e2ddf8-534b-4080-b47c-0f4536b54cae')).rejects.toThrow(
      new UnknownRefactoring('The refactoring with the id c2e2ddf8-534b-4080-b47c-0f4536b54cae does not exist'),
    );
  });
});
