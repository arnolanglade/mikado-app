'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { aPrerequisiteGraph, aRefactoringGraph, createWrapper } from '@/test/test-utils';
import { PrerequisiteNode, RefactoringNode } from '@/refactoring/component/refactoring-dashboard';
import { Status } from '@/api/refactoring/refactoring';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { Mock } from 'jest-mock';

describe('RefactoringDashboard', () => {
  describe('RefactoringNode', () => {
    describe('Add prerequisite to a refactoring', () => {
      test('The onAddPrerequisite callback is called when a developer add a prerequisite to a refactoring', async () => {
        const addPrerequisiteToRefactoring = jest.fn();
        const refactoringId = uuidv4();
        const label = 'Refactor method';
        render(<RefactoringNode
          refactoring={aRefactoringGraph({ refactoringId, prerequisites: [] })}
          addPrerequisiteToRefactoring={addPrerequisiteToRefactoring}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.add"': 'Add prerequisite' },
          ),
        });

        await userEvent.type(screen.getByRole('textbox'), label);
        await userEvent.click(screen.getByText('Add prerequisite'));

        expect(addPrerequisiteToRefactoring).toHaveBeenCalledWith(label);
      });

      test('The prerequisite addition form is displayed while the refactoring is not finished', async () => {
        render(<RefactoringNode
          refactoring={aRefactoringGraph({ done: false })}
          addPrerequisiteToRefactoring={jest.fn()}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.add': 'Add prerequisite' },
          ),
        });

        expect(screen.getByText('Add prerequisite')).toBeInTheDocument();
      });

      test('The prerequisite addition form is hidden when the refactoring is finished', async () => {
        render(<RefactoringNode
          refactoring={aRefactoringGraph({ done: true })}
          addPrerequisiteToRefactoring={jest.fn()}
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
      test('A "done" notice is displayed when the refactoring is done', async () => {
        render(<RefactoringNode
          refactoring={aRefactoringGraph({ done: true })}
          addPrerequisiteToRefactoring={jest.fn()}
        />, {
          wrapper: createWrapper(),
        });

        expect(
          screen.getByText((content) => content.includes('Done')),
        ).toBeInTheDocument();
      });

      test('A "done" notice is hidden when the refactoring is a WIP', async () => {
        render(<RefactoringNode
          refactoring={aRefactoringGraph({ done: false })}
          addPrerequisiteToRefactoring={jest.fn()}
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
        const onStartExperimentation: Mock<() => () => void> = jest.fn();
        const prerequisiteId = uuidv4();
        render(<PrerequisiteNode
          prerequisite={aPrerequisiteGraph({ prerequisiteId, status: Status.TODO })}
          startExperimentation={onStartExperimentation}
          addPrerequisiteToPrerequisite={() => jest.fn()}
          commitChanges={() => jest.fn()}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.start-experimentation': 'Start experimentation' },
          ),
        });

        await userEvent.click(screen.getByText('Start experimentation'));

        expect(onStartExperimentation).toHaveBeenCalledWith(prerequisiteId);
      });

      test.each([
        Status.EXPERIMENTING,
        Status.DONE,
      ])('The start experimentation button is hidden for a %s prerequisite', async (status: Status) => {
        render(<PrerequisiteNode
          prerequisite={aPrerequisiteGraph({ status })}
          startExperimentation={() => jest.fn()}
          addPrerequisiteToPrerequisite={() => jest.fn()}
          commitChanges={() => jest.fn()}
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
          prerequisite={aPrerequisiteGraph({ prerequisiteId, status: Status.EXPERIMENTING })}
          startExperimentation={() => jest.fn()}
          addPrerequisiteToPrerequisite={() => addPrerequisiteToPrerequisite}
          commitChanges={() => jest.fn()}
        />, {
          wrapper: createWrapper({}, {
            'prerequisite.add': 'Add prerequisite',
          }),
        });

        await userEvent.type(screen.getByRole('textbox'), label);
        await userEvent.click(screen.getByText('Add prerequisite'));

        expect(addPrerequisiteToPrerequisite).toHaveBeenCalledWith(label);
      });

      test.each([
        Status.TODO,
        Status.DONE,
      ])('The start add prerequisite form is hidden for a %s prerequisite', async (status: Status) => {
        render(
          <PrerequisiteNode
            prerequisite={aPrerequisiteGraph({ status })}
            startExperimentation={() => jest.fn()}
            addPrerequisiteToPrerequisite={() => jest.fn()}
            commitChanges={() => jest.fn()}
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
        const commitChanges: Mock<() => () => void> = jest.fn();
        const prerequisiteId = uuidv4();
        render(<PrerequisiteNode
          prerequisite={aPrerequisiteGraph({ prerequisiteId, status: Status.EXPERIMENTING })}
          startExperimentation={() => jest.fn()}
          addPrerequisiteToPrerequisite={() => jest.fn()}
          commitChanges={commitChanges}
        />, {
          wrapper: createWrapper({ }, {
            'prerequisite.commit-changes': 'Commit changes',
          }),
        });

        await userEvent.click(screen.getByText('Commit changes'));

        expect(commitChanges).toHaveBeenCalledWith(prerequisiteId);
      });

      test.each([
        Status.TODO,
        Status.DONE,
      ])('The start commit changes button is hidden for a %s prerequisite', async (status: Status) => {
        render(
          <PrerequisiteNode
            prerequisite={aPrerequisiteGraph({ status })}
            startExperimentation={() => jest.fn()}
            addPrerequisiteToPrerequisite={() => jest.fn()}
            commitChanges={() => jest.fn()}
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
          prerequisite={aPrerequisiteGraph({ status: Status.DONE })}
          startExperimentation={() => jest.fn()}
          addPrerequisiteToPrerequisite={() => jest.fn()}
          commitChanges={() => jest.fn()}
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
        Status.TODO,
        Status.EXPERIMENTING,
      ])('The "done" notice is hidden when the prerequisite status is "%s"', async (status: Status) => {
        render(<PrerequisiteNode
          prerequisite={aPrerequisiteGraph({ status })}
          startExperimentation={() => jest.fn()}
          addPrerequisiteToPrerequisite={() => jest.fn()}
          commitChanges={() => jest.fn()}
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
