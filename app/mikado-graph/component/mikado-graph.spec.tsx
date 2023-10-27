'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { createWrapper } from '@/test/test-utils';
import MikadoGraph, { PrerequisiteNode, MikadoGraphNode } from '@/mikado-graph/component/mikado-graph';
import { StatusView } from '@/api/mikado-graph/mikado-graph';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

describe('MikadoGraph', () => {
  test('The developer sees the mikado graph with its prerequisites', async () => {
    render(<MikadoGraph
      mikadoGraph={{
        nodes: [
          {
            id: uuidv4(),
            type: 'mikadoGraph',
            data: { goal: 'Refactor this method', done: false, addPrerequisiteToMikadoGraph: jest.fn() },
            position: { x: 0, y: 0 },
          },
          {
            id: uuidv4(),
            type: 'prerequisite',
            data: {
              label: 'Do this',
              status: StatusView.TODO,
              canBeCommitted: false,
              startExperimentation: jest.fn(),
              addPrerequisiteToPrerequisite: jest.fn(),
              commitChanges: jest.fn(),
            },
            position: { x: 0, y: 0 },
          },
          {
            id: uuidv4(),
            type: 'prerequisite',
            data: {
              label: 'Do that',
              status: StatusView.TODO,
              canBeCommitted: false,
              startExperimentation: jest.fn(),
              addPrerequisiteToPrerequisite: jest.fn(),
              commitChanges: jest.fn(),
            },
            position: { x: 0, y: 0 },
          },

        ],
        edges: [],
      }}
    />, {
      wrapper: createWrapper(
        {},
        { 'prerequisite.start-experimentation': 'Start experimentation' },
      ),
    });

    expect(screen.getByText((content) => content.includes('Refactor this method'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Do this'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Do that'))).toBeInTheDocument();
  });

  describe('MikadoGraphNode', () => {
    describe('Add prerequisite to a mikado graph', () => {
      test('The onAddPrerequisite callback is called when a developer add a prerequisite to a mikado graph', async () => {
        const addPrerequisiteToMikadoGraph = jest.fn();
        const label = 'Refactor method';
        render(<MikadoGraphNode
          data={{ goal: 'goal', done: false, addPrerequisiteToMikadoGraph }}
        />, {
          wrapper: createWrapper(
            {},
            { 'add"': 'Add' },
          ),
        });

        await userEvent.type(screen.getByRole('textbox'), label);
        await userEvent.click(screen.getByText('Add'));

        expect(addPrerequisiteToMikadoGraph).toHaveBeenCalledWith(label);
      });

      test('The prerequisite addition form is displayed while the mikado graph is not finished', async () => {
        render(<MikadoGraphNode
          data={{ goal: 'goal', done: false, addPrerequisiteToMikadoGraph: jest.fn() }}
        />, {
          wrapper: createWrapper(
            {},
            { add: 'Add' },
          ),
        });

        expect(screen.getByText('Add')).toBeInTheDocument();
      });

      test('The prerequisite addition form is hidden when the mikado graph is finished', async () => {
        render(<MikadoGraphNode
          data={{ goal: 'goal', done: true, addPrerequisiteToMikadoGraph: jest.fn() }}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.add': 'Add prerequisite' },
          ),
        });

        expect(screen.queryByText('Add prerequisite')).not.toBeInTheDocument();
      });
    });

    describe('"done" notice', () => {
      test('A "done" notice is displayed when the mikado graph is done', async () => {
        render(<MikadoGraphNode
          data={{ goal: 'goal', done: true, addPrerequisiteToMikadoGraph: jest.fn() }}
        />, {
          wrapper: createWrapper({}, {
            'mikado-graph.done': 'Done',
          }),
        });

        expect(
          screen.getByText((content) => content.includes('Done')),
        ).toBeInTheDocument();
      });

      test('A "done" notice is hidden when the mikado graph is a WIP', async () => {
        render(<MikadoGraphNode
          data={{ goal: 'goal', done: false, addPrerequisiteToMikadoGraph: jest.fn() }}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.done': 'Done' },
          ),
        });

        expect(
          screen.queryByText((content) => content.includes('Done')),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('PrerequisiteNode', () => {
    describe('start experimentation', () => {
      test('The onStartExperimentation callback is called when a developer starts an experimentation', async () => {
        const onStartExperimentation = jest.fn();
        const prerequisiteId = uuidv4();
        render(<PrerequisiteNode
          id={prerequisiteId}
          data={{
            label: 'Do this',
            status: StatusView.TODO,
            canBeCommitted: false,
            startExperimentation: onStartExperimentation,
            addPrerequisiteToPrerequisite: jest.fn(),
            commitChanges: jest.fn(),
          }}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.start-experimentation': 'Start experimentation' },
          ),
        });

        await userEvent.click(screen.getByText('Start experimentation'));

        expect(onStartExperimentation).toHaveBeenCalled();
      });

      test.each([
        StatusView.EXPERIMENTING,
        StatusView.DONE,
      ])('The start experimentation button is hidden for a %s prerequisite', async (status: StatusView) => {
        render(<PrerequisiteNode
          id={uuidv4()}
          data={{
            label: 'Do this',
            status,
            canBeCommitted: false,
            startExperimentation: () => jest.fn(),
            addPrerequisiteToPrerequisite: () => jest.fn(),
            commitChanges: () => jest.fn(),
          }}
        />, {
          wrapper: createWrapper(
            {},
            {
              'prerequisite.start-experimentation': 'Start experimentation',
            },
          ),
        });

        expect(screen.queryByText('Start experimentation')).not.toBeInTheDocument();
      });
    });

    describe('add prerequisite to prerequisite', () => {
      test('The addPrerequisiteToPrerequisite callback is called when a developer adds a prerequisite to an existing one', async () => {
        const addPrerequisiteToPrerequisite = jest.fn();
        const prerequisiteId = uuidv4();
        const label = 'Change that';
        render(<PrerequisiteNode
          id={prerequisiteId}
          data={{
            label: 'Do this',
            status: StatusView.EXPERIMENTING,
            canBeCommitted: false,
            startExperimentation: jest.fn(),
            addPrerequisiteToPrerequisite,
            commitChanges: jest.fn(),
          }}
        />, {
          wrapper: createWrapper({}, {
            'prerequisite.add': 'Add prerequisite',
            add: 'Add',
          }),
        });

        await userEvent.click(screen.getByText('Add prerequisite'));
        await userEvent.type(screen.getByRole('textbox'), label);
        await userEvent.click(screen.getByText('Add'));

        expect(addPrerequisiteToPrerequisite).toHaveBeenCalledWith(label);
      });

      test('The commit changes and display prerequisite form buttons are hidden when the prerequisite form is display', async () => {
        render(<PrerequisiteNode
          id={uuidv4()}
          displayPrerequisiteForm={false}
          data={{
            label: 'Do this',
            status: StatusView.EXPERIMENTING,
            canBeCommitted: false,
            startExperimentation: jest.fn(),
            addPrerequisiteToPrerequisite: jest.fn(),
            commitChanges: jest.fn(),
          }}
        />, {
          wrapper: createWrapper({}, {
            'prerequisite.add': 'Add prerequisite',
            'prerequisite.commit-changes': 'Commit changes',
          }),
        });

        await userEvent.click(screen.getByText('Add prerequisite'));

        expect(screen.queryByText('Add prerequisite')).not.toBeInTheDocument();
        expect(screen.queryByText('Commit changes')).not.toBeInTheDocument();
      });

      test('The prerequisite form is hidden and the action buttons are displayed when the cancel is clicked', async () => {
        render(<PrerequisiteNode
          id={uuidv4()}
          displayPrerequisiteForm
          data={{
            label: 'Do this',
            status: StatusView.EXPERIMENTING,
            canBeCommitted: true,
            startExperimentation: jest.fn(),
            addPrerequisiteToPrerequisite: jest.fn(),
            commitChanges: jest.fn(),
          }}
        />, {
          wrapper: createWrapper({}, {
            cancel: 'Cancel',
            'prerequisite.add': 'Add prerequisite',
            'prerequisite.commit-changes': 'Commit changes',
          }),
        });

        await userEvent.click(screen.getByText('Cancel'));

        expect(screen.getByText('Add prerequisite')).toBeInTheDocument();
        expect(screen.getByText('Commit changes')).toBeInTheDocument();
      });

      test.each([
        StatusView.TODO,
        StatusView.DONE,
      ])('The start add prerequisite form is hidden for a %s prerequisite', async (status: StatusView) => {
        render(
          <PrerequisiteNode
            id={uuidv4()}
            data={{
              label: 'Do this',
              status,
              canBeCommitted: false,
              startExperimentation: () => jest.fn(),
              addPrerequisiteToPrerequisite: () => jest.fn(),
              commitChanges: () => jest.fn(),
            }}

          />,
          {
            wrapper: createWrapper({}, {
              'prerequisite.add': 'Add prerequisite',
            }),
          },
        );

        expect(screen.queryByText('Add prerequisite')).not.toBeInTheDocument();
      });
    });

    describe('commit changes', () => {
      test('The commitChanges callback is called when a developer commit changes', async () => {
        const commitChanges = jest.fn();
        const prerequisiteId = uuidv4();
        render(<PrerequisiteNode
          id={prerequisiteId}
          data={{
            label: 'Do this',
            status: StatusView.EXPERIMENTING,
            canBeCommitted: true,
            startExperimentation: jest.fn(),
            addPrerequisiteToPrerequisite: jest.fn(),
            commitChanges,
          }}
        />, {
          wrapper: createWrapper({ }, {
            'prerequisite.commit-changes': 'Commit changes',
          }),
        });

        await userEvent.click(screen.getByText('Commit changes'));

        expect(commitChanges).toHaveBeenCalled();
      });

      test.each([
        StatusView.TODO,
        StatusView.DONE,
      ])('The start commit changes button is hidden for a %s prerequisite', async (status: StatusView) => {
        render(
          <PrerequisiteNode
            id={uuidv4()}
            data={{
              label: 'Do this',
              status,
              canBeCommitted: false,
              startExperimentation: () => jest.fn(),
              addPrerequisiteToPrerequisite: () => jest.fn(),
              commitChanges: () => jest.fn(),
            }}
          />,
          {
            wrapper: createWrapper({}, {
              'prerequisite.add': 'Add prerequisite',
              'prerequisite.commit-changes': 'Commit changes',
            }),
          },
        );

        expect(screen.queryByText('Commit changes')).not.toBeInTheDocument();
      });

      test('The start commit changes button is hidden for an experimenting prerequisite that has unfinished children prerequisites', async () => {
        render(
          <PrerequisiteNode
            id={uuidv4()}
            data={{
              label: 'Do this',
              status: 'experimenting',
              canBeCommitted: false,
              startExperimentation: () => jest.fn(),
              addPrerequisiteToPrerequisite: () => jest.fn(),
              commitChanges: () => jest.fn(),
            }}
          />,
          {
            wrapper: createWrapper({}, {
              'prerequisite.add': 'Add prerequisite',
              'prerequisite.commit-changes': 'Commit changes',
            }),
          },
        );

        expect(screen.queryByText('Commit changes')).not.toBeInTheDocument();
      });
    });

    describe('"done" notice', () => {
      test('A "done" notice is displayed when the prerequisite is done', async () => {
        render(<PrerequisiteNode
          id={uuidv4()}
          data={{
            label: 'Do this',
            status: StatusView.DONE,
            canBeCommitted: false,
            startExperimentation: () => jest.fn(),
            addPrerequisiteToPrerequisite: () => jest.fn(),
            commitChanges: () => jest.fn(),
          }}
        />, {
          wrapper: createWrapper({}, {
            'prerequisite.done': 'Done',
          }),
        });

        expect(
          screen.getByText((content) => content.includes('Done')),
        ).toBeInTheDocument();
      });

      test.each([
        StatusView.TODO,
        StatusView.EXPERIMENTING,
      ])('The "done" notice is hidden when the prerequisite status is "%s"', async (status: StatusView) => {
        render(<PrerequisiteNode
          id={uuidv4()}
          data={{
            label: 'Do this',
            status,
            canBeCommitted: false,
            startExperimentation: () => jest.fn(),
            addPrerequisiteToPrerequisite: () => jest.fn(),
            commitChanges: () => jest.fn(),
          }}
        />, {
          wrapper: createWrapper(
            { },
            { 'prerequisite.done': 'Done' },
          ),
        });

        expect(
          screen.queryByText((content) => content.includes('Done')),
        ).not.toBeInTheDocument();
      });
    });
  });
});
