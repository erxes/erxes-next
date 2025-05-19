import { IconPlus } from '@tabler/icons-react';

import { Button, Sheet } from 'erxes-ui';

interface TagAddSheetProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}
export const CustomTypeAddSheet = ({
  children,
  onOpenChange,
  open,
}: TagAddSheetProps) => {
  return (
    <Sheet onOpenChange={onOpenChange} open={open} modal>
      <Sheet.Trigger asChild>
        <div className="flex items-center gap-2 text-gray-500">
          <Button>
            <IconPlus /> Add Custom Type
          </Button>
        </div>
      </Sheet.Trigger>
      <Sheet.Content className="sm:max-w-lg p-0">{children}</Sheet.Content>
    </Sheet>
  );
};

export const CustomTypeAddSheetHeader = () => {
  return (
    <Sheet.Header>
      <Sheet.Title>Create new CustomType</Sheet.Title>
      <Sheet.Description>
        Create and configure your CustomType & services
      </Sheet.Description>
    </Sheet.Header>
  );
};
