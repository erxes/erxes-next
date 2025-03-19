import { IconPlus } from '@tabler/icons-react';

import { Button, Sheet } from 'erxes-ui';

interface ProductAddSheetProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}
export const ProductAddSheet = ({
  children,
  onOpenChange,
  open,
}: ProductAddSheetProps) => {
  return (
    <Sheet onOpenChange={onOpenChange} open={open} modal>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add product
        </Button>
      </Sheet.Trigger>
      <Sheet.Content className="sm:max-w-lg p-0">{children}</Sheet.Content>
    </Sheet>
  );
};

export const ProductAddSheetHeader = () => {
  return (
    <Sheet.Header className="p-5">
      <Sheet.Title>Create new product or service</Sheet.Title>
      <Sheet.Description>
        Create and configure your products & services
      </Sheet.Description>
    </Sheet.Header>
  );
};
