import {
  handleAddPrerequisiteToRefactoring, handleGetRefactoringById, handleStartExperimentation,
  handleStartRefactoring,
  InMemoryRefactorings, Refactoring, Status, UnknownRefactoring,
} from '@/api/refactoring/refactoring';
import { aRefactoring } from '@/test/test-utils';

describe('Refactoring use cases', () => {
  test('The developer starts a refactoring', async () => {
    const refactorings = new InMemoryRefactorings();
    await handleStartRefactoring(refactorings)({
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

  test('The developer needs to provide a goal to start a refactoring', () => {
    const refactorings = new InMemoryRefactorings();

    const startRefactoring = handleStartRefactoring(refactorings);

    expect(startRefactoring({
      refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: '',
    })).rejects.toEqual(new Error('The goal cannot be empty'));
  });

  test('The developer adds a prerequisite to a refactoring (its status is todo)', async () => {
    const refactorings = new InMemoryRefactorings([aRefactoring({
      id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      prerequisites: [],
    })]);

    await handleAddPrerequisiteToRefactoring(refactorings)({
      prerequisiteId: '5608a2791-1625-4a63-916f-ab59e1f6c4ed',
      refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      label: 'Change that',
    });

    expect(await refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
      .toEqual(aRefactoring({
        id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
        prerequisites: [{ prerequisiteId: '5608a2791-1625-4a63-916f-ab59e1f6c4ed', label: 'Change that', status: Status.TODO }],
      }));
  });

  test('The developer needs to provide a label to add a prerequisite', () => {
    const refactorings = new InMemoryRefactorings([aRefactoring({
      id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      prerequisites: [],
    })]);

    const addPrerequisiteToRefactoring = handleAddPrerequisiteToRefactoring(refactorings);

    expect(addPrerequisiteToRefactoring({
      prerequisiteId: '5608a2791-1625-4a63-916f-ab59e1f6c4ed',
      refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      label: '',
    })).rejects.toEqual(new Error('The label cannot be empty'));
  });

  test('The developer gets the refactoring information thanks to the id', async () => {
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

  test('The developer starts an experimentation on a todo prerequisite', async () => {
    const refactoringId = '51bb1ce3-d1cf-4d32-9d10-8eea626f4784';
    const prerequisiteId = '5608a2791-1625-4a63-916f-ab59e1f6c4ed';
    const refactorings = new InMemoryRefactorings([aRefactoring({
      id: refactoringId,
      prerequisites: [{ prerequisiteId, label: 'Change that', status: Status.TODO }],
    })]);

    await handleStartExperimentation(refactorings)({
      refactoringId,
      prerequisiteId,
    });

    expect(await refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
      .toEqual(aRefactoring({
        id: refactoringId,
        prerequisites: [{ prerequisiteId, label: 'Change that', status: Status.EXPERIMENTING }],
      }));
  });
});

describe('Refactoring', () => {
  it('builds a refactoring object without prerequisite when we start a refactoring', () => {
    const refactoring = Refactoring.start('51bb1ce3-d1cf-4d32-9d10-8eea626f4784', 'Rework that part');

    expect(refactoring).toEqual(aRefactoring({
      id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: 'Rework that part',
      prerequisites: [],
    }));
  });

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

  describe('equals', () => {
    it('says yes if the given refactoring object equals this one', () => {
      const refactoring = aRefactoring({ id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' });

      expect(refactoring.equals(aRefactoring({ id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' })))
        .toEqual(true);
    });

    it('says no if the given refactoring object does not equals this one', () => {
      const refactoring = aRefactoring({ id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' });

      expect(refactoring.equals(aRefactoring({ id: 'c2e2ddf8-534b-4080-b47c-0f4536b54cae' })))
        .toEqual(false);
    });
  });

  it('adds a prerequisite to a refactoring (its status is todo)', () => {
    const refactoring = aRefactoring({
      prerequisites: [],
    });

    refactoring.addPrerequisite('608a2791-1625-4a63-916f-ab59e1f6c4ed', 'Change that');

    expect(refactoring).toEqual(aRefactoring({
      prerequisites: [{
        prerequisiteId: '608a2791-1625-4a63-916f-ab59e1f6c4ed',
        label: 'Change that',
        status: Status.TODO,
      }],
    }));
  });

  it('turns a refactoring into a format used by the UI to render it', () => {
    const refactoring = aRefactoring({
      id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: 'My goal',
      prerequisites: [{
        prerequisiteId: '0472c1c9-7a75-4f7a-9b79-9cd18e60005a',
        label: 'Do this',
        status: Status.TODO,
      }],
    });

    expect(refactoring.render())
      .toEqual({
        id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
        goal: 'My goal',
        prerequisites: [{
          prerequisiteId: '0472c1c9-7a75-4f7a-9b79-9cd18e60005a',
          label: 'Do this',
          status: Status.TODO,
        }],
      });
  });
});

describe('Refactorings', () => {
  it('persists a refactoring', async () => {
    const refactorings = new InMemoryRefactorings();

    await refactorings.add(aRefactoring({ id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' }));

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
