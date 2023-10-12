import getEnv from '@/lib/config';

describe('Env var', () => {
  it('gets an env var value', () => {
    const envVars = getEnv({ var: 'value' });
    expect(envVars.get('var')).toBe('value');
  });
});
