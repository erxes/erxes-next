import { ColumnDef } from '@tanstack/react-table';
import { IAccount } from '../type/Account';
import { InlineCell, InlineCellDisplay, RecordTable } from 'erxes-ui';
import { IconUser } from '@tabler/icons-react';

export const accountsColumns: ColumnDef<IAccount>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => {
      return (
        <InlineCell
          name={cell.row.original.name}
          recordId={cell.row.original._id}
          display={() => (
            <InlineCellDisplay>{cell.getValue() as string}</InlineCellDisplay>
          )}
        />
      );
    },
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => {
      return (
        <InlineCell
          name={cell.row.original.code}
          recordId={cell.row.original._id}
          display={() => (
            <InlineCellDisplay>{cell.getValue() as string}</InlineCellDisplay>
          )}
        />
      );
    },
  },
];
