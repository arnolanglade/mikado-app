import { render, screen } from '@testing-library/react';
import { aRefactoring, aRouter, createWrapper } from '@/test/test-utils';
import RefactoringGraph from '@/refactoring/[id]/page';
import { inMemoryMikadoGraphs } from '@/api/refactoring/mikako-graph';

describe('RefactoringGraph Page', () => {
  test('The developer sees the refactoring graph thanks to its id', async () => {
    await inMemoryMikadoGraphs.add(aRefactoring({
      refactoringId: '86be6200-1303-48dc-9403-fe497186a0e4',
      goal: 'Refactor this method',
    }));

    render(await RefactoringGraph({ params: { id: '86be6200-1303-48dc-9403-fe497186a0e4' } }), {
      wrapper: createWrapper(
        {
          useRouter: aRouter(),
        },
      ),
    });

    expect(screen.getByText('Refactor this method')).toBeInTheDocument();
  });
});
