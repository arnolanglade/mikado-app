'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { createWrapper } from '@/test/test-utils';
import MikadoGraph, { PrerequisiteNode, GoalNode } from '@/mikado-graph/component/mikado-graph';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { PrerequisiteData } from '@/mikado-graph/mikado-graph.usecase';

const createData = (data: Partial<PrerequisiteData>): PrerequisiteData => ({
  label: 'Do this',
  status: 'todo',
  canBeCommitted: false,
  onStartExperimentationButtonClick: () => {},
  onCommitChangesButtonClick: () => {},
  onAddPrerequisiteButtonClick: () => {},
  ...data,
});

describe('MikadoGraph', () => {
  test('The developer sees the mikado graph with its prerequisites', async () => {
    render(<MikadoGraph
      mikadoGraph={{
        nodes: [
          {
            id: uuidv4(),
            type: 'goal',
            data: { goal: 'Refactor this method', done: false, onAddPrerequisiteButtonClick: jest.fn() },
            position: { x: 0, y: 0 },
          },
          {
            id: uuidv4(),
            type: 'prerequisite',
            data: {
              label: 'Do this',
              status: 'todo',
              canBeCommitted: false,
              onStartExperimentationButtonClick: jest.fn(),
              onCommitChangesButtonClick: jest.fn(),
              onAddPrerequisiteButtonClick: jest.fn(),
            },
            position: { x: 0, y: 0 },
          },
          {
            id: uuidv4(),
            type: 'prerequisite',
            data: {
              label: 'Do that',
              status: 'todo',
              canBeCommitted: false,
              onStartExperimentationButtonClick: jest.fn(),
              onAddPrerequisiteButtonClick: jest.fn(),
              onCommitChangesButtonClick: jest.fn(),
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

  describe('GoalNode', () => {
    describe('Add prerequisite to a mikado graph', () => {
      test('The onAddPrerequisiteButtonClick callback is called when a developer clicks on the add a prerequisite button', async () => {
        const onAddPrerequisiteButtonClick = jest.fn();
        const mikadoGraphId = uuidv4();
        render(<GoalNode
          id={mikadoGraphId}
          data={{ goal: 'goal', done: false, onAddPrerequisiteButtonClick }}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.add': 'Add' },
          ),
        });

        await userEvent.click(screen.getByText('Add'));

        expect(onAddPrerequisiteButtonClick).toHaveBeenCalledWith(mikadoGraphId);
      });

      test('The add a prerequisite button is displayed while the mikado graph is not finished', async () => {
        render(<GoalNode
          id={uuidv4()}
          data={{ goal: 'goal', done: false, onAddPrerequisiteButtonClick: jest.fn() }}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.add': 'Add' },
          ),
        });

        expect(screen.getByText('Add')).toBeInTheDocument();
      });

      test('The add a prerequisite button is hidden when the mikado graph is finished', async () => {
        render(<GoalNode
          id={uuidv4()}
          data={{ goal: 'goal', done: true, onAddPrerequisiteButtonClick: jest.fn() }}
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
        render(<GoalNode
          id={uuidv4()}
          data={{ goal: 'goal', done: true, onAddPrerequisiteButtonClick: jest.fn() }}
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
        render(<GoalNode
          id={uuidv4()}
          data={{ goal: 'goal', done: false, onAddPrerequisiteButtonClick: jest.fn() }}
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
          data={createData({
            status: 'todo',
            onStartExperimentationButtonClick: onStartExperimentation,
          })}
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
        'experimenting',
        'done',
      ])('The start experimentation button is hidden for a %s prerequisite', async (status) => {
        render(<PrerequisiteNode
          id={uuidv4()}
          data={createData({
            status: (status as 'done' | 'experimenting'),
          })}
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
      test('The onAddPrerequisiteButtonClick callback is called when a developer clicks on the add a prerequisite button', async () => {
        const onAddPrerequisiteButtonClick = jest.fn();
        const prerequisiteId = uuidv4();
        render(<PrerequisiteNode
          id={prerequisiteId}
          data={createData({
            status: 'experimenting',
            onAddPrerequisiteButtonClick,
          })}
        />, {
          wrapper: createWrapper({}, {
            'prerequisite.add': 'Add prerequisite',
          }),
        });

        await userEvent.click(screen.getByText('Add prerequisite'));

        expect(onAddPrerequisiteButtonClick).toHaveBeenCalledWith(prerequisiteId);
      });

      test.each([
        'todo',
        'done',
      ])('The start add prerequisite form is hidden for a %s prerequisite', async (status) => {
        render(
          <PrerequisiteNode
            id={uuidv4()}
            data={createData({
              status: (status as 'done' | 'todo'),
            })}
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
          data={createData({
            status: 'experimenting',
            canBeCommitted: true,
            onCommitChangesButtonClick: commitChanges,
          })}
        />, {
          wrapper: createWrapper({ }, {
            'prerequisite.commit-changes': 'Commit changes',
          }),
        });

        await userEvent.click(screen.getByText('Commit changes'));

        expect(commitChanges).toHaveBeenCalled();
      });

      test.each([
        'todo',
        'done',
      ])('The start commit changes button is hidden for a %s prerequisite', async (status) => {
        render(
          <PrerequisiteNode
            id={uuidv4()}
            data={createData({
              status: (status as 'done' | 'todo'),
            })}
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
            data={createData({
              status: 'experimenting',
              canBeCommitted: false,
            })}
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
          data={createData({
            status: 'done',
          })}
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
        'todo',
        'experimenting',
      ])('The "done" notice is hidden when the prerequisite status is "%s"', async (status) => {
        render(<PrerequisiteNode
          id={uuidv4()}
          data={createData({
            status: (status as 'todo' | 'experimenting'),
          })}
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
