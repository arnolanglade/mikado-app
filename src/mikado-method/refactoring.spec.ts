import {InMemoryRefactorings, Refactoring, startRefactoring} from '@/mikado-method/refactoring';

describe('Refactoring', () => {
  it('starts a refactoring', () => {
    const refactorings = new InMemoryRefactorings();
    startRefactoring(refactorings)(new Refactoring('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))

    expect(refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
        .toEqual(new Refactoring('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'));
  });
});

describe('Refactoring', () => {
  describe('identifyBy', () => {
    it('says yes if the given id match the refactoring id', () => {
      const refactoring = new Refactoring('51bb1ce3-d1cf-4d32-9d10-8eea626f4784');

      expect(refactoring.identifyBy('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
          .toEqual(true);
    });

    it('says no if the given id match the refactoring id', () => {
      const refactoring = new Refactoring('51bb1ce3-d1cf-4d32-9d10-8eea626f4784');

      expect(refactoring.identifyBy('c2e2ddf8-534b-4080-b47c-0f4536b54cae'))
          .toEqual(false);
    });
  });
});

describe('Refactorings', () => {
  it('persists a refactoring', () => {
    const refactorings = new InMemoryRefactorings();

    refactorings.add(new Refactoring('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))

    expect(refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
        .toEqual(new Refactoring('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'));
  });
});
