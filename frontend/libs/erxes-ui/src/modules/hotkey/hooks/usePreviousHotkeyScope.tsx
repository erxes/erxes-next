import { useAtomCallback } from 'jotai/utils';
import { useSetHotkeyScope } from './useSetHotkeyScope';
import { useCallback } from 'react';
import { previousHotkeyScopeState } from '../states/internal/previousHotkeyScopeState';
import { currentHotkeyScopeState } from '../states/internal/currentHotkeyScopeState';
import { CustomHotkeyScopes } from '../types/CustomHotkeyScope';

export const usePreviousHotkeyScope = () => {
  const setHotKeyScope = useSetHotkeyScope();

  const goBackToPreviousHotkeyScope = useAtomCallback(
    useCallback(
      (get) => {
        const previousHotkeyScope = get(previousHotkeyScopeState);

        if (!previousHotkeyScope) {
          return;
        }

        setHotKeyScope(
          previousHotkeyScope.scope,
          previousHotkeyScope.customScopes,
        );
      },
      [setHotKeyScope],
    ),
  );

  const setHotkeyScopeAndMemorizePreviousScope = useAtomCallback(
    useCallback(
      (get, set, scope: string, customScopes?: CustomHotkeyScopes) => {
        const currentHotkeyScope = get(currentHotkeyScopeState);
        console.log('currentHotkeyScope', currentHotkeyScope, scope);
        setHotKeyScope(scope, customScopes);
        set(previousHotkeyScopeState, currentHotkeyScope);
      },
      [setHotKeyScope],
    ),
  );

  return {
    goBackToPreviousHotkeyScope,
    setHotkeyScopeAndMemorizePreviousScope,
  };
};
