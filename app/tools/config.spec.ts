import { createEncVars } from '@/tools/config';

describe('Env var', () => {
  it('gets an env var value', () => {
    const envVars = createEncVars({ var: 'value' });
    expect(envVars.get('var')).toBe('value');
  });

  it('raises an error if the env var doest exist', () => {
    const envVars = createEncVars({ var: 'value' });

    expect(() => envVars.get('otherVar'))
      .toThrow(new Error('Please define the "otherVar" env var'));
  });

  it('raises an error if the env var is undefined', () => {
    const envVars = createEncVars({ var: undefined });

    expect(() => envVars.get('var'))
      .toThrow(new Error('Please define the "var" env var'));
  });
});
