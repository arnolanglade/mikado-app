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
export class MikadoGraphId {
  constructor(private id: string) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('The mikado graph id does follow the required format');
    }
  }

  equals(other: MikadoGraphId): boolean {
    return this.id === other.id;
  }

  toString() {
    return this.id;
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
    public parentId: MikadoGraphId,
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
      new MikadoGraphId(parentId),
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
    return this.prerequisiteId === prerequisite.parentId.toString();
  }

  hasParent(prerequisite: Prerequisite): boolean {
    return this.parentId === prerequisite.parentId;
  }

  hasStatus(status: Status): boolean {
    return this.status === status;
  }

  toView(): PrerequisiteView {
    return {
      prerequisiteId: this.prerequisiteId,
      label: this.label.toString(),
      status: this.status,
      startedAt: this.startedAt?.toISOString(),
      parentId: this.parentId.toString(),
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

export class PrerequisiteList {
  constructor(private prerequisites: Prerequisite[] = []) {}

  add(prerequisite: Prerequisite): PrerequisiteList {
    return new PrerequisiteList([...this.prerequisites, prerequisite]);
  }

  find(callback: (prerequisite: Prerequisite) => boolean): Prerequisite {
    const matchingPrerequisites = this.prerequisites
      .filter(callback);

    return matchingPrerequisites[0];
  }

  replace(prerequisiteId: string, callback: (prerequisite: Prerequisite) => Prerequisite): PrerequisiteList {
    return new PrerequisiteList(
      this.prerequisites
        .map(
          (currentPrerequisite) => (currentPrerequisite.identifyBy(prerequisiteId) ? callback(currentPrerequisite) : currentPrerequisite),
        ),
    );
  }

  replaceParent(prerequisite: Prerequisite, callback: (prerequisite: Prerequisite) => Prerequisite): PrerequisiteList {
    return new PrerequisiteList(
      this.prerequisites
        .map((currentPrerequisite) => (currentPrerequisite.isParent(prerequisite) ? callback(currentPrerequisite) : currentPrerequisite)),
    );
  }

  isDone(): boolean {
    return this.prerequisites.every((prerequisite) => prerequisite.hasStatus(Status.DONE));
  }

  toView(): PrerequisiteView[] {
    return this.prerequisites.map((prerequisite) => prerequisite.toView());
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
  private prerequisites: PrerequisiteList;

  constructor(
    private id: MikadoGraphId,
    private goal: Goal,
    private done: boolean,
    prerequisites: Prerequisite[] = [],
  ) {
    this.prerequisites = new PrerequisiteList(prerequisites);
  }

  static start(id: string, goal: string) {
    return new MikadoGraph(new MikadoGraphId(id), new Goal(goal), false, []);
  }

  startExperimentation(prerequisiteId: string, startedAt: Date): void {
    this.prerequisites = this.prerequisites.replace(prerequisiteId, (prerequisite) => {
      if (!prerequisite.hasStatus(Status.TODO)) {
        throw new Error('You can only start an experimentation an a todo prerequisite');
      }
      return prerequisite.start(startedAt);
    });
  }

  addPrerequisiteToMikadoGraph(prerequisiteId: string, label: string): void {
    this.prerequisites = this.prerequisites.add(Prerequisite.new(prerequisiteId, this.id.toString(), label));
  }

  addPrerequisiteToPrerequisite(prerequisiteId: string, parentId: string, label: string): void {
    this.prerequisites = this.prerequisites.replace(parentId, (prerequisite) => prerequisite.resetChildrenDone());

    this.prerequisites = this.prerequisites.add(Prerequisite.new(prerequisiteId, parentId, label));
  }

  commitChanges(prerequisiteId: string): void {
    this.prerequisites = this.prerequisites.replace(prerequisiteId, (prerequisite) => {
      if (!prerequisite.hasStatus(Status.EXPERIMENTING)) {
        throw new Error('Chances can only be committed on a experimenting prerequisite');
      }

      return prerequisite.done();
    });

    this.done = this.prerequisites.isDone();

    const prerequisite = this.prerequisites.find((p) => p.identifyBy(prerequisiteId));
    const childrenPrerequisiteUnDone = this.prerequisites.find((p) => p.hasParent(prerequisite) && !p.hasStatus(Status.DONE));
    if (!childrenPrerequisiteUnDone) {
      this.prerequisites = this.prerequisites.replaceParent(prerequisite, (p) => p.childrenDone());
    }
  }

  toView(): MikadoGraphView {
    return {
      mikadoGraphId: this.id.toString(),
      goal: this.goal.toString(),
      done: this.done,
      prerequisites: this.prerequisites.toView(),
    };
  }

  identifyBy(id: string): boolean {
    return this.id.equals(new MikadoGraphId(id));
  }

  equals(mikadoGraph: MikadoGraph): boolean {
    return this.id.equals(mikadoGraph.id);
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
  return mikakoGraph.toView();
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
