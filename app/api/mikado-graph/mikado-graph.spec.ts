import {
  MikadoGraph,
  PrerequisiteList,
  Status, StatusState, StatusView,
} from '@/api/mikado-graph/mikado-graph';
import {
  aMikadoGraph, aMikadoGraphView, aPrerequisite, aPrerequisiteView,
} from '@/test/test-utils';
import { v4 as uuidv4 } from 'uuid';

describe('Prerequisite List', () => {
  it('adds a new prerequisite to the list', () => {
    const list = new PrerequisiteList();
    const prerequisite = aPrerequisite();

    const newList = list.add(prerequisite);

    expect(newList).toEqual(new PrerequisiteList([prerequisite]));
  });

  it('finds a prerequisite with its id', () => {
    const prerequisiteId = uuidv4();
    const prerequisite = aPrerequisite({ prerequisiteId });
    const list = new PrerequisiteList([prerequisite]);

    const foundPrerequisite = list.find((p) => p.identifyBy(prerequisiteId));

    expect(foundPrerequisite).toEqual(prerequisite);
  });

  it('replaces a prerequisite by another one', () => {
    const prerequisiteId = uuidv4();
    const prerequisite = aPrerequisite({ prerequisiteId });
    const list = new PrerequisiteList([prerequisite]);

    const newPrerequisite = aPrerequisite({ prerequisiteId, label: 'new label' });
    const newList = list.replace(prerequisiteId, () => newPrerequisite);

    expect(newList).toEqual(new PrerequisiteList([newPrerequisite]));
  });

  it('replaces the parent prerequisite by another one', () => {
    const parentPrerequisiteId = uuidv4();
    const parentPrerequisite = aPrerequisite({ prerequisiteId: parentPrerequisiteId });
    const prerequisite = aPrerequisite({ parentId: parentPrerequisiteId });
    const list = new PrerequisiteList([prerequisite, parentPrerequisite]);

    const newParentPrerequisite = aPrerequisite({ prerequisiteId: parentPrerequisiteId, label: 'new label' });
    const newList = list.replaceParent(prerequisite, () => newParentPrerequisite);

    expect(newList).toEqual(new PrerequisiteList([prerequisite, newParentPrerequisite]));
  });

  describe('isDone method', () => {
    it('says yes if all prerequisites are done', () => {
      const parentPrerequisite = aPrerequisite({ prerequisiteId: uuidv4(), status: Status.DONE });
      const prerequisite = aPrerequisite({ prerequisiteId: uuidv4(), status: Status.DONE });
      const list = new PrerequisiteList([prerequisite, parentPrerequisite]);

      list.isDone();

      expect(list.isDone()).toBe(true);
    });

    it('says no if all prerequisites are not done', () => {
      const parentPrerequisite = aPrerequisite({ prerequisiteId: uuidv4(), status: Status.DONE });
      const prerequisite = aPrerequisite({ prerequisiteId: uuidv4(), status: Status.TODO });
      const list = new PrerequisiteList([prerequisite, parentPrerequisite]);

      expect(list.isDone()).toBe(false);
    });
  });

  it('turn the prerequisite list into a view', () => {
    const prerequisiteId = uuidv4();
    const label = 'Change that';
    const startedAt = '2023-07-25T10:24:00.000Z';
    const parentId = uuidv4();
    const canBeCommitted = true;
    const prerequisite = aPrerequisite({
      prerequisiteId, label, status: Status.EXPERIMENTING, startedAt, parentId, canBeCommitted,
    });
    const list = new PrerequisiteList([prerequisite]);

    expect(list.toView()).toEqual([
      aPrerequisiteView({
        prerequisiteId, label, status: StatusView.EXPERIMENTING, startedAt, parentId, canBeCommitted,
      }),
    ]);
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

  it('creates a mikado graph from its state', () => {
    const mikadoGraphId = uuidv4();
    const goal = 'My goal';
    const done = false;
    const prerequisiteId = uuidv4();
    const label = 'Do this';
    const startedAt = '2023-07-25T10:24:00.000Z';
    const parentId = uuidv4();
    const canBeCommitted = true;

    const mikadoGraph = MikadoGraph.fromState({
      mikado_graph_id: mikadoGraphId,
      goal,
      done,
      prerequisite: [{
        prerequisite_id: prerequisiteId,
        label,
        status: StatusState.TODO,
        started_at: startedAt,
        parent_id: parentId,
        all_children_done: canBeCommitted,
      }],
    });

    expect(mikadoGraph).toEqual(aMikadoGraph({
      mikadoGraphId,
      goal,
      done,
      prerequisites: [{
        prerequisiteId,
        label,
        status: Status.TODO,
        startedAt,
        parentId,
        canBeCommitted,
      }],
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

  it('resets the canBeCommitted flag when a new prerequisite is added', () => {
    const prerequisiteId = uuidv4();
    const parentPrerequisiteId = uuidv4();
    const label = 'Change that';
    const mikadoGraph = aMikadoGraph({
      prerequisites: [
        { prerequisiteId: parentPrerequisiteId, status: Status.EXPERIMENTING, canBeCommitted: true },
        { prerequisiteId, parentId: parentPrerequisiteId, status: Status.DONE },
      ],
    });

    mikadoGraph.addPrerequisiteToPrerequisite(prerequisiteId, parentPrerequisiteId, label);

    expect(mikadoGraph).toEqual(aMikadoGraph({
      prerequisites: [
        { prerequisiteId: parentPrerequisiteId, status: Status.EXPERIMENTING, canBeCommitted: false },
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
          { prerequisiteId: parentPrerequisiteId, status: Status.EXPERIMENTING, canBeCommitted: false },
          { prerequisiteId, parentId: parentPrerequisiteId, status: Status.EXPERIMENTING },
        ],
      });

      mikadoGraph.commitChanges(prerequisiteId);

      expect(mikadoGraph).toEqual(aMikadoGraph({
        prerequisites: [
          { prerequisiteId: parentPrerequisiteId, status: Status.EXPERIMENTING, canBeCommitted: true },
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

    it('turns a mikado graph into a view', () => {
      const mikadoGraphId = uuidv4();
      const goal = 'My goal';
      const done = false;
      const prerequisiteId = uuidv4();
      const label = 'Do this';
      const status = Status.TODO;
      const startedAt = '2023-07-25T10:24:00.000Z';
      const parentId = uuidv4();
      const canBeCommitted = true;
      const mikadoGraph = aMikadoGraph({
        mikadoGraphId,
        goal,
        done,
        prerequisites: [{
          prerequisiteId,
          label,
          status,
          startedAt,
          parentId,
          canBeCommitted,
        }],
      });

      expect(mikadoGraph.toView())
        .toEqual({
          mikadoGraphId,
          goal,
          done,
          prerequisites: [{
            prerequisiteId,
            label,
            status,
            startedAt,
            parentId,
            canBeCommitted,
          }],
        });
    });

    test('a prerequisite can be committed when a prerequisite does not have a children', () => {
      const mikadoGraph = aMikadoGraph({
        prerequisites: [{
          canBeCommitted: null,
        }],
      });

      expect(mikadoGraph.toView())
        .toEqual(aMikadoGraphView({
          prerequisites: [{
            canBeCommitted: true,
          }],
        }));
    });

    it('turns a mikado graph into a state', () => {
      const mikadoGraphId = uuidv4();
      const goal = 'My goal';
      const done = false;
      const prerequisiteId = uuidv4();
      const label = 'Do this';
      const status = Status.TODO;
      const startedAt = '2023-07-25T10:24:00.000Z';
      const parentId = uuidv4();
      const canBeCommitted = true;
      const mikadoGraph = aMikadoGraph({
        mikadoGraphId,
        goal,
        done,
        prerequisites: [{
          prerequisiteId,
          label,
          status,
          startedAt,
          parentId,
          canBeCommitted,
        }],
      });

      expect(mikadoGraph.toState())
        .toEqual({
          mikado_graph_id: mikadoGraphId,
          goal,
          done,
          prerequisite: [{
            prerequisite_id: prerequisiteId,
            label,
            status,
            started_at: startedAt,
            parent_id: parentId,
            all_children_done: canBeCommitted,
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
