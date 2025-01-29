import { Sheet, Button } from 'erxes-ui/components';
import { IconPlus } from '@tabler/icons-react';

interface CustomerAddSheetProps {
  children: React.ReactNode;
  onOpenChange?: (boolean) => void;
  open?: boolean;
}
export const CustomerAddSheet = ({
  children,
  open,
  onOpenChange,
}: CustomerAddSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add customer
        </Button>
      </Sheet.Trigger>
      <Sheet.Content className="sm:max-w-lg p-0">{children}</Sheet.Content>
    </Sheet>
  );
};

export const CustomerAddSheetHeader = () => {
  return (
    <Sheet.Header className="p-5">
      <Sheet.Title>Add contact</Sheet.Title>
    </Sheet.Header>
  );
};
