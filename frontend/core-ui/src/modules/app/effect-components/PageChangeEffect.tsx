import { useEffect } from 'react';
import { PageHotkeyScope } from '@/types/PageHotkeyScope';
import { useIsMatchingLocation, useSetHotkeyScope } from 'erxes-ui';
import { AppPath } from '@/types/paths/AppPath';
import { ContactsPath } from '@/types/paths/ContactsPath';

export const PageChangeEffect = () => {
  const isMatchingLocation = useIsMatchingLocation(AppPath.Index);
  const setHotkeyScope = useSetHotkeyScope();

  useEffect(() => {
    switch (true) {
      case isMatchingLocation(AppPath.Settings): {
        setHotkeyScope(PageHotkeyScope.SettingsPage);
        break;
      }
      case isMatchingLocation(AppPath.Products): {
        setHotkeyScope(PageHotkeyScope.ProductsPage);
        break;
      }
      case isMatchingLocation(AppPath.ContactsCatchAll): {
        setHotkeyScope(PageHotkeyScope.CustomersPage);
        break;
      }

      case isMatchingLocation(AppPath.Index): {
        setHotkeyScope(PageHotkeyScope.IndexPage);
        break;
      }
    }
  }, [isMatchingLocation, setHotkeyScope]);
  return <></>;
};
