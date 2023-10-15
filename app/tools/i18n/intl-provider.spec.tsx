import React from 'react';
import {
  render, renderHook, screen, act,
} from '@testing-library/react';
import { Translation, useIntl } from '@/tools/i18n/intl-provider';
import { createWrapper } from '@/test/test-utils';

describe('Intl module', () => {
  it('switches translations depending on a given locale', () => {
    const intl = renderHook(
      () => useIntl(),
      { wrapper: createWrapper() },
    );

    act(() => intl.result.current.switchLanguage('fr'));

    expect(intl.result.current.locale).toEqual('fr');
    expect(intl.result.current.translations.test).toEqual('test fr');
  });

  describe('Translation hook', () => {
    it('returns the correct translation depending on the given key', () => {
      const intl = renderHook(
        () => useIntl(),
        { wrapper: createWrapper({}, { 'mikado.start': 'translation message' }) },
      );

      expect(intl.result.current.translation('mikado.start')).toEqual('translation message');
    });

    it('adds a value to the translation', () => {
      const intl = renderHook(
        () => useIntl(),
        { wrapper: createWrapper({}, { 'mikado.start': 'translation {message}' }) },
      );

      expect(intl.result.current.translation('mikado.start', { message: 'here is my value' }))
        .toEqual('translation here is my value');
    });
  });

  describe('Translation component', () => {
    it('renders the correct translation depending on the given key', () => {
      render(
        <Translation id="mikado.start" />,
        { wrapper: createWrapper({}, { 'mikado.start': 'translation message' }) },
      );

      expect(screen.getByText('translation message')).toBeTruthy();
    });

    it('adds a value to the translation', () => {
      render(
        <Translation id="mikado.start" values={{ message: 'here is my value' }} />,
        { wrapper: createWrapper({}, { 'mikado.start': 'translation {message}' }) },
      );

      expect(screen.getByText('translation here is my value')).toBeTruthy();
    });
  });
});
