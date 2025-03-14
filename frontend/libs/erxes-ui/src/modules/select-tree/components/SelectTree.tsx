import React, { useEffect, useState } from 'react';

import { IconCaretDownFilled, IconCheck } from '@tabler/icons-react';

import {
  Button,
  ButtonProps,
  Command,
  Popover,
  TextOverflowTooltip,
} from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import {
  SelectTreeContext,
  useSelectTreeContext,
} from 'erxes-ui/modules/select-tree/context/SelectTreeContext';
import { useSelectTreeHide } from 'erxes-ui/modules/select-tree/hooks/useSelectTreeHide';
import { hideChildrenAtomFamily } from '../states/selectTreeStates';
import { useSetAtom } from 'jotai';

export const SelectTreeRoot = ({
  id,
  children,
  open,
  onOpenChange,
  length,
}: {
  id: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  length?: number;
}) => {
  return (
    <SelectTreeProvider id={id} length={length}>
      <Popover open={open} onOpenChange={onOpenChange} modal>
        {children}
      </Popover>
    </SelectTreeProvider>
  );
};

export const SelectTreeProvider = ({
  id,
  children,
  length,
  ordered,
}: {
  id: string;
  children: React.ReactNode;
  length?: number;
  ordered?: boolean;
}) => {
  const [hideChildren, setHideChildren] = useState<string[]>([]);
  const setHideChildrenState = useSetAtom(hideChildrenAtomFamily(id));

  useEffect(() => {
    setHideChildrenState([]);
  }, [length]);

  return (
    <SelectTreeContext.Provider
      value={{ hideChildren, setHideChildren, id, ordered }}
    >
      {children}
    </SelectTreeContext.Provider>
  );
};

export const SelectTreeArrow = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { order: string; hasChildren: boolean }
>(({ order, hasChildren, ...props }, ref) => {
  const { toggleHideChildren, isHidden } = useSelectTreeHide(order);

  if (!hasChildren) {
    return;
  }

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      {...props}
      tabIndex={-1}
      onClick={() => toggleHideChildren(order)}
    >
      <IconCaretDownFilled
        className={cn('transition-transform', isHidden && '-rotate-90')}
      />
    </Button>
  );
});

export const SelectTreeIndentation = ({ order }: { order: string }) => {
  const level = order?.match(/[/]/gi)?.length || 0;
  if (level <= 0) {
    return null;
  }

  return (
    <div className="flex h-full gap-4 px-2">
      {Array.from({ length: level }).map((_, index) => (
        <div key={index} className="relative">
          <div className="absolute -top-3.5 h-[30px] w-px bg-muted-foreground/20 flex-none" />
        </div>
      ))}
    </div>
  );
};

const SelectTreeItem = React.forwardRef<
  React.ElementRef<typeof Command.Item>,
  React.ComponentPropsWithoutRef<typeof Command.Item> & {
    order: string;
    hasChildren: boolean;
    name: string;
    selected: boolean;
  }
>(({ order, children, hasChildren, name, selected, ...props }, ref) => {
  const { ordered } = useSelectTreeContext();
  const fixOrder = () => {
    let fixedOrder = order;
    if (name.includes('/')) {
      fixedOrder = fixedOrder.replace(name, name.replace(/\//g, ''));
    }
    if (fixedOrder.endsWith('/')) {
      fixedOrder = fixedOrder.slice(0, -1);
    }
    return fixedOrder;
  };

  const { isHiddenByParent } = useSelectTreeHide(fixOrder());

  if (!ordered) {
    return (
      <Command.Item
        {...props}
        className={cn(
          'h-7 py-0 items-center flex-1 overflow-hidden justify-start gap-1',
          props.className,
          selected && 'bg-muted',
        )}
        ref={ref}
      >
        <TextOverflowTooltip value={name} />
        {selected && <IconCheck className="shrink-0" />}
      </Command.Item>
    );
  }

  if (isHiddenByParent) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 w-full">
      <SelectTreeIndentation order={fixOrder()} />
      <SelectTreeArrow order={fixOrder()} hasChildren={hasChildren} />
      <Command.Item
        {...props}
        className={cn(
          'h-7 py-0 items-center flex-1 overflow-hidden justify-start',
          props.className,
          selected && 'bg-muted',
        )}
        ref={ref}
      >
        <TextOverflowTooltip value={name} />
        {selected && <IconCheck className="absolute right-2" />}
      </Command.Item>
    </div>
  );
});

export const SelectTree = Object.assign(SelectTreeRoot, {
  Item: SelectTreeItem,
  Provider: SelectTreeProvider,
});
