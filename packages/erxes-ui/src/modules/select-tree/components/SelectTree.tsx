import React, { useState } from 'react';

import { IconCaretDownFilled } from '@tabler/icons-react';

import { Button, ButtonProps, Popover } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { SelectTreeContext } from 'erxes-ui/modules/select-tree/context/SelectTreeContext';
import { useSelectTreeHide } from 'erxes-ui/modules/select-tree/hooks/useSelectTreeHide';
//TODO: continue make it work
export const SelectTree = ({ id }: { id: string }) => {
  const [hideChildren, setHideChildren] = useState<string[]>([]);
  return (
    <SelectTreeContext.Provider value={{ hideChildren, setHideChildren, id }}>
      <Popover>
        <Popover.Trigger asChild></Popover.Trigger>
        <Popover.Content>

        </Popover.Content>
      </Popover>
    </SelectTreeContext.Provider>
  );
};

export const SelectTreeArrow = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { isClosed: boolean }
>(({ isClosed, ...props }, ref) => {
  return (
    <Button ref={ref} variant="ghost" size="icon" {...props} tabIndex={-1}>
      <IconCaretDownFilled
        className={cn('transition-transform', isClosed && '-rotate-90')}
      />
    </Button>
  );
});

export const SelectTreeIndentation = ({ order }: { order: string }) => {
  const level = (order?.match(/[/]/gi)?.length || 0) - 1;

  if (level <= 0) {
    return null;
  }

  return (
    <div className="flex h-full gap-[22px] pl-[13px] pr-2">
      {Array.from({ length: level }).map((_, index) => (
        <div key={index} className="relative">
          <div className="absolute -top-4 h-8 w-px bg-muted-foreground/20" />
        </div>
      ))}
    </div>
  );
};

export const SelectTreeItem = ({
  order,
  children,
}: {
  order: string;
  children: React.ReactNode;
}) => {
  const { checkIsHidden } = useSelectTreeHide();
  return (
    <div className="flex items-center gap-2">
      <SelectTreeIndentation order={order} />
    </div>
  );
};
