const createEncVars = (envVars: Record<string, string | undefined>): { get: (key: string) => string } => ({
  get: (key: string) => {
    if (!envVars[key]) {
      throw new Error(`Please define the "${key}" env var`);
    }
    return envVars[key] as string;
  },
});

export default createEncVars;
