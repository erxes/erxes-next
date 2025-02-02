import React, { useState } from 'react';

import { IconCaretDownFilled } from '@tabler/icons-react';

import { Button, ButtonProps, Command, Popover, } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { SelectTreeContext } from 'erxes-ui/modules/select-tree/context/SelectTreeContext';
import { useSelectTreeHide } from 'erxes-ui/modules/select-tree/hooks/useSelectTreeHide';

//TODO: continue make it work
export const SelectTree = ({ id, children }: { id: string, children: React.ReactNode }) => {
  const [hideChildren, setHideChildren] = useState<string[]>([]);
  return (
    <SelectTreeContext.Provider value={{ hideChildren, setHideChildren, id }}>
      <Popover>
        {children}
      </Popover>
    </SelectTreeContext.Provider>
  );
};

export const SelectTreeArrow = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { order: string, hasChildren: boolean }
>(({ order, hasChildren, ...props }, ref) => {
  
  const { toggleHideChildren, isHidden } = useSelectTreeHide(order);

  if(!hasChildren) {
    return null;
  }

  return (
    <Button ref={ref} variant="ghost" size="icon" {...props} tabIndex={-1} onClick={() => toggleHideChildren(order)}>
      <IconCaretDownFilled
        className={cn('transition-transform', isHidden && '-rotate-90')}
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
    <div className="flex h-full gap-[32px] pl-[13px] pr-[15px]">
      {Array.from({ length: level }).map((_, index) => (
        <div key={index} className="relative">
          <div className="absolute -top-3.5 h-7 w-px bg-muted-foreground/20" />
        </div>
      ))}
    </div>
  );
};

export const SelectTreeItem = React.forwardRef<
  React.ElementRef<typeof Command.Item>,
  React.ComponentPropsWithoutRef<typeof Command.Item> & {
    order: string;
    children: React.ReactNode;
    hasChildren: boolean;
    name: string;
    selected: boolean;
  }
>(({
  order,
  children,
  hasChildren,
  name,
  selected,
  ...props
}, ref) => {
  const { isHiddenByParent } = useSelectTreeHide(order);

  if (isHiddenByParent) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 w-full">
      <SelectTreeIndentation order={order} />
      <SelectTreeArrow order={order} hasChildren={hasChildren} />
      <Command.Item {...props} className={cn('h-7 py-0 items-center flex-1 overflow-hidden', props.className, selected && 'bg-muted')} ref={ref}>
        {children}
      </Command.Item> 
    </div>
  );
});
