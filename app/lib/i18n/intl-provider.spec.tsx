import React from 'react';
import {
  render, renderHook, screen, act,
} from '@testing-library/react';
import { Translation, useIntl } from '@/lib/i18n/intl-provider';
import { createWrapper } from '@/lib/test-utils';

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
        { wrapper: createWrapper({}, { 'refactoring.start': 'translation message' }) },
      );

      expect(intl.result.current.translation('refactoring.start')).toEqual('translation message');
    });

    it('adds a value to the translation', () => {
      const intl = renderHook(
        () => useIntl(),
        { wrapper: createWrapper({}, { 'refactoring.start': 'translation {message}' }) },
      );

      expect(intl.result.current.translation('refactoring.start', { message: 'here is my value' }))
        .toEqual('translation here is my value');
    });
  });

  describe('Translation component', () => {
    it('renders the correct translation depending on the given key', () => {
      render(
        <Translation id="refactoring.start" />,
        { wrapper: createWrapper({}, { 'refactoring.start': 'translation message' }) },
      );

      expect(screen.getByText('translation message')).toBeTruthy();
    });

    it('adds a value to the translation', () => {
      render(
        <Translation id="refactoring.start" values={{ message: 'here is my value' }} />,
        { wrapper: createWrapper({}, { 'refactoring.start': 'translation {message}' }) },
      );

      expect(screen.getByText('translation here is my value')).toBeTruthy();
    });
  });
});
