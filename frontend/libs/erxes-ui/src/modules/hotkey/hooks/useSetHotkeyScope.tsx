import { useSetAtom } from 'jotai';
import { setHotkeyScopeState } from '../states/setHotkeyScopeState';
import { CustomHotkeyScopes } from '../types/CustomHotkeyScope';

export const useSetHotkeyScope = () => {
  const setHotkeyScope = useSetAtom(setHotkeyScopeState);

  return (hotkeyScopeToSet: string, customScopes: CustomHotkeyScopes = {}) => {
    setHotkeyScope({
      scope: hotkeyScopeToSet,
      customScopes,
    });
  };
};
