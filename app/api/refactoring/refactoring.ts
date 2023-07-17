export type Prerequisite = {
  label: string
};

export class Goal {
  constructor(private goal: string) {
    if (goal === '') {
      throw new Error('The label goal cannot be empty');
    }
  }

  toString() {
    return this.goal;
  }
}

type RefactoringGraph = {
  id: string,
  goal: string,
  prerequisites: Prerequisite[],
};

export class Refactoring {
  constructor(
    public readonly id: string,
    private goal: Goal,
    private prerequisites: Prerequisite[] = [],
  ) {}

  static start(id: string, goal: string) {
    return new Refactoring(id, new Goal(goal), []);
  }

  identifyBy(id: string): boolean {
    return id === this.id;
  }

  addPrerequisite(label: string) {
    this.prerequisites = [...this.prerequisites, { label: 'Change that' }];
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
    this.refactorings = this.refactorings.map((currentRefactoring) => {
      if (currentRefactoring.identifyBy(refactoring.id)) {
        return refactoring;
      }
      return currentRefactoring;
    });
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

export type AddPrerequisiteToRefactoring = {
  refactoringId: string
  prerequisite: string
};

export const handleAddPrerequisiteToRefactoring = (refactorings: Refactorings) => async (input: AddPrerequisiteToRefactoring) => {
  const refactoring = await refactorings.get(input.refactoringId);
  refactoring.addPrerequisite(input.prerequisite);
  refactorings.add(refactoring);
};

export const startRefactoring = handleStartRefactoring(inMemoryRefactoring);

export const handleGetRefactoringById = (refactorings: Refactorings) => async (refactoringId: string): Promise<RefactoringGraph> => {
  const refactoring = await refactorings.get(refactoringId);
  return refactoring.render();
};

export const getRefactoringById = handleGetRefactoringById(inMemoryRefactoring);
