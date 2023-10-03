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
};

export class Prerequisite {
  constructor(
    private prerequisiteId: string,
    private label: Label,
    private status: Status,
    private parentId: string,
    private startedAt?: Date,
  ) {
  }

  static new(
    prerequisiteId: string,
    parentId: string,
    label: string,
  ) {
    return new Prerequisite(prerequisiteId, new Label(label), Status.TODO, parentId);
  }

  start(startedAt: Date): Prerequisite {
    return new Prerequisite(
      this.prerequisiteId,
      this.label,
      Status.EXPERIMENTING,
      this.parentId,
      startedAt,
    );
  }

  done(): Prerequisite {
    return new Prerequisite(
      this.prerequisiteId,
      this.label,
      Status.DONE,
      this.parentId,
      this.startedAt,
    );
  }

  identifyBy(prerequisiteId: string): boolean {
    return prerequisiteId === this.prerequisiteId;
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
  refactoringId: string
  goal: string
  done: boolean
  prerequisites: PrerequisiteView[]
};

export class MikakoGraph {
  constructor(
    private id: string,
    private goal: Goal,
    private done: boolean,
    private prerequisites: Prerequisite[] = [],
  ) {}

  static start(id: string, goal: string) {
    return new MikakoGraph(id, new Goal(goal), false, []);
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

  addPrerequisiteToRefactoring(prerequisiteId: string, label: string): void {
    this.prerequisites = [...this.prerequisites, Prerequisite.new(prerequisiteId, this.id, label)];
  }

  addPrerequisiteToPrerequisite(prerequisiteId: string, parentId: string, label: string): void {
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

    this.done = done;
  }

  render(): MikadoGraphView {
    return {
      refactoringId: this.id,
      goal: this.goal.toString(),
      done: this.done,
      prerequisites: this.prerequisites.map((prerequisite) => prerequisite.render()),
    };
  }

  identifyBy(id: string): boolean {
    return id === this.id;
  }

  equals(refactoring: MikakoGraph): boolean {
    return refactoring.id === this.id;
  }
}

export class UnknownRefactoring extends Error {
  static fromId(id: string) {
    return new UnknownRefactoring(`The refactoring with the id ${id} does not exist`);
  }
}

// Todo: Export for the frontend, do we need to duplicate?
export interface Refactorings {
  get(id: string): Promise<MikakoGraph>
  add(refactoring: MikakoGraph): Promise<void>
}

export class InMemoryRefactorings implements Refactorings {
  constructor(private refactorings: MikakoGraph[] = []) {}

  async get(id: string): Promise<MikakoGraph> {
    const matchingRefactoring = this.refactorings
      .filter((refactoring) => refactoring.identifyBy(id));

    if (matchingRefactoring.length !== 1) {
      throw UnknownRefactoring.fromId(id);
    }

    return matchingRefactoring[0];
  }

  async add(refactoring: MikakoGraph): Promise<void> {
    let isRefactoringFound = false;
    this.refactorings = this.refactorings.map((currentRefactoring) => {
      if (currentRefactoring.equals(refactoring)) {
        isRefactoringFound = true;
        return refactoring;
      }
      return currentRefactoring;
    });

    if (!isRefactoringFound) {
      this.refactorings = [...this.refactorings, refactoring];
    }
  }
}

// Todo: Export for the testing purpose
export const inMemoryRefactoring = new InMemoryRefactorings();

export type StartRefactoring = {
  refactoringId: string
  goal: string
};

export const handleStartRefactoring = (refactorings: Refactorings) => async (input: StartRefactoring) => {
  await refactorings.add(MikakoGraph.start(input.refactoringId, input.goal));
};

export const startRefactoring = handleStartRefactoring(inMemoryRefactoring);

export type AddPrerequisiteToRefactoring = {
  prerequisiteId: string
  refactoringId: string
  label: string
};

export const handleAddPrerequisiteToRefactoring = (refactorings: Refactorings) => async (input: AddPrerequisiteToRefactoring) => {
  const refactoring = await refactorings.get(input.refactoringId);
  refactoring.addPrerequisiteToRefactoring(input.prerequisiteId, input.label);
  await refactorings.add(refactoring);
};

export const addPrerequisiteToRefactoring = handleAddPrerequisiteToRefactoring(inMemoryRefactoring);

export type AddPrerequisiteToPrerequisite = {
  refactoringId: string
  prerequisiteId: string
  parentId: string
  label: string
};

export const handleAddPrerequisiteToPrerequisite = (refactorings: Refactorings) => async (input: AddPrerequisiteToPrerequisite) => {
  const refactoring = await refactorings.get(input.refactoringId);
  refactoring.addPrerequisiteToPrerequisite(input.prerequisiteId, input.parentId, input.label);
  await refactorings.add(refactoring);
};

export const addPrerequisiteToPrerequisite = handleAddPrerequisiteToPrerequisite(inMemoryRefactoring);

export const handleGetRefactoringById = (refactorings: Refactorings) => async (refactoringId: string): Promise<MikadoGraphView> => {
  const refactoring = await refactorings.get(refactoringId);
  return refactoring.render();
};

export type CommitChanges = {
  refactoringId: string
  prerequisiteId: string
};

export const handleCommitChanges = (refactorings: Refactorings) => async (input: CommitChanges) => {
  const refactoring = await refactorings.get(input.refactoringId);
  refactoring.commitChanges(input.prerequisiteId);
  await refactorings.add(refactoring);
};

export const commitChanges = handleCommitChanges(inMemoryRefactoring);

export const getRefactoringById = handleGetRefactoringById(inMemoryRefactoring);

export type StartExperimentation = {
  prerequisiteId: string
  refactoringId: string
};

export const handleStartExperimentation = (refactorings: Refactorings, clock: Clock) => async (input: StartExperimentation): Promise<void> => {
  const refactoring = await refactorings.get(input.refactoringId);
  refactoring.startExperimentation(input.prerequisiteId, clock.now());
  await refactorings.add(refactoring);
};

export const startExperimentation = handleStartExperimentation(inMemoryRefactoring, new SystemClock());