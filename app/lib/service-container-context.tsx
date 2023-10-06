'use client';

import React, {
  createContext, ReactNode, useContext,
} from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useRouter } from 'next/navigation';
import { useNotification, UseNotificationHook } from '@/lib/notification';
import mikadoGraphApi, { MikadoGraphApi } from '@/mikado-graph/mikado-graph.api';

export type ServiceContainer = {
  mikadoGraphApi: MikadoGraphApi,
  useRouter: () => AppRouterInstance
  useNotification: UseNotificationHook
};

export const container: ServiceContainer = {
  mikadoGraphApi,
  useRouter,
  useNotification,
};

export const ServiceContainerContext = createContext<ServiceContainer>({} as ServiceContainer);

export const useServiceContainer = () => useContext(ServiceContainerContext);

export function ServiceContainerProvider(
  {
    overriddenContainer = {},
    children,
  }: {
    overriddenContainer?: Partial<ServiceContainer>,
    children: ReactNode
  },
) {
  const serviceContainer = {
    ...container,
    ...overriddenContainer,
  };

  return (
    <ServiceContainerContext.Provider value={React.useMemo(() => (serviceContainer), [])}>
      {children}
    </ServiceContainerContext.Provider>
  );
}
