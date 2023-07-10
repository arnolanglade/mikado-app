// eslint-disable-next-line max-classes-per-file
export class Prerequisite {}

export class Goal {
  constructor(private goal: string) {
    if (goal === '') {
      throw new Error('The label goal cannot be empty');
    }
  }
}

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
}

export class UnknownRefactoring extends Error {
  static fromId(id: string) {
    return new UnknownRefactoring(`The refactoring with the id ${id} does not exist`);
  }
}

export interface Refactorings {
  get(id: string): Refactoring
  add(refactoring: Refactoring): void
}

export class InMemoryRefactorings implements Refactorings {
  constructor(private refactorings: Refactoring[] = []) {}

  get(id: string): Refactoring {
    const matchingRefactoring = this.refactorings
      .filter((refactoring) => refactoring.identifyBy(id));

    if (matchingRefactoring.length !== 1) {
      throw UnknownRefactoring.fromId(id);
    }

    return matchingRefactoring[0];
  }

  add(refactoring: Refactoring): void {
    this.refactorings = [...this.refactorings, refactoring];
  }
}

export type StartRefactoringProps = {
  refactoringId: string
  goal: string
};

export const startRefactoring = (refactorings: Refactorings) => (startRefactoringProps: StartRefactoringProps) => {
  refactorings.add(Refactoring.start(startRefactoringProps.refactoringId, startRefactoringProps.goal));
};
