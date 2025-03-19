import { IconTrash } from '@tabler/icons-react';

import { Button, CommandBar, Separator } from 'erxes-ui/components';
import { RecordTable } from 'erxes-ui/modules/record-table';
import { CustomerMerge } from '~/modules/contacts/components/customers-command-bar/merge/CustomerMerge';
export const ContactsCommandBar = () => {
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
        <CustomerMerge
          customers={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          disabled={table.getFilteredSelectedRowModel().rows.length != 2}
          rows={table.getFilteredSelectedRowModel().rows}
        />
      </CommandBar.Bar>
    </CommandBar>
  );
};
