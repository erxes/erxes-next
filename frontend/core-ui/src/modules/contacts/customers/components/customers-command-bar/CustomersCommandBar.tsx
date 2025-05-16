import { CustomersDelete } from '@/contacts/customers/components/customers-command-bar/delete/CustomersDelete';
import { CommandBar, Separator } from 'erxes-ui/components';
import { RecordTable } from 'erxes-ui/modules/record-table';
import { CustomersMerge } from '@/contacts/customers/components/customers-command-bar/merge/CustomersMerge';
import { CustomersTag } from '@/contacts/customers/components/customers-command-bar/tag/CustomersTag';
export const CustomersCommandBar = () => {
  const { table } = RecordTable.useRecordTable();
  return (
    <CommandBar open={table.getFilteredSelectedRowModel().rows.length > 0}>
      <CommandBar.Bar>
        <CommandBar.Value>
          {table.getFilteredSelectedRowModel().rows.length} selected
        </CommandBar.Value>
        <Separator.Inline />
        <CustomersDelete
          customerIds={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original._id)}
        />
        <Separator.Inline />
        <CustomersTag customers={table.getFilteredSelectedRowModel().rows.map((row) => row.original)} />
        <Separator.Inline />
        <CustomersMerge
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
