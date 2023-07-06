
// eslint-disable-next-line max-classes-per-file
export class Refactoring {
    constructor(private id: string) {
    }
}

export interface Refactorings {
    get(id: string): Refactoring
    add(): void
}

export class InMemoryRefactorings implements Refactorings {
    // eslint-disable-next-line class-methods-use-this
    add(): void {
    }

    // eslint-disable-next-line class-methods-use-this
    get(id: string): Refactoring {
        return new Refactoring(id);
    }
}

export type StartRefactoringProps = {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const startRefactoring = (refactoring: Refactorings) => (startRefactoringProps: StartRefactoringProps) => {

};
