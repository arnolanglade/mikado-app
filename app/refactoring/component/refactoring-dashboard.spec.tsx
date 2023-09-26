'use client';

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { aRefactoringGraph, createWrapper } from '@/test/test-utils';
import RefactoringDashboard from '@/refactoring/component/refactoring-dashboard';
import { Status } from '@/api/refactoring/refactoring';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

describe('RefactoringDashboard', () => {
  describe('RefactoringNode', () => {
    describe('add prerequisite to a refactoring', () => {
      test('The onAddPrerequisite callback is called when a developer add a prerequisite to a refactoring', async () => {
        const onAddPrerequisiteToRefactoring = jest.fn();
        const refactoringId = uuidv4();
        const label = 'Refactor method';
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({ refactoringId, prerequisites: [] })}
          onStartExperimentation={jest.fn()}
          onAddPrerequisiteToRefactoring={onAddPrerequisiteToRefactoring}
          onAddPrerequisiteToPrerequisite={jest.fn()}
          onCommitChanges={jest.fn()}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.add"': 'Add prerequisite' },
          ),
        });

        await userEvent.type(within(screen.getByTestId('refactoring')).getByRole('textbox'), label);
        await userEvent.click(screen.getByText('Add prerequisite'));

        expect(onAddPrerequisiteToRefactoring).toHaveBeenCalledWith(refactoringId, label);
      });

      test('The prerequisite addition form is displayed while the refactoring is not finished', async () => {
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({
            done: false,
          })}
          onStartExperimentation={jest.fn()}
          onAddPrerequisiteToRefactoring={jest.fn()}
          onAddPrerequisiteToPrerequisite={jest.fn()}
          onCommitChanges={jest.fn()}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.add': 'Add prerequisite' },
          ),
        });

        expect(screen.getByText('Add prerequisite')).toBeInTheDocument();
      });

      test('The prerequisite addition form is hidden when the refactoring is finished', async () => {
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({
            done: true,
          })}
          onStartExperimentation={jest.fn()}
          onAddPrerequisiteToRefactoring={jest.fn()}
          onAddPrerequisiteToPrerequisite={jest.fn()}
          onCommitChanges={jest.fn()}
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
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({
            done: true,
          })}
          onStartExperimentation={jest.fn()}
          onAddPrerequisiteToRefactoring={jest.fn()}
          onAddPrerequisiteToPrerequisite={jest.fn()}
          onCommitChanges={jest.fn()}
        />, {
          wrapper: createWrapper(),
        });

        expect(
          within(
            screen.getByTestId('refactoring'),
          ).getByText((content) => content.includes('Done')),
        ).toBeInTheDocument();
      });

      test('A "done" notice is hidden when the refactoring is a WIP', async () => {
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({
            done: false,
          })}
          onStartExperimentation={jest.fn()}
          onAddPrerequisiteToRefactoring={jest.fn()}
          onAddPrerequisiteToPrerequisite={jest.fn()}
          onCommitChanges={jest.fn()}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.done': 'Done' },
          ),
        });

        expect(
          within(
            screen.getByTestId('refactoring'),
          ).queryByText((content) => content.includes('Done')),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('PrerequisiteNode', () => {
    describe('start experimentation', () => {
      test('The onStartExperimentation callback is called when a developer starts an experimentation', async () => {
        const onStartExperimentation = jest.fn();
        const refactoringId = uuidv4();
        const prerequisiteId = uuidv4();
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({
            refactoringId,
            prerequisites: [
              { prerequisiteId, status: Status.TODO },
            ],
          })}
          onStartExperimentation={onStartExperimentation}
          onAddPrerequisiteToRefactoring={jest.fn()}
          onAddPrerequisiteToPrerequisite={jest.fn()}
          onCommitChanges={jest.fn()}
        />, {
          wrapper: createWrapper(
            {},
            { 'prerequisite.start-experimentation': 'Start experimentation' },
          ),
        });

        await userEvent.click(screen.getByText('Start experimentation'));

        expect(onStartExperimentation).toHaveBeenCalledWith(refactoringId, prerequisiteId);
      });

      test.each([
        Status.EXPERIMENTING,
        Status.DONE,
      ])('The start experimentation button is hidden for a %s prerequisite', async (status: Status) => {
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({
            prerequisites: [{ status }],
          })}
          onStartExperimentation={jest.fn()}
          onAddPrerequisiteToRefactoring={jest.fn()}
          onAddPrerequisiteToPrerequisite={jest.fn()}
          onCommitChanges={jest.fn()}
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
        const refactoringId = uuidv4();
        const prerequisiteId = uuidv4();
        const label = 'Change that';
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({
            refactoringId,
            prerequisites: [
              { prerequisiteId, status: Status.EXPERIMENTING },
            ],
          })}
          onStartExperimentation={jest.fn()}
          onAddPrerequisiteToRefactoring={jest.fn()}
          onAddPrerequisiteToPrerequisite={addPrerequisiteToPrerequisite}
          onCommitChanges={jest.fn()}
        />, {
          wrapper: createWrapper(
            { },
            {
              'prerequisite.add': 'Add prerequisite',
            },
          ),
        });

        await userEvent.type(within(screen.getByTestId('prerequisites')).getByRole('textbox'), label);
        await userEvent.click(within(screen.getByTestId('prerequisites')).getByText('Add prerequisite'));

        expect(addPrerequisiteToPrerequisite).toHaveBeenCalledWith(refactoringId, prerequisiteId, label);
      });

      test.each([
        Status.TODO,
        Status.DONE,
      ])('The start add prerequisite form is hidden for a %s prerequisite', async (status: Status) => {
        render(
          <RefactoringDashboard
            refactoring={aRefactoringGraph({ prerequisites: [{ status }] })}
            onStartExperimentation={jest.fn()}
            onAddPrerequisiteToRefactoring={jest.fn()}
            onAddPrerequisiteToPrerequisite={jest.fn()}
            onCommitChanges={jest.fn()}
          />,
          {
            wrapper: createWrapper(
              {},
              { 'prerequisite.add': 'Add prerequisite' },
            ),
          },
        );

        expect(within(screen.getByTestId('prerequisites')).queryByText('Add prerequisite')).not.toBeInTheDocument();
      });
    });

    describe('commit changes', () => {
      test('The commitChanges callback is called when a developer commit changes', async () => {
        const commitChanges = jest.fn();
        const refactoringId = uuidv4();
        const prerequisiteId = uuidv4();
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({
            refactoringId,
            prerequisites: [
              { prerequisiteId, status: Status.EXPERIMENTING },
            ],
          })}
          onStartExperimentation={jest.fn()}
          onAddPrerequisiteToRefactoring={jest.fn()}
          onAddPrerequisiteToPrerequisite={jest.fn()}
          onCommitChanges={commitChanges}
        />, {
          wrapper: createWrapper(
            { },
            { 'prerequisite.commit-changes': 'Commit changes' },
          ),
        });

        await userEvent.click(within(screen.getByTestId('prerequisites')).getByText('Commit changes'));

        expect(commitChanges).toHaveBeenCalledWith(refactoringId, prerequisiteId);
      });

      test.each([
        Status.TODO,
        Status.DONE,
      ])('The start commit changes button is hidden for a %s prerequisite', async (status: Status) => {
        render(
          <RefactoringDashboard
            refactoring={aRefactoringGraph({ prerequisites: [{ status }] })}
            onStartExperimentation={jest.fn()}
            onAddPrerequisiteToRefactoring={jest.fn()}
            onAddPrerequisiteToPrerequisite={jest.fn()}
            onCommitChanges={jest.fn()}
          />,
          {
            wrapper: createWrapper(
              {},
              {
                'prerequisite.add': 'Add prerequisite',
                'prerequisite.commit-changes': 'Commit changes',
              },
            ),
          },
        );

        expect(within(screen.getByTestId('prerequisites')).queryByText('Commit changes')).not.toBeInTheDocument();
      });
    });

    describe('"done" notice', () => {
      test('A "done" notice is displayed when the prerequisite is done', async () => {
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({
            refactoringId: uuidv4(),
            prerequisites: [{ status: Status.DONE }],
          })}
          onStartExperimentation={jest.fn()}
          onAddPrerequisiteToRefactoring={jest.fn()}
          onAddPrerequisiteToPrerequisite={jest.fn()}
          onCommitChanges={jest.fn()}
        />, {
          wrapper: createWrapper(
            { },
            { 'prerequisite.done': 'Done' },
          ),
        });

        expect(
          within(
            screen.getByTestId('prerequisites'),
          ).getByText((content) => content.includes('Done')),
        ).toBeInTheDocument();
      });

      test.each([
        Status.TODO,
        Status.EXPERIMENTING,
      ])('The "done" notice is hidden when the prerequisite status is "%s"', async (status: Status) => {
        render(<RefactoringDashboard
          refactoring={aRefactoringGraph({
            refactoringId: uuidv4(),
            prerequisites: [{ status }],
          })}
          onStartExperimentation={jest.fn()}
          onAddPrerequisiteToRefactoring={jest.fn()}
          onAddPrerequisiteToPrerequisite={jest.fn()}
          onCommitChanges={jest.fn()}
        />, {
          wrapper: createWrapper(
            { },
            { 'prerequisite.done': 'Done' },
          ),
        });

        expect(
          within(
            screen.getByTestId('prerequisites'),
          ).queryByText((content) => content.includes('Done')),
        ).not.toBeInTheDocument();
      });
    });
  });
});
