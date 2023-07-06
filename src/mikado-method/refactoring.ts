
// eslint-disable-next-line max-classes-per-file
export class Refactoring {
    constructor(private id: string) {
    }

    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
    identifyBy(id: string): boolean {
        return id === this.id
    }
}

export interface Refactorings {
    get(id: string): Refactoring
    add(refactoring: Refactoring): void
}

export class InMemoryRefactorings implements Refactorings {
    constructor(private refactorings: Refactoring[] = []) {}

    get(id: string): Refactoring {
        return this.refactorings
            .filter(refactoring => refactoring.identifyBy(id))[0];
    }

    add(refactoring: Refactoring): void {
        this.refactorings = [...this.refactorings, refactoring]
    }
}

export type StartRefactoringProps = {
    refactoringId: string
}

export const startRefactoring = (refactorings: Refactorings) => (startRefactoringProps: StartRefactoringProps) => {
    refactorings.add(new Refactoring(startRefactoringProps.refactoringId))
};
