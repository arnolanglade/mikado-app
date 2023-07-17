'use client';

import React, {
  ReactElement, ReactNode, useContext, useState,
} from 'react';
import {
  FormattedMessage,
  IntlProvider as BaseIntlProvider,
  MessageFormatElement,
  useIntl as useBaseIntl,
} from 'react-intl';
import { FormatXMLElementFn } from 'intl-messageformat';

export type Translations = Record<string, string>;
const translationEn: Translations = {
  test: 'test en',
  'refactoring.start': 'Start refactoring',
  'refactoring.notification.error': 'Something went wrong',
  'refactoring.notification.success': 'The refactoring has been started',
};
const translationFr: Translations = {
  test: 'test fr',
  'refactoring.start': 'Start refactoring',
  'refactoring.notification.error': 'Something went wrong',
  'refactoring.notification.success': 'The refactoring has been started',
};

type HookValues = Record<string, string | FormatXMLElementFn<string, string>>;

type SwitchLanguage = {
  switchLanguage: (locale: string) => void
};
export const SwitchLanguageContext = React.createContext<SwitchLanguage>({} as SwitchLanguage);

export const useSwitchLanguage = () => useContext(SwitchLanguageContext);

export default function IntlProvider(
  { children, overriddenTranslations = {} }:{ children: ReactElement, overriddenTranslations?: Partial<Translations> },
) {
  const [locale, setLocale] = useState<string>('en');
  const switchLanguage = (chosenLocale: string) => setLocale(chosenLocale);

  const translations : Record<string, Translations> = {
    en: translationEn,
    fr: translationFr,
  };

  return (
    <SwitchLanguageContext.Provider value={React.useMemo(() => ({ switchLanguage, locale }), [locale])}>
      <BaseIntlProvider
        // TODO should work with Partial<Translations>
        messages={{ ...translations[locale], ...(overriddenTranslations as Translations) }}
        locale={locale}
        defaultLocale="en"
      >
        {children}
      </BaseIntlProvider>
    </SwitchLanguageContext.Provider>
  );
}

export type Intl = {
  locale: string,
  translations: Record<string, string> | Record<string, MessageFormatElement[]>,
  switchLanguage: (locale: string) => void,
  translation: (id: string, values?: HookValues) => string
};

export type UseIntl = () => Intl;

export const useIntl = () : Intl => {
  const intl = useBaseIntl();
  const { switchLanguage } = useSwitchLanguage();

  return {
    locale: intl.locale,
    translations: intl.messages,
    switchLanguage,
    translation: (id: string, values?: HookValues): string => intl.formatMessage({ id }, values as HookValues),
  };
};

type ComponentValues = Record<string, string | FormatXMLElementFn<ReactNode, ReactNode>>;

export function Translation({ id, values = {} }: { id: string, values?: ComponentValues }) {
  return <FormattedMessage id={id} values={values} />;
}
