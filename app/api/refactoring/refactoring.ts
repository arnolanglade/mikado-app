export class Label {
  constructor(private label: string) {
    if (label === '') {
      throw new Error('The label cannot be empty');
    }
  }
}

export enum Status {
  TODO,
}

export class Prerequisite {
  constructor(
    private prerequisiteId: string,
    private label: Label,
    private status: Status,
  ) {
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
export type RefactoringGraph = {
  id: string,
  goal: string,
  prerequisites: Prerequisite[],
};

export class Refactoring {
  constructor(
    private id: string,
    private goal: Goal,
    private prerequisites: Prerequisite[] = [],
  ) {}

  static start(id: string, goal: string) {
    return new Refactoring(id, new Goal(goal), []);
  }

  identifyBy(id: string): boolean {
    return id === this.id;
  }

  equals(refactoring: Refactoring): boolean {
    return refactoring.id === this.id;
  }

  addPrerequisite(prerequisiteId: string, label: string) {
    this.prerequisites = [...this.prerequisites, new Prerequisite(prerequisiteId, new Label(label), Status.TODO)];
  }

  render(): RefactoringGraph {
    return {
      id: this.id,
      goal: this.goal.toString(),
      prerequisites: this.prerequisites,
    };
  }
}

export class UnknownRefactoring extends Error {
  static fromId(id: string) {
    return new UnknownRefactoring(`The refactoring with the id ${id} does not exist`);
  }
}

// Todo: Export for the frontend, do we need to duplicate?
export interface Refactorings {
  get(id: string): Promise<Refactoring>
  add(refactoring: Refactoring): Promise<void>
}

export class InMemoryRefactorings implements Refactorings {
  constructor(private refactorings: Refactoring[] = []) {}

  async get(id: string): Promise<Refactoring> {
    const matchingRefactoring = this.refactorings
      .filter((refactoring) => refactoring.identifyBy(id));

    if (matchingRefactoring.length !== 1) {
      throw UnknownRefactoring.fromId(id);
    }

    return matchingRefactoring[0];
  }

  async add(refactoring: Refactoring): Promise<void> {
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
  await refactorings.add(Refactoring.start(input.refactoringId, input.goal));
};

export const startRefactoring = handleStartRefactoring(inMemoryRefactoring);

export type AddPrerequisiteToRefactoring = {
  prerequisiteId: string
  refactoringId: string
  label: string
};

export const handleAddPrerequisiteToRefactoring = (refactorings: Refactorings) => async (input: AddPrerequisiteToRefactoring) => {
  const refactoring = await refactorings.get(input.refactoringId);
  refactoring.addPrerequisite(input.prerequisiteId, input.label);
  await refactorings.add(refactoring);
};

export const addPrerequisiteToRefactoring = handleAddPrerequisiteToRefactoring(inMemoryRefactoring);

export const handleGetRefactoringById = (refactorings: Refactorings) => async (refactoringId: string): Promise<RefactoringGraph> => {
  const refactoring = await refactorings.get(refactoringId);
  return refactoring.render();
};

export const getRefactoringById = handleGetRefactoringById(inMemoryRefactoring);
