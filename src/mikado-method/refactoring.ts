
// eslint-disable-next-line max-classes-per-file
export class Refactoring {
    constructor(private id: string) {
    }

    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
    identifyBy(id: string): boolean {
        return id === this.id
    }
}

export class UnknownRefactoring extends Error {
    static fromId(id: string) {
        return new UnknownRefactoring(`The refactoring with the id ${id} does not exist`)
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
            .filter(refactoring => refactoring.identifyBy(id));

        if (matchingRefactoring.length !== 1) {
            throw UnknownRefactoring.fromId(id)
        }

        return matchingRefactoring[0]
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
