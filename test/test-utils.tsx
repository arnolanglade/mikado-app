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
import { v4 as uuidv4 } from 'uuid';

export const aRefactoringApi = (api: Partial<RefactoringApi> = {}): RefactoringApi => ({
  start: jest.fn() as jest.Mocked<typeof refactoringApi.start>,
  addPrerequisite: jest.fn() as jest.Mocked<typeof refactoringApi.addPrerequisite>,
  startExperimentation: jest.fn() as jest.Mocked<typeof refactoringApi.startExperimentation>,
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

type RefactoringState = {
  refactoringId: string
  goal: string
  prerequisites: Partial<{
    prerequisiteId: string
    label: string
    status: Status
    startedAt: string
  }>[]
};

export const aRefactoring = (state: Partial<RefactoringState>) => {
  const newState = {
    refactoringId: '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
    goal: 'Refactor this class',
    prerequisites: [],
    ...state,
  };
  return new Refactoring(
    newState.refactoringId,
    new Goal(newState.goal),
    newState.prerequisites.map(
      (prerequisite) => new Prerequisite(
        prerequisite.prerequisiteId ?? uuidv4(),
        new Label(prerequisite.label ?? 'Do that'),
        prerequisite.status ?? Status.TODO,
        prerequisite.startedAt ? new Date(prerequisite.startedAt) : undefined,
      ),
    ),
  );
};

type RefactoringGraphState = {
  refactoringId: string
  goal: string
  prerequisites: Partial<{
    prerequisiteId: string
    label: string
    status: Status
  }>[]
};

export const aRefactoringGraph = (graph: Partial<RefactoringGraphState>): RefactoringGraph => ({
  refactoringId: graph.refactoringId ?? '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
  goal: graph.goal ?? 'Refactor this class',
  prerequisites: graph.prerequisites?.map((prerequisite) => ({
    prerequisiteId: prerequisite.prerequisiteId ?? uuidv4(),
    label: prerequisite.label ?? 'Do this',
    status: prerequisite.status ?? Status.TODO,
  })) ?? [],
});
