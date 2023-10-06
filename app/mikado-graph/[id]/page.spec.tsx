import { render, screen } from '@testing-library/react';
import { aMikadoGraph, aRouter, createWrapper } from '@/test/test-utils';
import MikadoGraphPage from '@/mikado-graph/[id]/page';
import { inMemoryMikadoGraphs } from '@/api/mikado-graph/mikako-graph';

describe('MikadoGraphPage Page', () => {
  test('The developer sees the mikado graph thanks to its id', async () => {
    await inMemoryMikadoGraphs.add(aMikadoGraph({
      mikadoGraphId: '86be6200-1303-48dc-9403-fe497186a0e4',
      goal: 'Refactor this method',
    }));

    render(await MikadoGraphPage({ params: { id: '86be6200-1303-48dc-9403-fe497186a0e4' } }), {
      wrapper: createWrapper(
        {
          useRouter: aRouter(),
        },
      ),
    });

    expect(screen.getByText('Refactor this method')).toBeInTheDocument();
  });
});
