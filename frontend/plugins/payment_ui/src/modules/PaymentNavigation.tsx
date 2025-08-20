import { IconCurrencyDollar } from '@tabler/icons-react';
import { NavigationMenuLinkItem } from 'erxes-ui';

export const PaymentNavigation = () => {
  return (
    <NavigationMenuLinkItem name="Invoice" icon={IconCurrencyDollar} path="invoice" />
  );
};
