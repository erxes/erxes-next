import { useEffect } from 'react';
import { AccountingHotkeyScope } from '~/modules/types/AccountingHotkeyScope';
import { useIsMatchingLocation, useSetHotkeyScope } from 'erxes-ui';
import { AccountingPath } from '~/modules/types/AccountingPath';

export const PageChangeEffect = () => {
  const isMatchingLocation = useIsMatchingLocation();
  const setHotkeyScope = useSetHotkeyScope();

  useEffect(() => {
    switch (true) {
      case isMatchingLocation(AccountingPath.Main): {
        setHotkeyScope(AccountingHotkeyScope.MainPage);
        break;
      }
      case isMatchingLocation(AccountingPath.Transaction): {
        setHotkeyScope(AccountingHotkeyScope.TransactionPage);
        break;
      }
    }
  }, [isMatchingLocation, setHotkeyScope]);

  return <></>;
};
