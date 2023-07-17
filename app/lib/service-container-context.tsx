'use client';

import React, {
  createContext, ReactNode, useContext,
} from 'react';
import httpClient, { HttpClient } from '@/lib/http-client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useRouter } from 'next/navigation';
import { useNotification, UseNotificationHook } from '@/lib/notification';
import refactoringApi, { RefactoringApi } from '@/refactoring/refactoring';

export type ServiceContainer = {
  httpClient: HttpClient,
  refactoringApi: RefactoringApi,
  useRouter: () => AppRouterInstance
  useNotification: UseNotificationHook
};

export const container: ServiceContainer = {
  httpClient,
  refactoringApi,
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
