import { CommandBar } from 'erxes-ui/components';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { RecordTable } from 'erxes-ui/modules/record-table';

export const ProductCommandBar = () => {
  const { table } = RecordTable.useRecordTable();

  return (
    <CommandBar open={table.getFilteredSelectedRowModel().rows.length > 0}>
      <CommandBar.Bar>
        <CommandBar.Value>
          {table.getFilteredSelectedRowModel().rows.length} selected
        </CommandBar.Value>
        <CommandBar.Seperator />
        <CommandBar.Command shortcut="D" action={() => console.log('delete')}>
          <IconTrash className="w-4 h-4" />
          Delete
        </CommandBar.Command>
        <CommandBar.Seperator />
        <CommandBar.Command
          shortcut="P"
          action={() => console.log('create product')}
        >
          <IconPlus className="w-4 h-4" />
          Create
        </CommandBar.Command>
      </CommandBar.Bar>
    </CommandBar>
  );
};
