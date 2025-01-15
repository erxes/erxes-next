import { Button, Collapsible } from 'erxes-ui/components';
import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
export const ProductAddCollapsible = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Collapsible
      className="flex flex-col mt-5"
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <Collapsible.Trigger asChild>
        <Button
          variant={'secondary'}
          className={`flex gap-1 bg-transparent text-xs font-semibold text-accent-foreground border-none shadow-none order-2 `}
        >
          See more options
          <IconChevronDown
            size={12}
            strokeWidth={2}
            className={` ${isOpen && 'rotate-180'}`}
          />
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content className="order-1">{children}</Collapsible.Content>
    </Collapsible>
  );
};
