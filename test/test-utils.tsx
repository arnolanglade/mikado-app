import { container, ServiceContainerProvider } from '@/tools/service-container-context';
import { ReactElement } from 'react';
import IntlProvider from '@/tools/i18n/intl-provider';
import { jest } from '@jest/globals';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { UseNotification } from '@/tools/notification';
import { MikadoGraphApi } from '@/mikado-graph/mikado-graph.api';
import {
  Goal,
  Label,
  Prerequisite,
  PrerequisiteView,
  MikadoGraph,
  MikadoGraphView,
  Status,
  MikadoGraphId,
  PrerequisiteId,
  StatusView,
} from '@/api/mikado-graph/mikado-graph';
import { Translations } from '@/tools/i18n/translation';
import { v4 as uuidv4 } from 'uuid';
import { ReactFlowProvider } from 'reactflow';
import { ToastContainer } from 'react-toastify';

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
          <ToastContainer />
        </ServiceContainerProvider>
      </IntlProvider>
    </ReactFlowProvider>
  );
};

type PrerequisiteState = {
  prerequisiteId: string
  label: string
  status: Status
  startedAt: string
  parentId: string
  canBeCommitted: boolean | null
};

type MikadaGraphState = {
  mikadoGraphId: string
  goal: string
  done: boolean
  prerequisites: Partial<PrerequisiteState>[]
};

export const aMikadoGraph = (state: Partial<MikadaGraphState>) => {
  const newState = {
    mikadoGraphId: '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
    done: false,
    goal: 'Refactor this class',
    prerequisites: [],
    ...state,
  };
  return new MikadoGraph(
    new MikadoGraphId(newState.mikadoGraphId),
    new Goal(newState.goal),
    newState.done,
    newState.prerequisites.map(
      (prerequisite) => new Prerequisite(
        new PrerequisiteId(prerequisite.prerequisiteId ?? 'b97a7c3a-ee3c-443f-a6a2-59272e70560c'),
        new Label(prerequisite.label ?? 'Do that'),
        prerequisite.status ?? Status.TODO,
        new MikadoGraphId(prerequisite.parentId ?? newState.mikadoGraphId ?? '2067a2c3-9965-4c7f-857b-00d4e27f35f6'),
        prerequisite.canBeCommitted,
        prerequisite.startedAt ? new Date(prerequisite.startedAt) : undefined,
      ),
    ),
  );
};

export const aPrerequisite = (state: Partial<PrerequisiteState> = {}) => new Prerequisite(
  new PrerequisiteId(state.prerequisiteId ?? 'b97a7c3a-ee3c-443f-a6a2-59272e70560c'),
  new Label(state.label ?? 'Do that'),
  state.status ?? Status.TODO,
  new MikadoGraphId(state.parentId ?? '2067a2c3-9965-4c7f-857b-00d4e27f35f6'),
  state.canBeCommitted ?? false,
  state.startedAt ? new Date(state.startedAt) : undefined,
);

type PrerequisiteViewState = {
  prerequisiteId: string
  label: string
  status: StatusView
  startedAt: string
  parentId: string
  canBeCommitted: boolean
};

type MikadoGraphViewState = {
  mikadoGraphId: string
  goal: string
  done: boolean
  prerequisites: Partial<PrerequisiteViewState>[]
};

export const aMikadoGraphView = (graph: Partial<MikadoGraphViewState> = {}): MikadoGraphView => ({
  mikadoGraphId: graph.mikadoGraphId ?? '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
  goal: graph.goal ?? 'Refactor this class',
  done: graph.done ?? false,
  prerequisites: graph.prerequisites?.map((prerequisite) => ({
    prerequisiteId: prerequisite.prerequisiteId ?? 'b97a7c3a-ee3c-443f-a6a2-59272e70560c',
    label: prerequisite.label ?? 'Do that',
    status: prerequisite.status ?? StatusView.TODO,
    parentId: prerequisite.parentId ?? graph.mikadoGraphId ?? '2067a2c3-9965-4c7f-857b-00d4e27f35f6',
    startedAt: prerequisite.startedAt,
    canBeCommitted: prerequisite.canBeCommitted ?? false,
  })) ?? [],
});

export const aPrerequisiteView = (prerequisite: Partial<PrerequisiteViewState> = {}): PrerequisiteView => ({
  prerequisiteId: prerequisite.prerequisiteId ?? 'b97a7c3a-ee3c-443f-a6a2-59272e70560c',
  label: prerequisite.label ?? 'Do that',
  status: prerequisite.status ?? StatusView.TODO,
  parentId: prerequisite.parentId ?? 'd3084e50-6f44-11ee-b962-0242ac120002',
  startedAt: prerequisite.startedAt,
  canBeCommitted: prerequisite.canBeCommitted ?? false,
});

export const aMikadoGraphApi = (api: Partial<MikadoGraphApi> = {}): MikadoGraphApi => ({
  start: jest.fn(() => Promise.resolve(aMikadoGraphView())),
  addPrerequisiteToMikadoGraph: jest.fn(() => Promise.resolve(aMikadoGraphView())),
  addPrerequisiteToPrerequisite: jest.fn(() => Promise.resolve(aMikadoGraphView())),
  startExperimentation: jest.fn(() => Promise.resolve(aMikadoGraphView())),
  commitChanges: jest.fn(() => Promise.resolve(aMikadoGraphView())),
  ...api,
});
