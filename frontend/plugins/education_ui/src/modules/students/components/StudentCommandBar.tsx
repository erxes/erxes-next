import { IconCopy, IconTrash } from '@tabler/icons-react';

import { Button, CommandBar, RecordTable, Separator } from 'erxes-ui';

export const StudentCommandBar = () => {
  const { table } = RecordTable.useRecordTable();

  return (
    <CommandBar open={table.getFilteredSelectedRowModel().rows.length > 0}>
      <CommandBar.Bar>
        <CommandBar.Value>
          {table.getFilteredSelectedRowModel().rows.length} selected
        </CommandBar.Value>
        <Separator.Inline />
        <Button variant="secondary" className="bg-red-500 text-white">
          <IconTrash className="text-white" />
          Delete
        </Button>
        <Separator.Inline />
        <Button variant="secondary">
          <IconCopy />
          Copy
        </Button>
      </CommandBar.Bar>
    </CommandBar>
  );
};
