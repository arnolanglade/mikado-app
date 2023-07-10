import { container, ServiceContainerProvider } from '@/lib/service-container-context';
import { ReactElement } from 'react';
import IntlProvider, { Translations } from '@/lib/i18n/intl-provider';

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
