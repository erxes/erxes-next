import React from 'react';

import { CURRENCY_CODES } from 'erxes-ui/constants/CurrencyCodes';
import { FieldCurrencyValue } from 'erxes-ui/types/Displays';
import { isDefined, isUndefinedOrNull } from 'erxes-ui/utils';
import { formatAmount } from 'erxes-ui/utils/format';
import { EllipsisDisplay } from './EllipsisDisplay';

type CurrencyDisplayProps = {
  currencyValue: FieldCurrencyValue | null | undefined;
};

export const CurrencyFormatedDisplay = ({
  currencyValue,
}: CurrencyDisplayProps) => {
  const shouldDisplayCurrency = isDefined(currencyValue?.currencyCode);

  const CurrencyIcon = isDefined(currencyValue?.currencyCode)
    ? CURRENCY_CODES[currencyValue?.currencyCode]?.Icon
    : null;

  const amountToDisplay = isUndefinedOrNull(currencyValue?.amountMicros)
    ? null
    : currencyValue?.amountMicros / 1000000;

  if (!shouldDisplayCurrency) {
    return <EllipsisDisplay>{0}</EllipsisDisplay>;
  }

  return (
    <EllipsisDisplay>
      {isDefined(CurrencyIcon) && amountToDisplay !== null && (
        <CurrencyIcon className="size-4 text-muted-foreground" />
      )}
      {amountToDisplay !== null ? formatAmount(amountToDisplay) : ''}
    </EllipsisDisplay>
  );
};
