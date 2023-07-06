import {InMemoryRefactorings, Refactoring, startRefactoring} from '@/mikado-method/refactoring';

describe('Refactoring', () => {
  it('starts a refactoring', () => {
    const refactorings = new InMemoryRefactorings();
    startRefactoring(refactorings)(new Refactoring('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))

    expect(refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
        .toEqual(new Refactoring('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'));
  });
});
