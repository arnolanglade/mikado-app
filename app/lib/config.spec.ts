import createEncVars from '@/lib/config';

describe('Env var', () => {
  it('gets an env var value', () => {
    const envVars = createEncVars({ var: 'value' });
    expect(envVars.get('var')).toBe('value');
  });

  it('raises an error if the env var is undefined', () => {
    const envVars = createEncVars({ var: 'value' });

    expect(() => envVars.get('otherVar'))
      .toThrow(new Error('The env var otherVar is not defined'));
  });
});
