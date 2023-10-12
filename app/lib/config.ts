const getEnv = (envVars: Record<string, string>): { get: (key: string) => string } => ({
  get: (key: string) => envVars[key],
});

export default getEnv;
