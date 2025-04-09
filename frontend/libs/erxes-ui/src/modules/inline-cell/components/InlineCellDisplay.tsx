import { cn } from 'erxes-ui/lib/utils';
import React from 'react';
import { Button } from 'erxes-ui/components';
import { PopoverTrigger } from '@radix-ui/react-popover';

import { Combobox } from 'erxes-ui/components/combobox';
import { usePreviousHotkeyScope } from 'erxes-ui/modules/hotkey';
import { useInlineCell } from '../hooks/useInlineCell';
import { useAtomValue } from 'jotai';
import { InlineCellIsInEditModeFamilyState } from '../states/InlineCellIsInEditModeFamilyState';

export const InlineCellDisplay = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const { id } = useInlineCell();
  const isInEditMode = useAtomValue(InlineCellIsInEditModeFamilyState(id));
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  return (
    <PopoverTrigger asChild>
      <Combobox.TriggerBase
        ref={ref}
        variant="ghost"
        onFocus={() => setHotkeyScopeAndMemorizePreviousScope(id)}
        onBlur={() => !isInEditMode && goBackToPreviousHotkeyScope()}
        {...props}
        hideChevron
        className={cn(
          'h-full w-full justify-start font-normal rounded-none',
          className,
        )}
      />
    </PopoverTrigger>
  );
});

InlineCellDisplay.displayName = 'InlineCellDisplay';
