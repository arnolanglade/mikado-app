import {InMemoryRefactorings, Refactoring, startRefactoring, UnknownRefactoring} from '@/mikado-method/refactoring';

const aRefactoring = (state: {id: string}) => new Refactoring(state.id)

describe('Refactoring', () => {
  it('starts a refactoring', () => {
    const refactorings = new InMemoryRefactorings();
    startRefactoring(refactorings)({refactoringId: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784'})

    expect(refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
        .toEqual(aRefactoring({id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784'}));
  });
});

describe('Refactoring', () => {
  describe('identifyBy', () => {
    it('says yes if the given id match the refactoring id', () => {
      const refactoring = aRefactoring({id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784'});

      expect(refactoring.identifyBy('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
          .toEqual(true);
    });

    it('says no if the given id does not match the refactoring id', () => {
      const refactoring = aRefactoring({id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784'});

      expect(refactoring.identifyBy('c2e2ddf8-534b-4080-b47c-0f4536b54cae'))
          .toEqual(false);
    });
  });
});

describe('Refactorings', () => {
  it('persists a refactoring', () => {
    const refactorings = new InMemoryRefactorings();

    refactorings.add(aRefactoring({id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784'}))

    expect(refactorings.get('51bb1ce3-d1cf-4d32-9d10-8eea626f4784'))
        .toEqual(aRefactoring({id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784'}));
  });

  it('raises an error if the given id does not match an existing refactoring', () => {
    const refactorings = new InMemoryRefactorings([aRefactoring({id: '51bb1ce3-d1cf-4d32-9d10-8eea626f4784'})]);


    expect(() => refactorings.get('c2e2ddf8-534b-4080-b47c-0f4536b54cae'))
        .toThrow(new UnknownRefactoring('The refactoring with the id c2e2ddf8-534b-4080-b47c-0f4536b54cae does not exist'));
  });
});
