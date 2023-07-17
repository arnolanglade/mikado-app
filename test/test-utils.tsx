import { container, ServiceContainerProvider } from '@/lib/service-container-context';
import { ReactElement } from 'react';
import IntlProvider, { Translations } from '@/lib/i18n/intl-provider';
import { jest } from '@jest/globals';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { UseNotification } from '@/lib/notification';
import refactoringApi, { RefactoringApi } from '@/refactoring/refactoring';
import { Goal, Prerequisite, Refactoring } from '@/api/refactoring/refactoring';

export const aRefactoringApi = (api: Partial<RefactoringApi> = {}): RefactoringApi => ({
  start: jest.fn() as jest.Mocked<typeof refactoringApi.start>,
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

export const aRefactoring = (state: Partial<{ id: string, goal: string, prerequisites: Prerequisite[] }>) => {
  const newState = {
    id: '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
    goal: 'Refactor this class',
    prerequisites: [],
    ...state,
  };
  return new Refactoring(newState.id, new Goal(newState.goal), newState.prerequisites);
};
