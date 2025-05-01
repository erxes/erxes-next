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
      <Sheet.View className="sm:max-w-lg p-0">{children}</Sheet.View>
    </Sheet>
  );
};

export const ProductAddSheetHeader = () => {
  return (
    <Sheet.Header className="border-b gap-3">
      <Sheet.Title>Create product</Sheet.Title> <Sheet.Close />
    </Sheet.Header>
  );
};
