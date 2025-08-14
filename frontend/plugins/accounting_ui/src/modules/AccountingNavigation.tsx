import { NavigationMenuLinkItem } from 'erxes-ui';

export const AccountingNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem name="Main" path="accounting/main" />
      <NavigationMenuLinkItem name="Records" path="accounting/records" />
      <NavigationMenuLinkItem name="Adjustment" path="accounting/adjustment" />
      <NavigationMenuLinkItem name="Odds" path="accounting/odds" />
    </>
  );
};
