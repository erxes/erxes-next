import { Sheet, Button } from 'erxes-ui/components';
import { IconPlus } from '@tabler/icons-react';

export const ProductAddSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Sheet>
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
