import { Popover } from 'erxes-ui/components';
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
}: React.ComponentPropsWithoutRef<typeof Popover> & {
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
      if (onEnter) {
        onEnter?.();
        if (closeOnEnter) {
          _setOpen(false);
          onOpenChange?.(false);
        }
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
      {...props}
      open={open ?? _open}
      onOpenChange={(open) => {
        _setOpen(open);
        onOpenChange?.(open);
        if (scope) {
          open
            ? setHotkeyScopeAndMemorizePreviousScope(scope + '.Popover')
            : goBackToPreviousHotkeyScope();
        }
      }}
    />
  );
};
