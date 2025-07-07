import { IconPlus } from '@tabler/icons-react';
import { Button, CommandBar, RecordTable, Separator } from 'erxes-ui';
import { useState } from 'react';
import { ContractTypesDelete } from '~/modules/contractTypes/components/ContractTypeDelete';

export const ContractTypeCommandBar = () => {
  const { table } = RecordTable.useRecordTable();
  const [refreshKey, setRefreshKey] = useState(0);

  const resetSelection = () => {
    table.resetRowSelection(true);
    setRefreshKey((prev) => prev + 1);
  };

  console.log(
    2222,
    table
      .getSelectedRowModel()
      .rows.map((row) => row.original._id)
      .join(','),
  );

  return (
    <CommandBar
      key={refreshKey}
      open={table.getFilteredSelectedRowModel().rows.length > 0}
    >
      <CommandBar.Bar>
        <CommandBar.Value>
          {table.getFilteredSelectedRowModel().rows.length} selected
        </CommandBar.Value>
        <Separator.Inline />
        <ContractTypesDelete
          contractTypeIds={table
            .getSelectedRowModel()
            .rows.map((row) => row.original._id)
            .join(',')}
          onDeleteSuccess={resetSelection}
        />
        <Separator.Inline />
        <Button variant="secondary">
          <IconPlus />
          Create
        </Button>
      </CommandBar.Bar>
    </CommandBar>
  );
};
