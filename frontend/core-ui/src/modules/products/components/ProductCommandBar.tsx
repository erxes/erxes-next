import { IconPlus, IconTrash } from '@tabler/icons-react';

import { Button, CommandBar, Separator } from 'erxes-ui/components';
import { RecordTable } from 'erxes-ui/modules/record-table';

export const ProductCommandBar = () => {
  const { table } = RecordTable.useRecordTable();

  return (
    <CommandBar open={table.getFilteredSelectedRowModel().rows.length > 0}>
      <CommandBar.Bar>
        <CommandBar.Value>
          {table.getFilteredSelectedRowModel().rows.length} selected
        </CommandBar.Value>
        <Separator.Inline />
        <Button variant="secondary">
          <IconTrash />
          Delete
        </Button>
        <Separator.Inline />
        <Button variant="secondary">
          <IconPlus />
          Create
        </Button>
      </CommandBar.Bar>
    </CommandBar>
  );
};
