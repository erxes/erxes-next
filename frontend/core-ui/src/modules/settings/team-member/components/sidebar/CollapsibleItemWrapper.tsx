import { IconCaretRightFilled, IconPlus } from '@tabler/icons-react';
import { Button, cn, Collapsible } from 'erxes-ui';
import { useState } from 'react';

type Props = {
  label: string;
  children?: any;
  open?: boolean;
};

export function CollapsibleItemWrapper({ label, children, open }: Props) {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(open);
  return (
    <Collapsible
      className="py-4 px-2 flex flex-col gap-2 group"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="flex items-center justify-between">
        <Collapsible.Trigger asChild className="cursor-pointer">
          <div className="flex gap-2 items-center w-full text-accent-foreground">
            <IconCaretRightFilled
              size={16}
              className={cn(
                isOpen && 'rotate-90',
                'transition-transform ease-linear duration-150',
              )}
            />
            <div className="text-xs font-semibold group-hover:text-primary transition-all ease-linear duration-300">
              {label}
            </div>
          </div>
        </Collapsible.Trigger>
        <Button type="button" variant={'ghost'}>
          <IconPlus />
        </Button>
      </div>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible>
  );
}
