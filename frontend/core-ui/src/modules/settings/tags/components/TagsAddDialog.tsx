import { Button, Dialog, Kbd, useScopedHotkeys } from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { SettingsHotKeyScope } from '@/types/SettingsHotKeyScope';
import { useState } from 'react';
import { CreateTagForm } from 'ui-modules';

export const TagsAddDialog = () => {
  const [open, setOpen] = useState(false);

  useScopedHotkeys(`c`, () => setOpen(true), SettingsHotKeyScope.TagsPage);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Add Tag
          <Kbd>C</Kbd>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.HeaderCombined
          title="Add Tag"
          description="Add a new tag to the system."
        />
        <CreateTagForm />
      </Dialog.Content>
    </Dialog>
  );
};
