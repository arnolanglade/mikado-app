import {
  handleAddPrerequisiteToPrerequisite,
  handleAddPrerequisiteToMikadoGraph,
  handleCommitChanges,
  handleGetMikadoGraphById,
  handleStartExperimentation,
  handleStartTask,
  InMemoryClock,
  InMemoryMikadoGraphs,
  MikadoGraph,
  Status,
  UnknownMikadoGraph, PrerequisiteList,
} from '@/api/mikado-graph/mikado-graph';
import { aMikadoGraph, aPrerequisite } from '@/test/test-utils';
import { v4 as uuidv4 } from 'uuid';

describe('Mikado Graph use cases', () => {
  test('The developer starts a mikado graph', async () => {
    const mikadoGraphId = uuidv4();
    const mikadoGraphs = new InMemoryMikadoGraphs();
    await handleStartTask(mikadoGraphs)({
      mikadoGraphId,
      goal: 'Rework that part',
    });

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({
        mikadoGraphId,
        goal: 'Rework that part',
      }));
  });

  test('The developer adds a prerequisite to a mikado graph', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const label = 'Change that';
    const mikadoGraphs = new InMemoryMikadoGraphs([aMikadoGraph({
      mikadoGraphId,
      prerequisites: [],
    })]);

    await handleAddPrerequisiteToMikadoGraph(mikadoGraphs)({
      prerequisiteId,
      mikadoGraphId,
      label,
    });

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({
        mikadoGraphId,
        prerequisites: [{ prerequisiteId, label, status: Status.TODO }],
      }));
  });

  test('The developer starts an experimentation on a todo prerequisite', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const mikadoGraphs = new InMemoryMikadoGraphs([aMikadoGraph({
      mikadoGraphId,
      prerequisites: [{ prerequisiteId, status: Status.TODO, startedAt: undefined }],
    })]);
    const clock = new InMemoryClock('2023-07-25T10:24:00');

    await handleStartExperimentation(mikadoGraphs, clock)({
      mikadoGraphId,
      prerequisiteId,
    });

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({
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
    const mikadoGraphs = new InMemoryMikadoGraphs([aMikadoGraph({
      mikadoGraphId,
      prerequisites: [existingPrerequisite],
    })]);

    await handleAddPrerequisiteToPrerequisite(mikadoGraphs)({
      mikadoGraphId,
      prerequisiteId,
      parentId: existingPrerequisiteId,
      label,
    });

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({
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
    const mikadoGraphs = new InMemoryMikadoGraphs([aMikadoGraph({
      mikadoGraphId,
      prerequisites: [{ prerequisiteId, status: Status.EXPERIMENTING }],
    })]);

    await handleCommitChanges(mikadoGraphs)({
      mikadoGraphId,
      prerequisiteId,
    });

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({
        mikadoGraphId,
        done: true,
        prerequisites: [{
          prerequisiteId, status: Status.DONE,
        }],
      }));
  });

  test('The developer gets the mikado graph information thanks to the id', async () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const goal = 'Rework that part';
    const done = false;
    const label = 'Change that';
    const status = Status.TODO;
    const allChildrenDone = true;
    const mikadoGraphs = new InMemoryMikadoGraphs([aMikadoGraph({
      mikadoGraphId,
      goal,
      done,
      prerequisites: [{
        prerequisiteId, label, status, allChildrenDone,
      }],
    })]);

    const getMikadoGraphById = handleGetMikadoGraphById(mikadoGraphs);

    expect(await getMikadoGraphById(mikadoGraphId)).toEqual({
      mikadoGraphId,
      goal,
      done,
      prerequisites: [{
        prerequisiteId, label, status, parentId: mikadoGraphId, startedAt: undefined, allChildrenDone,
      }],
    });
  });
});

describe('Prerequisite List', () => {
  it('adds a new prerequisite to the list', () => {
    const list = new PrerequisiteList();
    const prerequisite = aPrerequisite();

    const newList = list.add(prerequisite);

    expect(newList).toEqual(new PrerequisiteList([prerequisite]));
  });

  describe('find method', () => {
    it('gets a prerequisite with its id', () => {
      const prerequisiteId = uuidv4();
      const prerequisite = aPrerequisite({ prerequisiteId });
      const list = new PrerequisiteList([prerequisite]);

      const foundPrerequisite = list.find((p) => p.identifyBy(prerequisiteId));

      expect(foundPrerequisite).toEqual(prerequisite);
    });

    it('raises an error if the prerequisite does not exist', () => {
      const prerequisiteId = uuidv4();
      const list = new PrerequisiteList([]);

      expect(() => list.find((p) => p.identifyBy(prerequisiteId))).toThrow(new Error('The prerequisite does not exist'));
    });
  });

  it('replaces a prerequisite by another one', () => {
    const prerequisiteId = uuidv4();
    const prerequisite = aPrerequisite({ prerequisiteId });
    const list = new PrerequisiteList([prerequisite]);

    const newPrerequisite = aPrerequisite({ prerequisiteId, label: 'new label' });
    const newList = list.replace(prerequisiteId, newPrerequisite);

    expect(newList).toEqual(new PrerequisiteList([newPrerequisite]));
  });

  it('replaces the parent prerequisite by another one', () => {
    const parentPrerequisiteId = uuidv4();
    const parentPrerequisite = aPrerequisite({ prerequisiteId: parentPrerequisiteId });
    const prerequisite = aPrerequisite({ parentId: parentPrerequisiteId });
    const list = new PrerequisiteList([prerequisite, parentPrerequisite]);

    const newParentPrerequisite = aPrerequisite({ prerequisiteId: parentPrerequisiteId, label: 'new label' });
    const newList = list.replaceParent(prerequisite, newParentPrerequisite);

    expect(newList).toEqual(new PrerequisiteList([prerequisite, newParentPrerequisite]));
  });
});

describe('Mikado Graph', () => {
  it('creates a mikado graph without any prerequisite when a mikado graph is started', () => {
    const mikadoGraphId = uuidv4();
    const goal = 'Rework that part';
    const mikadoGraph = MikadoGraph.start(mikadoGraphId, goal);

    expect(mikadoGraph).toEqual(aMikadoGraph({
      mikadoGraphId,
      goal,
      prerequisites: [],
    }));
  });

  it('raises an error if a mikado graph is created with an empty goal', () => {
    expect(() => MikadoGraph.start(uuidv4(), ''))
      .toThrow(new Error('The goal cannot be empty'));
  });

  it('adds a prerequisite to a mikado graph (its status is todo)', () => {
    const mikadoGraphId = uuidv4();
    const prerequisiteId = uuidv4();
    const label = 'Change that';
    const mikadoGraph = aMikadoGraph({
      mikadoGraphId,
      prerequisites: [],
    });

    mikadoGraph.addPrerequisiteToMikadoGraph(prerequisiteId, label);

    expect(mikadoGraph).toEqual(aMikadoGraph({
      mikadoGraphId,
      prerequisites: [{
        prerequisiteId,
        label,
        status: Status.TODO,
        parentId: mikadoGraphId,
      }],
    }));
  });

  it('raises an error if a prerequisite is added to mikado graph with an empty label', () => {
    const mikadoGraph = aMikadoGraph({});

    expect(() => mikadoGraph.addPrerequisiteToMikadoGraph(uuidv4(), ''))
      .toThrow(new Error('The label cannot be empty'));
  });

  it('adds a prerequisite to an existing prerequisite (its status is todo)', () => {
    const prerequisiteId = uuidv4();
    const parentId = uuidv4();
    const label = 'Change that';
    const existingPrerequisite = { prerequisiteId };
    const mikadoGraph = aMikadoGraph({
      prerequisites: [existingPrerequisite],
    });

    mikadoGraph.addPrerequisiteToPrerequisite(prerequisiteId, parentId, label);

    expect(mikadoGraph).toEqual(aMikadoGraph({
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

  it('resets the allChildrenDone flag when a new prerequisite is added', () => {
    const prerequisiteId = uuidv4();
    const parentPrerequisiteId = uuidv4();
    const label = 'Change that';
    const mikadoGraph = aMikadoGraph({
      prerequisites: [
        { prerequisiteId: parentPrerequisiteId, status: Status.EXPERIMENTING, allChildrenDone: true },
        { prerequisiteId, parentId: parentPrerequisiteId, status: Status.DONE },
      ],
    });

    mikadoGraph.addPrerequisiteToPrerequisite(prerequisiteId, parentPrerequisiteId, label);

    expect(mikadoGraph).toEqual(aMikadoGraph({
      prerequisites: [
        { prerequisiteId: parentPrerequisiteId, status: Status.EXPERIMENTING, allChildrenDone: false },
        { prerequisiteId, parentId: parentPrerequisiteId, status: Status.DONE },
        {
          prerequisiteId, parentId: parentPrerequisiteId, label, status: Status.TODO,
        },
      ],
    }));
  });

  it('raises an error if a prerequisite is added to existing prerequisite with an empty label', () => {
    const mikadoGraph = aMikadoGraph({});

    expect(() => mikadoGraph.addPrerequisiteToPrerequisite(uuidv4(), uuidv4(), ''))
      .toThrow(new Error('The label cannot be empty'));
  });

  it('start an experimentation on a todo prerequisite', () => {
    const prerequisiteId = uuidv4();
    const mikadoGraph = aMikadoGraph({
      prerequisites: [{
        prerequisiteId, status: Status.TODO, startedAt: undefined,
      }],
    });

    mikadoGraph.startExperimentation(prerequisiteId, new Date('2023-07-25T10:24:00'));

    expect(mikadoGraph).toEqual(aMikadoGraph({
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
    const mikadoGraph = aMikadoGraph({
      prerequisites: [{
        prerequisiteId, status, startedAt: undefined,
      }],
    });

    expect(() => mikadoGraph.startExperimentation(prerequisiteId, new Date('2023-07-25T10:24:00')))
      .toThrow(new Error('You can only start an experimentation an a todo prerequisite'));
  });

  describe('commit changes', () => {
    it('commits a change after finishing an experimentation', () => {
      const prerequisiteId = uuidv4();
      const todoPrerequisite = { prerequisiteId: uuidv4(), status: Status.TODO };
      const mikadoGraph = aMikadoGraph({
        prerequisites: [
          { prerequisiteId, status: Status.EXPERIMENTING },
          todoPrerequisite,
        ],
      });

      mikadoGraph.commitChanges(prerequisiteId);

      expect(mikadoGraph).toEqual(aMikadoGraph({
        done: false,
        prerequisites: [
          { prerequisiteId, status: Status.DONE },
          todoPrerequisite,
        ],
      }));
    });

    it('finishes the mikado graph after finishing all prerequisites', () => {
      const prerequisiteId = uuidv4();
      const mikadoGraph = aMikadoGraph({
        prerequisites: [{ prerequisiteId, status: Status.EXPERIMENTING }],
      });

      mikadoGraph.commitChanges(prerequisiteId);

      expect(mikadoGraph).toEqual(aMikadoGraph({
        done: true,
        prerequisites: [{
          prerequisiteId,
          status: Status.DONE,
        }],
      }));
    });

    it('finishes the prerequisite after finishing all children prerequisites', () => {
      const parentPrerequisiteId = uuidv4();
      const prerequisiteId = uuidv4();
      const mikadoGraph = aMikadoGraph({
        prerequisites: [
          { prerequisiteId: parentPrerequisiteId, status: Status.EXPERIMENTING, allChildrenDone: false },
          { prerequisiteId, parentId: parentPrerequisiteId, status: Status.EXPERIMENTING },
        ],
      });

      mikadoGraph.commitChanges(prerequisiteId);

      expect(mikadoGraph).toEqual(aMikadoGraph({
        prerequisites: [
          { prerequisiteId: parentPrerequisiteId, status: Status.EXPERIMENTING, allChildrenDone: true },
          { prerequisiteId, parentId: parentPrerequisiteId, status: Status.DONE },
        ],
      }));
    });

    it.each([
      Status.TODO,
      Status.DONE,
    ])('raises an error if changes are committed to a "%s" prerequisite', async (status) => {
      const prerequisiteId = uuidv4();
      const mikadoGraph = aMikadoGraph({
        prerequisites: [{ prerequisiteId, status }],
      });

      expect(() => mikadoGraph.commitChanges(prerequisiteId))
        .toThrow(new Error('Chances can only be committed on a experimenting prerequisite'));
    });

    it('turns a mikado graph into a format used by the UI to render it', () => {
      const mikadoGraph = aMikadoGraph({
        mikadoGraphId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
        goal: 'My goal',
        done: false,
        prerequisites: [{
          prerequisiteId: '0472c1c9-7a75-4f7a-9b79-9cd18e60005a',
          label: 'Do this',
          status: Status.TODO,
          startedAt: '2023-07-25T10:24:00.000Z',
          parentId: 'fce08bae-3c28-4d9b-afe9-9ff920605d32',
          allChildrenDone: true,
        }],
      });

      expect(mikadoGraph.render())
        .toEqual({
          mikadoGraphId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784',
          goal: 'My goal',
          done: false,
          prerequisites: [{
            prerequisiteId: '0472c1c9-7a75-4f7a-9b79-9cd18e60005a',
            label: 'Do this',
            status: Status.TODO,
            startedAt: '2023-07-25T10:24:00.000Z',
            parentId: 'fce08bae-3c28-4d9b-afe9-9ff920605d32',
            allChildrenDone: true,
          }],
        });
    });
  });

  describe('identifyBy', () => {
    it('says yes if the given id match the mikado graph id', () => {
      const mikadoGraphId = uuidv4();
      const mikadoGraph = aMikadoGraph({ mikadoGraphId });

      expect(mikadoGraph.identifyBy(mikadoGraphId))
        .toEqual(true);
    });

    it('says no if the given id does not match the mikado graph id', () => {
      const mikadoGraph = aMikadoGraph({ mikadoGraphId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' });

      expect(mikadoGraph.identifyBy('c2e2ddf8-534b-4080-b47c-0f4536b54cae'))
        .toEqual(false);
    });
  });

  describe('equals', () => {
    it('says yes if the given mikado graph object equals this one', () => {
      const mikadoGraphId = uuidv4();
      const mikadoGraph = aMikadoGraph({ mikadoGraphId });

      expect(mikadoGraph.equals(aMikadoGraph({ mikadoGraphId })))
        .toEqual(true);
    });

    it('says no if the given mikado graph object does not equals this one', () => {
      const mikadoGraph = aMikadoGraph({ mikadoGraphId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' });

      expect(mikadoGraph.equals(aMikadoGraph({ mikadoGraphId: 'c2e2ddf8-534b-4080-b47c-0f4536b54cae' })))
        .toEqual(false);
    });
  });
});

describe('Mikado Graphs', () => {
  it('persists a mikado graph', async () => {
    const mikadoGraphId = uuidv4();
    const mikadoGraphs = new InMemoryMikadoGraphs();

    await mikadoGraphs.add(aMikadoGraph({ mikadoGraphId }));

    expect(await mikadoGraphs.get(mikadoGraphId))
      .toEqual(aMikadoGraph({ mikadoGraphId }));
  });

  it('raises an error if the given id does not match an existing mikado graph', async () => {
    const mikadoGraphs = new InMemoryMikadoGraphs([
      aMikadoGraph({ mikadoGraphId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784' }),
    ]);

    await expect(mikadoGraphs.get('c2e2ddf8-534b-4080-b47c-0f4536b54cae')).rejects.toThrow(
      new UnknownMikadoGraph(
        'The mikado graph with the id c2e2ddf8-534b-4080-b47c-0f4536b54cae does not exist',
      ),
    );
  });
});
