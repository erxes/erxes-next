import React from 'react';
import { FieldCurrencyValue } from 'erxes-ui/types/Displays';
import { cn } from 'erxes-ui/lib';
import { CURRENCY_CODES } from 'erxes-ui/constants/CurrencyCodes';
import { formatAmount } from 'erxes-ui/utils/format';
import { isDefined, isUndefinedOrNull } from 'erxes-ui/utils';

type CurrencyDisplayProps = {
  currencyValue: FieldCurrencyValue | null | undefined;
};

const StyledEllipsisDisplay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap',
      className
    )}
    {...props}
  />
));

export const CurrencyDisplay = ({ currencyValue }: CurrencyDisplayProps) => {
  const shouldDisplayCurrency = isDefined(currencyValue?.currencyCode);

  const CurrencyIcon = isDefined(currencyValue?.currencyCode)
    ? CURRENCY_CODES[currencyValue?.currencyCode]?.Icon
    : null;

  const amountToDisplay = isUndefinedOrNull(currencyValue?.amountMicros)
    ? null
    : currencyValue?.amountMicros / 1000000;

  if (!shouldDisplayCurrency) {
    return <StyledEllipsisDisplay>{0}</StyledEllipsisDisplay>;
  }

  return (
    <StyledEllipsisDisplay>
      {isDefined(CurrencyIcon) && amountToDisplay !== null && (
        <CurrencyIcon className="size-4 text-muted-foreground" />
      )}
      {amountToDisplay !== null ? formatAmount(amountToDisplay) : ''}
    </StyledEllipsisDisplay>
  );
};
