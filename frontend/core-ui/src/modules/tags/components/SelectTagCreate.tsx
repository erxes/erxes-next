import { IconChevronLeft } from '@tabler/icons-react';

import { Button, Tabs } from 'erxes-ui/components';

export function SelectTagCreateContainer({
  children,
  onBack,
}: {
  children: React.ReactNode;
  onBack: () => void;
}) {
  return (
    <Tabs.Content value="create" asChild>
      <div className=" p-2 overflow-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack} size="icon">
            <IconChevronLeft className="w-4 h-4" />
          </Button>
          <h6 className="text-sm font-medium">Create new tag</h6>
        </div>
        {children}
      </div>
    </Tabs.Content>
  );
}
