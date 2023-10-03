import { container, ServiceContainerProvider } from '@/lib/service-container-context';
import { ReactElement } from 'react';
import IntlProvider from '@/lib/i18n/intl-provider';
import { jest } from '@jest/globals';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { UseNotification } from '@/lib/notification';
import refactoringApi, { RefactoringApi } from '@/refactoring/refactoring';
import {
  Goal, Label, Prerequisite, PrerequisiteView, MikakoGraph, MikadoGraphView, Status,
} from '@/api/mikado-graph/mikako-graph';
import { Translations } from '@/lib/i18n/translation';
import { v4 as uuidv4 } from 'uuid';
import { ReactFlowProvider } from 'reactflow';

export const aRefactoringApi = (api: Partial<RefactoringApi> = {}): RefactoringApi => ({
  getById: jest.fn() as jest.Mocked<typeof refactoringApi.getById>,
  start: jest.fn() as jest.Mocked<typeof refactoringApi.start>,
  addPrerequisiteToRefactoring: jest.fn() as jest.Mocked<typeof refactoringApi.addPrerequisiteToRefactoring>,
  addPrerequisiteToPrerequisite: jest.fn() as jest.Mocked<typeof refactoringApi.addPrerequisiteToPrerequisite>,
  startExperimentation: jest.fn() as jest.Mocked<typeof refactoringApi.startExperimentation>,
  commitChanges: jest.fn() as jest.Mocked<typeof refactoringApi.commitChanges>,
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
    <ReactFlowProvider>
      <IntlProvider overriddenTranslations={translations}>
        <ServiceContainerProvider overriddenContainer={aServiceContainer(serviceContainer)}>
          {children}
        </ServiceContainerProvider>
      </IntlProvider>
    </ReactFlowProvider>
  );
};

type MikadaGraphState = {
  mikadoGraphId: string
  goal: string
  done: boolean
  prerequisites: Partial<{
    prerequisiteId: string
    label: string
    status: Status
    startedAt: string
    parentId: string
  }>[]
};

export const aMikadoGraph = (state: Partial<MikadaGraphState>) => {
  const newState = {
    mikadoGraphId: '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
    done: false,
    goal: 'Refactor this class',
    prerequisites: [],
    ...state,
  };
  return new MikakoGraph(
    newState.mikadoGraphId,
    new Goal(newState.goal),
    newState.done,
    newState.prerequisites.map(
      (prerequisite) => new Prerequisite(
        prerequisite.prerequisiteId ?? uuidv4(),
        new Label(prerequisite.label ?? 'Do that'),
        prerequisite.status ?? Status.TODO,
        prerequisite.parentId ?? newState.mikadoGraphId,
        prerequisite.startedAt ? new Date(prerequisite.startedAt) : undefined,
      ),
    ),
  );
};

type PrerequisiteViewState = {
  prerequisiteId: string
  label: string
  status: Status
  startedAt: string
  parentId: string
};

type MikadoGraphViewState = {
  refactoringId: string
  goal: string
  done: boolean
  prerequisites: Partial<PrerequisiteViewState>[]
};

export const aMikadoGraphView = (graph: Partial<MikadoGraphViewState> = {}): MikadoGraphView => ({
  mikadoGraphId: graph.refactoringId ?? '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
  goal: graph.goal ?? 'Refactor this class',
  done: graph.done ?? false,
  prerequisites: graph.prerequisites?.map((prerequisite) => ({
    prerequisiteId: prerequisite.prerequisiteId ?? uuidv4(),
    label: prerequisite.label ?? 'Do this',
    status: prerequisite.status ?? Status.TODO,
    startedAt: prerequisite.startedAt ?? '2023-07-25T10:24:00',
    parentId: prerequisite.parentId ?? graph.refactoringId ?? '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
  })) ?? [],
});

export const aPrerequisiteGraph = (prerequisite: Partial<PrerequisiteViewState> = {}): PrerequisiteView => ({
  prerequisiteId: prerequisite.prerequisiteId ?? uuidv4(),
  label: prerequisite.label ?? 'Do this',
  status: prerequisite.status ?? Status.TODO,
  startedAt: prerequisite.startedAt ?? '2023-07-25T10:24:00',
  parentId: prerequisite.parentId ?? uuidv4(),
});
