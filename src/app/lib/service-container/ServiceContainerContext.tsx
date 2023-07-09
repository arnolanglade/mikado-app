import React, {
  createContext, ReactNode, useContext,
} from 'react';

export type ServiceContainer = {};

export const container: ServiceContainer = {};

export const ServiceContainerContext = createContext<ServiceContainer>({} as ServiceContainer);

export const useServiceContainer = () => useContext(ServiceContainerContext);

export function ServiceContainerProvider(
  {
    overriddenContainer,
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

ServiceContainerProvider.defaultProps = {
  overriddenContainer: {},
};
