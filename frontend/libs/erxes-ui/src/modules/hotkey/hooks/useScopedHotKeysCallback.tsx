import {
  Hotkey,
  OptionsOrDependencyArray,
} from 'react-hotkeys-hook/dist/types';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { internalHotkeysEnabledScopesState } from '../states/internal/internalHotkeysEnabledScopeState';

export const useScopedHotKeysCallback = (
  dependencies?: OptionsOrDependencyArray,
) => {
  const dependencyArray = Array.isArray(dependencies) ? dependencies : [];

  return useAtomCallback(
    useCallback(
      (
        get,
        set,
        {
          callback,
          hotkeysEvent,
          keyboardEvent,
          scope,
          preventDefault,
        }: {
          keyboardEvent: KeyboardEvent;
          hotkeysEvent: Hotkey;
          callback: (
            keyboardEvent: KeyboardEvent,
            hotkeysEvent: Hotkey,
          ) => void;
          scope: string;
          preventDefault?: boolean;
        },
      ) => {
        const currentHotkeyScopes = get(internalHotkeysEnabledScopesState);

        if (!currentHotkeyScopes.includes(scope)) {
          return;
        }

        if (preventDefault === true) {
          keyboardEvent.stopPropagation();
          keyboardEvent.preventDefault();
          keyboardEvent.stopImmediatePropagation();
        }

        callback(keyboardEvent, hotkeysEvent);
      },
      [dependencyArray],
    ),
  );
};
