import { IconPlus } from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui';
import { useState } from 'react';

export const PmsCreateSheet = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Create PMS
        </Button>
      </Sheet.Trigger>
      <Sheet.View
        className="p-0 sm:max-w-8xl"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        {/* <CreateTmsForm onOpenChange={setOpen} /> */}
      </Sheet.View>
    </Sheet>
  );
};

export const PmsCreateSheetHeader = () => {
  return (
    <Sheet.Header className="p-5 border-[#F4F4F5]">
      <Sheet.Title>Create PMS /Property Management System/</Sheet.Title>
      <Sheet.Close />
    </Sheet.Header>
  );
};
