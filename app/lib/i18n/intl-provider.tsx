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
};
const translationFr: Translations = {
  test: 'test fr',
  'refactoring.start': 'Start refactoring',
};

type HookValues = Record<string, string | FormatXMLElementFn<string, string>>;

type SwitchLanguage = {
  switchLanguage: (locale: string) => void
};
export const SwitchLanguageContext = React.createContext<SwitchLanguage>({} as SwitchLanguage);

export const useSwitchLanguage = () => useContext(SwitchLanguageContext);

export default function IntlProvider(
  { children, overriddenTranslations }:{ children: ReactElement, overriddenTranslations?: Partial<Translations> },
) {
  const [locale, setLocale] = useState<string>('en');
  const switchLanguage = (chosenLocale: string) => setLocale(chosenLocale);

  const providerValue = React.useMemo(() => ({ switchLanguage, locale }), []);

  const translations : Record<string, Translations> = {
    en: translationEn,
    fr: translationFr,
  };

  return (
    <SwitchLanguageContext.Provider value={providerValue}>
      <BaseIntlProvider
        messages={{ ...translations[locale], ...(overriddenTranslations as Partial<Translations>) }}
        locale={locale}
        defaultLocale="en"
      >
        {children}
      </BaseIntlProvider>
    </SwitchLanguageContext.Provider>
  );
}

IntlProvider.defaultProps = {
  overriddenTranslations: {},
};

export type Intl = {
  locale: string,
  translations: Record<string, string> | Record<string, MessageFormatElement[]>,
  switchLanguage: (locale: string) => void,
  translation: (id: TranslationsKeys, values?: HookValues) => string
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

export function Translation({ id, values }: { id: TranslationsKeys, values?: ComponentValues }) {
  return <FormattedMessage id={id} values={values} />;
}

Translation.defaultProps = {
  values: {},
};
