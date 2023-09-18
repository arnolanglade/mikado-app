import {
  handleAddPrerequisiteToRefactoring,
  handleGetRefactoringById,
  handleStartExperimentation,
  handleStartRefactoring, InMemoryClock,
  InMemoryRefactorings,
  Refactoring,
  Status,
  UnknownRefactoring,
} from '@/api/refactoring/refactoring';
import { aRefactoring } from '@/test/test-utils';

describe('Refactoring use cases', () => {
  test('The developer starts a refactoring', async () => {
    const refactoringId = '51bb1ce3-d1cf-4d32-9d10-8eea626f4784';
    const refactorings = new InMemoryRefactorings();
    await handleStartRefactoring(refactorings)({
      refactoringId,
      goal: 'Rework that part',
    });

    expect(await refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
      .toEqual(aRefactoring({
        refactoringId,
        goal: 'Rework that part',
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

  test('The developer adds a todo prerequisite to a refactoring', async () => {
    const refactoringId = '51bb1ce3-d1cf-4d32-9d10-8eea626f4784';
    const prerequisiteId = '5608a2791-1625-4a63-916f-ab59e1f6c4ed';
    const refactorings = new InMemoryRefactorings([aRefactoring({
      refactoringId,
      prerequisites: [],
    })]);

    await handleAddPrerequisiteToRefactoring(refactorings)({
      prerequisiteId,
      refactoringId,
      label: 'Change that',
    });

    expect(await refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
      .toEqual(aRefactoring({
        refactoringId,
        prerequisites: [{ prerequisiteId, label: 'Change that', status: Status.TODO }],
      }));
  });

  test('The developer needs to provide a label to add a prerequisite', () => {
    const refactoringId = '51bb1ce3-d1cf-4d32-9d10-8eea626f4784';
    const refactorings = new InMemoryRefactorings([aRefactoring({
      refactoringId,
    })]);

    const addPrerequisiteToRefactoring = handleAddPrerequisiteToRefactoring(refactorings);

    expect(addPrerequisiteToRefactoring({
      prerequisiteId: '5608a2791-1625-4a63-916f-ab59e1f6c4ed',
      refactoringId,
      label: '',
    })).rejects.toEqual(new Error('The label cannot be empty'));
  });

  test('The developer gets the refactoring information thanks to the id', async () => {
    const refactorings = new InMemoryRefactorings([aRefactoring({
      refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: 'Rework that part',
      prerequisites: [{ prerequisiteId: '5608a2791-1625-4a63-916f-ab59e1f6c4ed', label: 'Change that', status: Status.TODO }],
    })]);

    const getRefactoringById = handleGetRefactoringById(refactorings);

    expect(await getRefactoringById('51bb1ce3-d1cf-4d32-9d10-8eea626f4784')).toEqual({
      refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: 'Rework that part',
      prerequisites: [{ prerequisiteId: '5608a2791-1625-4a63-916f-ab59e1f6c4ed', label: 'Change that', status: Status.TODO }],
    });
  });

  test('The developer starts an experimentation on a todo prerequisite', async () => {
    const refactoringId = '51bb1ce3-d1cf-4d32-9d10-8eea626f4784';
    const prerequisiteId = '5608a2791-1625-4a63-916f-ab59e1f6c4ed';
    const refactorings = new InMemoryRefactorings([aRefactoring({
      refactoringId,
      prerequisites: [{ prerequisiteId, status: Status.TODO, startedAt: undefined }],
    })]);
    const clock = new InMemoryClock('2023-07-25T10:24:00');

    await handleStartExperimentation(refactorings, clock)({
      refactoringId,
      prerequisiteId,
    });

    expect(await refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
      .toEqual(aRefactoring({
        refactoringId,
        prerequisites: [{ prerequisiteId, status: Status.EXPERIMENTING, startedAt: '2023-07-25T10:24:00' }],
      }));
  });

  test.each([
    Status.EXPERIMENTING,
    Status.DONE,
  ])('The developer gets an error when an experimentation is started on a %s prerequisite', async (status) => {
    const refactoringId = '51bb1ce3-d1cf-4d32-9d10-8eea626f4784';
    const prerequisiteId = '5608a2791-1625-4a63-916f-ab59e1f6c4ed';
    const refactorings = new InMemoryRefactorings([aRefactoring({
      refactoringId,
      prerequisites: [{ prerequisiteId, status }],
    })]);
    const clock = new InMemoryClock('2023-07-25T10:24:00');

    const startExperimentation = handleStartExperimentation(refactorings, clock);

    expect(startExperimentation({
      refactoringId,
      prerequisiteId,
    })).rejects.toEqual(new Error('You can only start an experimentation an a todo prerequisite'));
  });
});

describe('Refactoring', () => {
  it('builds a refactoring object without prerequisite when we start a refactoring', () => {
    const refactoringId = '51bb1ce3-d1cf-4d32-9d10-8eea626f4784';
    const refactoring = Refactoring.start(refactoringId, 'Rework that part');

    expect(refactoring).toEqual(aRefactoring({
      refactoringId,
      goal: 'Rework that part',
      prerequisites: [],
    }));
  });

  describe('identifyBy', () => {
    it('says yes if the given id match the refactoring id', () => {
      const refactoringId = '51bb1ce3-d1cf-4d32-9d10-8eea626f4784';
      const refactoring = aRefactoring({ refactoringId });

      expect(refactoring.identifyBy(refactoringId))
        .toEqual(true);
    });

    it('says no if the given id does not match the refactoring id', () => {
      const refactoring = aRefactoring({ refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' });

      expect(refactoring.identifyBy('c2e2ddf8-534b-4080-b47c-0f4536b54cae'))
        .toEqual(false);
    });
  });

  describe('equals', () => {
    it('says yes if the given refactoring object equals this one', () => {
      const refactoringId = '51bb1ce3-d1cf-4d32-9d10-8eea626f4784';
      const refactoring = aRefactoring({ refactoringId });

      expect(refactoring.equals(aRefactoring({ refactoringId })))
        .toEqual(true);
    });

    it('says no if the given refactoring object does not equals this one', () => {
      const refactoring = aRefactoring({ refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' });

      expect(refactoring.equals(aRefactoring({ refactoringId: 'c2e2ddf8-534b-4080-b47c-0f4536b54cae' })))
        .toEqual(false);
    });
  });

  it('adds a prerequisite to a refactoring (its status is todo)', () => {
    const refactoring = aRefactoring({
      prerequisites: [],
    });

    refactoring.addPrerequisiteToRefactoring('608a2791-1625-4a63-916f-ab59e1f6c4ed', 'Change that');

    expect(refactoring).toEqual(aRefactoring({
      prerequisites: [{
        prerequisiteId: '608a2791-1625-4a63-916f-ab59e1f6c4ed',
        label: 'Change that',
        status: Status.TODO,
      }],
    }));
  });

  it('start an experimentation on a todo prerequisite', () => {
    const prerequisiteId = '5608a2791-1625-4a63-916f-ab59e1f6c4ed';
    const refactoring = aRefactoring({
      prerequisites: [{
        prerequisiteId, label: 'Change that', status: Status.TODO, startedAt: undefined,
      }],
    });

    refactoring.startExperimentation(prerequisiteId, new Date('2023-07-25T10:24:00'));

    expect(refactoring).toEqual(aRefactoring({
      prerequisites: [{
        prerequisiteId,
        label: 'Change that',
        status: Status.EXPERIMENTING,
        startedAt: '2023-07-25T10:24:00',
      }],
    }));
  });

  it('turns a refactoring into a format used by the UI to render it', () => {
    const refactoring = aRefactoring({
      refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
      goal: 'My goal',
      prerequisites: [{
        prerequisiteId: '0472c1c9-7a75-4f7a-9b79-9cd18e60005a',
        label: 'Do this',
        status: Status.TODO,
        startedAt: '2023-07-25T10:24:00',
      }],
    });

    expect(refactoring.render())
      .toEqual({
        refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
        goal: 'My goal',
        prerequisites: [{
          prerequisiteId: '0472c1c9-7a75-4f7a-9b79-9cd18e60005a',
          label: 'Do this',
          status: Status.TODO,
          startedAt: '2023-07-25T08:24:00.000Z',
        }],
      });
  });
});

describe('Refactorings', () => {
  it('persists a refactoring', async () => {
    const refactoringId = '51bb1ce3-d1cf-4d32-9d10-8eea626f4784';
    const refactorings = new InMemoryRefactorings();

    await refactorings.add(aRefactoring({ refactoringId }));

    expect(await refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
      .toEqual(aRefactoring({ refactoringId }));
  });

  it('raises an error if the given id does not match an existing refactoring', async () => {
    const refactorings = new InMemoryRefactorings([aRefactoring({ refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' })]);

    await expect(refactorings.get('c2e2ddf8-534b-4080-b47c-0f4536b54cae')).rejects.toThrow(
      new UnknownRefactoring('The refactoring with the id c2e2ddf8-534b-4080-b47c-0f4536b54cae does not exist'),
    );
  });
});
