import {
  handleAddPrerequisiteToPrerequisite,
  handleAddPrerequisiteToMikadoGraph,
  handleCommitChanges,
  handleGetMikadoGraphById,
  handleStartExperimentation,
  handleStartTask,
  InMemoryClock,
  InMemoryMikadoGraphs,
  MikakoGraph,
  Status,
  UnknownMikadoGraph,
} from '@/api/mikado-graph/mikako-graph';
import { aRefactoring } from '@/test/test-utils';
import { v4 as uuidv4 } from 'uuid';

describe('Refactoring use cases', () => {
  test('The developer starts a refactoring', async () => {
    const mikadoGraphId = uuidv4();
    const refactorings = new InMemoryMikadoGraphs();
    await handleStartTask(refactorings)({
      mikadoGraphId,
      goal: 'Rework that part',
    });

    expect(await refactorings.get(mikadoGraphId))
      .toEqual(aRefactoring({
        mikadoGraphId,
        goal: 'Rework that part',
      }));
  });

  test('The developer adds a prerequisite to a refactoring', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const label = 'Change that';
    const refactorings = new InMemoryMikadoGraphs([aRefactoring({
      mikadoGraphId,
      prerequisites: [],
    })]);

    await handleAddPrerequisiteToMikadoGraph(refactorings)({
      prerequisiteId,
      mikadoGraphId,
      label,
    });

    expect(await refactorings.get(mikadoGraphId))
      .toEqual(aRefactoring({
        mikadoGraphId,
        prerequisites: [{ prerequisiteId, label, status: Status.TODO }],
      }));
  });

  test('The developer starts an experimentation on a todo prerequisite', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const refactorings = new InMemoryMikadoGraphs([aRefactoring({
      mikadoGraphId,
      prerequisites: [{ prerequisiteId, status: Status.TODO, startedAt: undefined }],
    })]);
    const clock = new InMemoryClock('2023-07-25T10:24:00');

    await handleStartExperimentation(refactorings, clock)({
      mikadoGraphId,
      prerequisiteId,
    });

    expect(await refactorings.get(mikadoGraphId))
      .toEqual(aRefactoring({
        mikadoGraphId,
        prerequisites: [{ prerequisiteId, status: Status.EXPERIMENTING, startedAt: '2023-07-25T10:24:00' }],
      }));
  });

  test('The developer adds a prerequisite to a prerequisite', async () => {
    const mikadoGraphId = uuidv4();
    const existingPrerequisiteId = uuidv4();
    const prerequisiteId = uuidv4();
    const label = 'Change that';
    const existingPrerequisite = { prerequisiteId: existingPrerequisiteId, status: Status.EXPERIMENTING };
    const refactorings = new InMemoryMikadoGraphs([aRefactoring({
      mikadoGraphId,
      prerequisites: [existingPrerequisite],
    })]);

    await handleAddPrerequisiteToPrerequisite(refactorings)({
      mikadoGraphId,
      prerequisiteId,
      parentId: existingPrerequisiteId,
      label,
    });

    expect(await refactorings.get(mikadoGraphId))
      .toEqual(aRefactoring({
        mikadoGraphId,
        prerequisites: [
          existingPrerequisite,
          {
            prerequisiteId, parentId: existingPrerequisiteId, label, status: Status.TODO,
          },
        ],
      }));
  });

  test('The developer commits a change when the prerequisite is finished', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const refactorings = new InMemoryMikadoGraphs([aRefactoring({
      mikadoGraphId,
      prerequisites: [{ prerequisiteId, status: Status.EXPERIMENTING }],
    })]);

    await handleCommitChanges(refactorings)({
      mikadoGraphId,
      prerequisiteId,
    });

    expect(await refactorings.get(mikadoGraphId))
      .toEqual(aRefactoring({
        mikadoGraphId,
        done: true,
        prerequisites: [{
          prerequisiteId, status: Status.DONE,
        }],
      }));
  });

  test('The developer gets the refactoring information thanks to the id', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const goal = 'Rework that part';
    const done = false;
    const label = 'Change that';
    const status = Status.TODO;
    const refactorings = new InMemoryMikadoGraphs([aRefactoring({
      mikadoGraphId,
      goal,
      done,
      prerequisites: [{ prerequisiteId, label, status }],
    })]);

    const getRefactoringById = handleGetMikadoGraphById(refactorings);

    expect(await getRefactoringById(mikadoGraphId)).toEqual({
      refactoringId: mikadoGraphId,
      goal,
      done,
      prerequisites: [{
        prerequisiteId, label, status, parentId: mikadoGraphId, startedAt: undefined,
      }],
    });
  });
});

describe('Refactoring', () => {
  it('creates a refactoring without any prerequisite when a refactoring is started', () => {
    const mikadoGraphId = uuidv4();
    const goal = 'Rework that part';
    const refactoring = MikakoGraph.start(mikadoGraphId, goal);

    expect(refactoring).toEqual(aRefactoring({
      mikadoGraphId,
      goal,
      prerequisites: [],
    }));
  });

  it('raises an error if a refactoring is created with an empty goal', () => {
    expect(() => MikakoGraph.start(uuidv4(), ''))
      .toThrow(new Error('The goal cannot be empty'));
  });

  it('adds a prerequisite to a refactoring (its status is todo)', () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const label = 'Change that';
    const refactoring = aRefactoring({
      mikadoGraphId,
      prerequisites: [],
    });

    refactoring.addPrerequisiteToMikadoGraph(prerequisiteId, label);

    expect(refactoring).toEqual(aRefactoring({
      mikadoGraphId,
      prerequisites: [{
        prerequisiteId,
        label,
        status: Status.TODO,
        parentId: mikadoGraphId,
      }],
    }));
  });

  it('raises an error if a prerequisite is added to refactoring with an empty label', () => {
    const refactoring = aRefactoring({});

    expect(() => refactoring.addPrerequisiteToMikadoGraph(uuidv4(), ''))
      .toThrow(new Error('The label cannot be empty'));
  });

  it('adds a prerequisite to an existing prerequisite (its status is todo)', () => {
    const prerequisiteId = uuidv4();
    const parentId = uuidv4();
    const label = 'Change that';
    const existingPrerequisite = { prerequisiteId };
    const refactoring = aRefactoring({
      prerequisites: [existingPrerequisite],
    });

    refactoring.addPrerequisiteToPrerequisite(prerequisiteId, parentId, label);

    expect(refactoring).toEqual(aRefactoring({
      prerequisites: [
        existingPrerequisite,
        {
          prerequisiteId,
          parentId,
          label,
          status: Status.TODO,
        }],
    }));
  });

  it('raises an error if a prerequisite is added to existing prerequisite with an empty label', () => {
    const refactoring = aRefactoring({});

    expect(() => refactoring.addPrerequisiteToPrerequisite(uuidv4(), uuidv4(), ''))
      .toThrow(new Error('The label cannot be empty'));
  });

  it('start an experimentation on a todo prerequisite', () => {
    const prerequisiteId = uuidv4();
    const refactoring = aRefactoring({
      prerequisites: [{
        prerequisiteId, status: Status.TODO, startedAt: undefined,
      }],
    });

    refactoring.startExperimentation(prerequisiteId, new Date('2023-07-25T10:24:00'));

    expect(refactoring).toEqual(aRefactoring({
      prerequisites: [{
        prerequisiteId,
        status: Status.EXPERIMENTING,
        startedAt: '2023-07-25T10:24:00',
      }],
    }));
  });

  test.each([
    Status.EXPERIMENTING,
    Status.DONE,
  ])('raises an error if  an experimentation is started on a "%s" prerequisite', async (status) => {
    const prerequisiteId = uuidv4();
    const refactoring = aRefactoring({
      prerequisites: [{
        prerequisiteId, status, startedAt: undefined,
      }],
    });

    expect(() => refactoring.startExperimentation(prerequisiteId, new Date('2023-07-25T10:24:00')))
      .toThrow(new Error('You can only start an experimentation an a todo prerequisite'));
  });

  describe('commit changes', () => {
    it('commits a change after finishing an experimentation', () => {
      const prerequisiteId = uuidv4();
      const todoPrerequisite = { prerequisiteId: uuidv4(), status: Status.TODO };
      const refactoring = aRefactoring({
        prerequisites: [
          { prerequisiteId, status: Status.EXPERIMENTING },
          todoPrerequisite,
        ],
      });

      refactoring.commitChanges(prerequisiteId);

      expect(refactoring).toEqual(aRefactoring({
        done: false,
        prerequisites: [
          { prerequisiteId, status: Status.DONE },
          todoPrerequisite,
        ],
      }));
    });

    it('finishes the refactoring after committing the last changes', () => {
      const prerequisiteId = uuidv4();
      const refactoring = aRefactoring({
        prerequisites: [{ prerequisiteId, status: Status.EXPERIMENTING }],
      });

      refactoring.commitChanges(prerequisiteId);

      expect(refactoring).toEqual(aRefactoring({
        done: true,
        prerequisites: [{
          prerequisiteId,
          status: Status.DONE,
        }],
      }));
    });

    it.each([
      Status.TODO,
      Status.DONE,
    ])('raises an error if changes are committed to a "%s" prerequisite', async (status) => {
      const prerequisiteId = uuidv4();
      const refactoring = aRefactoring({
        prerequisites: [{ prerequisiteId, status }],
      });

      expect(() => refactoring.commitChanges(prerequisiteId))
        .toThrow(new Error('Chances can only be committed on a experimenting prerequisite'));
    });

    it('turns a refactoring into a format used by the UI to render it', () => {
      const refactoring = aRefactoring({
        mikadoGraphId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
        goal: 'My goal',
        done: false,
        prerequisites: [{
          prerequisiteId: '0472c1c9-7a75-4f7a-9b79-9cd18e60005a',
          label: 'Do this',
          status: Status.TODO,
          startedAt: '2023-07-25T10:24:00.000Z',
          parentId: 'fce08bae-3c28-4d9b-afe9-9ff920605d32',
        }],
      });

      expect(refactoring.render())
        .toEqual({
          refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
          goal: 'My goal',
          done: false,
          prerequisites: [{
            prerequisiteId: '0472c1c9-7a75-4f7a-9b79-9cd18e60005a',
            label: 'Do this',
            status: Status.TODO,
            startedAt: '2023-07-25T10:24:00.000Z',
            parentId: 'fce08bae-3c28-4d9b-afe9-9ff920605d32',
          }],
        });
    });
  });

  describe('identifyBy', () => {
    it('says yes if the given id match the refactoring id', () => {
      const mikadoGraphId = uuidv4();
      const refactoring = aRefactoring({ mikadoGraphId });

      expect(refactoring.identifyBy(mikadoGraphId))
        .toEqual(true);
    });

    it('says no if the given id does not match the refactoring id', () => {
      const refactoring = aRefactoring({ mikadoGraphId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' });

      expect(refactoring.identifyBy('c2e2ddf8-534b-4080-b47c-0f4536b54cae'))
        .toEqual(false);
    });
  });

  describe('equals', () => {
    it('says yes if the given refactoring object equals this one', () => {
      const mikadoGraphId = uuidv4();
      const refactoring = aRefactoring({ mikadoGraphId });

      expect(refactoring.equals(aRefactoring({ mikadoGraphId })))
        .toEqual(true);
    });

    it('says no if the given refactoring object does not equals this one', () => {
      const refactoring = aRefactoring({ mikadoGraphId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' });

      expect(refactoring.equals(aRefactoring({ mikadoGraphId: 'c2e2ddf8-534b-4080-b47c-0f4536b54cae' })))
        .toEqual(false);
    });
  });
});

describe('Refactorings', () => {
  it('persists a refactoring', async () => {
    const mikadoGraphId = uuidv4();
    const refactorings = new InMemoryMikadoGraphs();

    await refactorings.add(aRefactoring({ mikadoGraphId }));

    expect(await refactorings.get(mikadoGraphId))
      .toEqual(aRefactoring({ mikadoGraphId }));
  });

  it('raises an error if the given id does not match an existing refactoring', async () => {
    const refactorings = new InMemoryMikadoGraphs([
      aRefactoring({ mikadoGraphId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' }),
    ]);

    await expect(refactorings.get('c2e2ddf8-534b-4080-b47c-0f4536b54cae')).rejects.toThrow(
      new UnknownMikadoGraph(
        'The mikado graph with the id c2e2ddf8-534b-4080-b47c-0f4536b54cae does not exist',
      ),
    );
  });
});
