import { container, ServiceContainerProvider } from '@/lib/service-container-context';
import { ReactElement } from 'react';
import IntlProvider from '@/lib/i18n/intl-provider';
import { jest } from '@jest/globals';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { UseNotification } from '@/lib/notification';
import refactoringApi, { RefactoringApi } from '@/refactoring/refactoring';
import {
  Goal, Label, Prerequisite, Refactoring, RefactoringGraph, Status,
} from '@/api/refactoring/refactoring';
import { Translations } from '@/lib/i18n/translation';

export const aRefactoringApi = (api: Partial<RefactoringApi> = {}): RefactoringApi => ({
  start: jest.fn() as jest.Mocked<typeof refactoringApi.start>,
  addPrerequisite: jest.fn() as jest.Mocked<typeof refactoringApi.addPrerequisite>,
  ...api,
});

export const aRouter = (router: Partial<AppRouterInstance> = {}) => (): AppRouterInstance => ({
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  ...router,
});

export const aNotifier = (notifier: Partial<UseNotification> = {}) => (): UseNotification => ({
  success: jest.fn(),
  error: jest.fn(),
  ...notifier,
});

const aServiceContainer = (services: Partial<typeof container> = {}): typeof container => ({
  ...container,
  useRouter: aRouter(),
  ...services,
});

export const createWrapper = (
  serviceContainer: Partial<typeof container> = {},
  translations?: Partial<Translations>,
) => function Wrapper(
  { children }: { children: ReactElement },
) {
  return (
    <IntlProvider overriddenTranslations={translations}>
      <ServiceContainerProvider overriddenContainer={aServiceContainer(serviceContainer)}>
        {children}
      </ServiceContainerProvider>
    </IntlProvider>
  );
};

// Todo: do we need this type, should we use RefactoringGraph?
type RefactoringState = {
  id: string
  goal: string
  prerequisites: {
    prerequisiteId: string
    label: string
    status: Status
  }[]
};

export const aRefactoring = (state: Partial<RefactoringState>) => {
  const newState = {
    id: '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
    goal: 'Refactor this class',
    prerequisites: [],
    ...state,
  };
  return new Refactoring(
    newState.id,
    new Goal(newState.goal),
    newState.prerequisites.map(
      (prerequisite) => new Prerequisite(
        prerequisite.prerequisiteId,
        new Label(prerequisite.label),
        prerequisite.status,
      ),
    ),
  );
};

export const aRefactoringGraph = (graph: Partial<RefactoringGraph>): RefactoringGraph => ({
  id: '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
  goal: 'Refactor this class',
  prerequisites: [],
  ...graph,
});
