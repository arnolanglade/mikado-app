const createEncVars = (envVars: Record<string, string>): { get: (key: string) => string } => ({
  get: (key: string) => {
    if (!envVars[key]) throw new Error(`The env var ${key} does exist`);
    return envVars[key];
  },
});

export default createEncVars;
