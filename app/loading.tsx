import React from 'react';
import Loader from '@/tools/design-system/loader';
import { Translation } from '@/tools/i18n/intl-provider';

export default function Loading() {
  return (
    <Loader text={<Translation id="loading" />} />
  );
}
