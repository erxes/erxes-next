/* eslint-disable @nx/enforce-module-boundaries */
import { CurrencyCode } from 'erxes-ui/types/CurrencyCode';

export type FieldCurrencyValue = {
  currencyCode: CurrencyCode;
  amount: number | null;
};
