import { IconCashBanknote } from '@tabler/icons-react';
import { NavigationMenuGroup, NavigationMenuLinkItem } from 'erxes-ui';

export const AccountingNavigation = () => {
  return (
    <>
      {/* <NavigationMenuLinkItem name="" icon={IconCashBanknote} path="accounting" /> */}
      <NavigationMenuLinkItem name='Accounting' icon={IconCashBanknote} path="accounting/main" />
      <NavigationMenuLinkItem name='records' icon={IconCashBanknote} path="accounting/records" />
      <NavigationMenuLinkItem name='odds' icon={IconCashBanknote} path="accounting/odd-transactions" />
      <div className='-mt-3'>
        <NavigationMenuGroup name='Adjustment' separate={false}>
          <NavigationMenuLinkItem name='Fund Rate' icon={IconCashBanknote} path="accounting/adjustment/fundRate"></NavigationMenuLinkItem>
          <NavigationMenuLinkItem name='Debt Rate' icon={IconCashBanknote} path="accounting/adjustment/debRate"></NavigationMenuLinkItem>
          <NavigationMenuLinkItem name='Inventory Cost' icon={IconCashBanknote} path="accounting/adjustment/inventory"></NavigationMenuLinkItem>
          <NavigationMenuLinkItem name='FixedAsset' icon={IconCashBanknote} path="accounting/adjustment/fxa"></NavigationMenuLinkItem>
        </NavigationMenuGroup>
      </div>
    </>
  );
};
