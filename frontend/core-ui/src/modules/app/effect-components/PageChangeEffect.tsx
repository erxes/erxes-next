import { useEffect } from 'react';
import { useIsMatchingLocation } from '~/hooks/useIsMatchingLocation';
import { PageHotkeyScope } from '@/types/PageHotkeyScope';
import { useSetHotkeyScope } from 'erxes-ui';
import { AppPath } from '@/types/paths/AppPath';

export const PageChangeEffect = () => {
  const isMatchingLocation = useIsMatchingLocation();
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
        setHotkeyScope(PageHotkeyScope.ContactsPage);
        break;
      }
      case isMatchingLocation(AppPath.Index): {
        setHotkeyScope(PageHotkeyScope.IndexPage);
        break;
      }
      default: {
        setHotkeyScope(PageHotkeyScope.IndexPage);
        break;
      }
    }
  }, [isMatchingLocation, setHotkeyScope]);
  return <></>;
};
