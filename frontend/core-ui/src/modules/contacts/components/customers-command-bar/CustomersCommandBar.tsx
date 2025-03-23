import { CustomerDelete } from '@/contacts/components/customers-command-bar/delete/CustomerDelete';
import { CommandBar, Separator } from 'erxes-ui/components';
import { RecordTable } from 'erxes-ui/modules/record-table';
import { CustomerMerge } from '@/contacts/components/customers-command-bar/merge/CustomerMerge';
export const ContactsCommandBar = () => {
  const { table } = RecordTable.useRecordTable();

  return (
    <CommandBar open={table.getFilteredSelectedRowModel().rows.length > 0}>
      <CommandBar.Bar>
        <CommandBar.Value>
          {table.getFilteredSelectedRowModel().rows.length} selected
        </CommandBar.Value>
        <Separator.Inline />
        <CustomerDelete
          customerIds={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original._id)}
        />
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
