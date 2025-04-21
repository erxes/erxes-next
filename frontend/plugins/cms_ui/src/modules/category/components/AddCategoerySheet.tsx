import { IconPlus } from '@tabler/icons-react';

import { Button, Sheet } from 'erxes-ui';

interface TagAddSheetProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}
export const CategoryAddSheet = ({
  children,
  onOpenChange,
  open,
}: TagAddSheetProps) => {
  return (
    <Sheet onOpenChange={onOpenChange} open={open} modal>
      <Sheet.Trigger asChild>
        <div className="flex items-center gap-2 text-gray-500">
          <Button>
            <IconPlus /> Add Category
          </Button>
        </div>
      </Sheet.Trigger>
      <Sheet.Content className="sm:max-w-lg p-0">{children}</Sheet.Content>
    </Sheet>
  );
};

export const CategoryAddSheetHeader = () => {
  return (
    <Sheet.Header>
      <Sheet.Title>Create new Category</Sheet.Title>
      <Sheet.Description>
        Create and configure your category & services
      </Sheet.Description>
    </Sheet.Header>
  );
};
