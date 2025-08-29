import { Popover, type PopoverProps } from 'erxes-ui/components';
import { usePreviousHotkeyScope } from '../hooks/usePreviousHotkeyScope';
import {
  UseHotkeysOptionsWithoutBuggyOptions,
  useScopedHotkeys,
} from 'erxes-ui/modules/hotkey/hooks/useScopedHotkeys';
import { Key } from 'erxes-ui/types';
import { useState } from 'react';

export const PopoverScoped = ({
  scope,
  onOpenChange,
  onEnter,
  closeOnEnter,
  dependencies,
  options,
  open,
  ...props
}: PopoverProps & {
  scope?: string;
  onEnter?: () => void;
  closeOnEnter?: boolean;
  dependencies?: unknown[];
  options?: UseHotkeysOptionsWithoutBuggyOptions;
}) => {
  const [_open, _setOpen] = useState(false);
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  useScopedHotkeys(
    Key.Enter,
    () => {
      onEnter?.();
      if (closeOnEnter) {
        _setOpen(false);
        onOpenChange?.(false);
      }
      if (scope) {
        goBackToPreviousHotkeyScope();
      }
    },
    scope + '.Popover',
    dependencies,
    {
      preventDefault: false,
      ...options,
    },
  );

  return (
    <Popover
      modal
      {...props}
      open={open ?? _open}
      onOpenChange={(op) => {
        _setOpen(op);
        onOpenChange?.(op);
        if (scope) {
          op
            ? setHotkeyScopeAndMemorizePreviousScope(scope + '.Popover')
            : goBackToPreviousHotkeyScope();
        }
      }}
    />
  );
};
