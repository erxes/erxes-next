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
      className="flex flex-col items-center mt-5"
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <Collapsible.Content className="order-1 w-full">
        {children}
      </Collapsible.Content>
      <Collapsible.Trigger asChild>
        <Button
          variant={'ghost'}
          className={`w-min text-xs font-semibold text-accent-foreground order-2 `}
        >
          See {!isOpen ? 'more' : 'less'} options
          <IconChevronDown
            size={12}
            strokeWidth={2}
            className={` ${isOpen && 'rotate-180'}`}
          />
        </Button>
      </Collapsible.Trigger>
    </Collapsible>
  );
};
