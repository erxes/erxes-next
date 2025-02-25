import { IconCirclePlus, IconLoader } from '@tabler/icons-react';

import { Button, Command } from 'erxes-ui/components';

import { useSelectTags } from '@/tags/contexts/SelectTagsContext';

export const SelectTagsEmpty = ({
  loading,
  single,
}: {
  loading: boolean;
  single: boolean;
}) => {
  const { openCreateTag, sub } = useSelectTags();

  if (loading)
    return (
      <Command.Empty>
        <div className="flex items-center justify-center h-full">
          <IconLoader className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      </Command.Empty>
    );

  return (
    <Command.Empty>
      <div>
        <div className="w-full justify-center items-center">
          <p className="text-muted-foreground p-2 ">No results found.</p>
        </div>
        {!sub && !single && (
          <Button variant="secondary" onClick={openCreateTag}>
            <IconCirclePlus />
            Create new tag
          </Button>
        )}
      </div>
    </Command.Empty>
  );
};
