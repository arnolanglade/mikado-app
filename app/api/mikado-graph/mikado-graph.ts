export interface Clock {
  now(): Date
}

export class InMemoryClock implements Clock {
  constructor(private date: string) {
  }

  now(): Date {
    return new Date(this.date);
  }
}

export class SystemClock implements Clock {
  // eslint-disable-next-line class-methods-use-this
  now(): Date {
    return new Date();
  }
}

export class PrerequisiteList {
  constructor(private prerequisites: Prerequisite[] = []) {
  }

  add(prerequisite: Prerequisite): PrerequisiteList {
    return new PrerequisiteList([...this.prerequisites, prerequisite]);
  }

  find(callback: (prerequisite: Prerequisite) => boolean): Prerequisite {
    const matchingPrerequisites = this.prerequisites
      .filter(callback);

    if (matchingPrerequisites.length !== 1) {
      throw new Error('The prerequisite does not exist');
    }

    return matchingPrerequisites[0];
  }

  replace(prerequisiteId: string, prerequisite: Prerequisite): PrerequisiteList {
    return new PrerequisiteList(
      this.prerequisites
        .map((currentPrerequisite) => (currentPrerequisite.identifyBy(prerequisiteId) ? prerequisite : currentPrerequisite)),
    );
  }

  replaceParent(prerequisite: Prerequisite, newParentPrerequisite: Prerequisite): PrerequisiteList {
    return new PrerequisiteList(
      this.prerequisites
        .map((currentPrerequisite) => (currentPrerequisite.isParent(prerequisite) ? newParentPrerequisite : currentPrerequisite)),
    );
  }
}

export class Label {
  constructor(private label: string) {
    if (label === '') {
      throw new Error('The label cannot be empty');
    }
  }

  toString() {
    return this.label;
  }
}

// Todo: used in the front end
export enum Status {
  TODO = 'todo',
  EXPERIMENTING = 'experimenting',
  DONE = 'done',
}

// Todo: used in the front end
export type PrerequisiteView = {
  prerequisiteId: string,
  label: string,
  status: Status,
  startedAt?: string,
  parentId: string,
  allChildrenDone: boolean,
};

export class Prerequisite {
  constructor(
    private prerequisiteId: string,
    private label: Label,
    private status: Status,
    public parentId: string,
    private allChildrenDone: boolean,
    private startedAt?: Date,
  ) {
  }

  static new(
    prerequisiteId: string,
    parentId: string,
    label: string,
  ) {
    return new Prerequisite(
      prerequisiteId,
      new Label(label),
      Status.TODO,
      parentId,
      false,
    );
  }

  start(startedAt: Date): Prerequisite {
    return new Prerequisite(
      this.prerequisiteId,
      this.label,
      Status.EXPERIMENTING,
      this.parentId,
      this.allChildrenDone,
      startedAt,
    );
  }

  done(): Prerequisite {
    return new Prerequisite(
      this.prerequisiteId,
      this.label,
      Status.DONE,
      this.parentId,
      this.allChildrenDone,
      this.startedAt,
    );
  }

  childrenDone(): Prerequisite {
    return new Prerequisite(
      this.prerequisiteId,
      this.label,
      this.status,
      this.parentId,
      true,
      this.startedAt,
    );
  }

  resetChildrenDone(): Prerequisite {
    return new Prerequisite(
      this.prerequisiteId,
      this.label,
      this.status,
      this.parentId,
      false,
      this.startedAt,
    );
  }

  identifyBy(prerequisiteId: string): boolean {
    return prerequisiteId === this.prerequisiteId;
  }

  isParent(prerequisite: Prerequisite): boolean {
    return this.prerequisiteId === prerequisite.parentId;
  }

  hasParent(prerequisite: Prerequisite): boolean {
    return this.parentId === prerequisite.parentId;
  }

  hasStatus(status: Status): boolean {
    return this.status === status;
  }

  render(): PrerequisiteView {
    return {
      prerequisiteId: this.prerequisiteId,
      label: this.label.toString(),
      status: this.status,
      startedAt: this.startedAt?.toISOString(),
      parentId: this.parentId,
      allChildrenDone: this.allChildrenDone,
    };
  }
}

export class Goal {
  constructor(private goal: string) {
    if (goal === '') {
      throw new Error('The goal cannot be empty');
    }
  }

  toString() {
    return this.goal;
  }
}

// Todo: used in the front end
export type MikadoGraphView = {
  mikadoGraphId: string
  goal: string
  done: boolean
  prerequisites: PrerequisiteView[]
};

export class MikadoGraph {
  constructor(
    private id: string,
    private goal: Goal,
    private done: boolean,
    private prerequisites: Prerequisite[] = [],
  ) {}

  static start(id: string, goal: string) {
    return new MikadoGraph(id, new Goal(goal), false, []);
  }

  startExperimentation(prerequisiteId: string, startedAt: Date): void {
    this.prerequisites = this.prerequisites.map((prerequisite) => {
      if (prerequisite.identifyBy(prerequisiteId)) {
        if (!prerequisite.hasStatus(Status.TODO)) {
          throw new Error('You can only start an experimentation an a todo prerequisite');
        }

        return prerequisite.start(startedAt);
      }

      return prerequisite;
    });
  }

  addPrerequisiteToMikadoGraph(prerequisiteId: string, label: string): void {
    this.prerequisites = [...this.prerequisites, Prerequisite.new(prerequisiteId, this.id, label)];
  }

  addPrerequisiteToPrerequisite(prerequisiteId: string, parentId: string, label: string): void {
    this.prerequisites = this.prerequisites
      .map((prerequisite) => (prerequisite.identifyBy(parentId) ? prerequisite.resetChildrenDone() : prerequisite));

    this.prerequisites = [...this.prerequisites, Prerequisite.new(prerequisiteId, parentId, label)];
  }

  commitChanges(prerequisiteId: string): void {
    let done = true;
    this.prerequisites = this.prerequisites.map((prerequisite) => {
      if (prerequisite.identifyBy(prerequisiteId)) {
        if (!prerequisite.hasStatus(Status.EXPERIMENTING)) {
          throw new Error('Chances can only be committed on a experimenting prerequisite');
        }

        return prerequisite.done();
      }

      if (!prerequisite.hasStatus(Status.DONE)) {
        done = false;
      }

      return prerequisite;
    });

    const prerequisite = this.prerequisites
      .filter((p) => p.identifyBy(prerequisiteId))[0];

    const childrenPrerequisiteUnDone = this.prerequisites
      .filter((p) => p.hasParent(prerequisite) && !p.hasStatus(Status.DONE));

    if (childrenPrerequisiteUnDone.length === 0) {
      this.prerequisites = this.prerequisites.map((p) => (p.isParent(prerequisite) ? p.childrenDone() : p));
    }

    this.done = done;
  }

  render(): MikadoGraphView {
    return {
      mikadoGraphId: this.id,
      goal: this.goal.toString(),
      done: this.done,
      prerequisites: this.prerequisites.map((prerequisite) => prerequisite.render()),
    };
  }

  identifyBy(id: string): boolean {
    return id === this.id;
  }

  equals(mikadoGraph: MikadoGraph): boolean {
    return mikadoGraph.id === this.id;
  }
}

export class UnknownMikadoGraph extends Error {
  static fromId(id: string) {
    return new UnknownMikadoGraph(`The mikado graph with the id ${id} does not exist`);
  }
}

// Todo: Export for the frontend, do we need to duplicate?
export interface MikadoGraphs {
  get(id: string): Promise<MikadoGraph>
  add(mikakoGraph: MikadoGraph): Promise<void>
}

export class InMemoryMikadoGraphs implements MikadoGraphs {
  constructor(private mikakoGraphs: MikadoGraph[] = []) {}

  async get(id: string): Promise<MikadoGraph> {
    const matchingMikadoGraph = this.mikakoGraphs
      .filter((mikadoGraph) => mikadoGraph.identifyBy(id));

    if (matchingMikadoGraph.length !== 1) {
      throw UnknownMikadoGraph.fromId(id);
    }

    return matchingMikadoGraph[0];
  }

  async add(mikakoGraph: MikadoGraph): Promise<void> {
    let isMikadoGraphFound = false;
    this.mikakoGraphs = this.mikakoGraphs.map((currentMikadoGraph) => {
      if (currentMikadoGraph.equals(mikakoGraph)) {
        isMikadoGraphFound = true;
        return mikakoGraph;
      }
      return currentMikadoGraph;
    });

    if (!isMikadoGraphFound) {
      this.mikakoGraphs = [...this.mikakoGraphs, mikakoGraph];
    }
  }
}

// Todo: Export for the testing purpose
export const inMemoryMikadoGraphs = new InMemoryMikadoGraphs();

export type StartTask = {
  mikadoGraphId: string
  goal: string
};

export const handleStartTask = (mikadoGraphs: MikadoGraphs) => async (input: StartTask) => {
  await mikadoGraphs.add(MikadoGraph.start(input.mikadoGraphId, input.goal));
};

export const startTask = handleStartTask(inMemoryMikadoGraphs);

export type AddPrerequisiteToMikadoGraph = {
  prerequisiteId: string
  mikadoGraphId: string
  label: string
};

export const handleAddPrerequisiteToMikadoGraph = (mikadoGraphs: MikadoGraphs) => async (input: AddPrerequisiteToMikadoGraph) => {
  const mikakoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikakoGraph.addPrerequisiteToMikadoGraph(input.prerequisiteId, input.label);
  await mikadoGraphs.add(mikakoGraph);
};

export const addPrerequisiteToMikadoGraph = handleAddPrerequisiteToMikadoGraph(inMemoryMikadoGraphs);

export type AddPrerequisiteToPrerequisite = {
  mikadoGraphId: string
  prerequisiteId: string
  parentId: string
  label: string
};

export const handleAddPrerequisiteToPrerequisite = (mikadoGraphs: MikadoGraphs) => async (input: AddPrerequisiteToPrerequisite) => {
  const mikakoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikakoGraph.addPrerequisiteToPrerequisite(input.prerequisiteId, input.parentId, input.label);
  await mikadoGraphs.add(mikakoGraph);
};

export const addPrerequisiteToPrerequisite = handleAddPrerequisiteToPrerequisite(inMemoryMikadoGraphs);

export type CommitChanges = {
  mikadoGraphId: string
  prerequisiteId: string
};

export const handleCommitChanges = (mikadoGraphs: MikadoGraphs) => async (input: CommitChanges) => {
  const mikakoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikakoGraph.commitChanges(input.prerequisiteId);
  await mikadoGraphs.add(mikakoGraph);
};

export const commitChanges = handleCommitChanges(inMemoryMikadoGraphs);

export const handleGetMikadoGraphById = (mikadoGraphs: MikadoGraphs) => async (mikadoGraphId: string): Promise<MikadoGraphView> => {
  const mikakoGraph = await mikadoGraphs.get(mikadoGraphId);
  return mikakoGraph.render();
};

export const getMikadoGraphById = handleGetMikadoGraphById(inMemoryMikadoGraphs);

export type StartExperimentation = {
  prerequisiteId: string
  mikadoGraphId: string
};

export const handleStartExperimentation = (mikadoGraphs: MikadoGraphs, clock: Clock) => async (input: StartExperimentation): Promise<void> => {
  const mikakoGraph = await mikadoGraphs.get(input.mikadoGraphId);
  mikakoGraph.startExperimentation(input.prerequisiteId, clock.now());
  await mikadoGraphs.add(mikakoGraph);
};

export const startExperimentation = handleStartExperimentation(inMemoryMikadoGraphs, new SystemClock());
