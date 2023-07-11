import { container, ServiceContainerProvider } from '@/lib/service-container-context';
import { ReactElement } from 'react';
import IntlProvider, { Translations } from '@/lib/i18n/intl-provider';
import httpClient, { HttpClient } from '@/lib/http-client';
import { jest } from '@jest/globals';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const aServiceContainer = (services: Partial<typeof container> = {}): typeof container => ({
  ...container,
  ...services,
});

// eslint-disable-next-line import/prefer-default-export
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
export const aHttpClient = (client: Partial<HttpClient>): HttpClient => ({
  post: jest.fn() as jest.Mocked<typeof httpClient.post>,
  get: jest.fn() as jest.Mocked<typeof httpClient.get>,
  ...client,
});
export const aRouter = (router: Partial<AppRouterInstance>): AppRouterInstance => ({
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  ...router,
});
