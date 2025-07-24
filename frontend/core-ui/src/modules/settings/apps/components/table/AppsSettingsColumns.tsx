import { IApp } from '@/settings/apps/types';
import { ColumnDef } from '@tanstack/table-core';
import { format } from 'date-fns';
import { RecordTableCellDisplay } from 'erxes-ui';

export const appsSettingsColumns: ColumnDef<IApp>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'App Name',
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        {cell.getValue() as string}
      </RecordTableCellDisplay>
    ),
  },
  {
    id: 'clientId',
    accessorKey: 'clientId',
    header: 'Client ID',
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        {cell.getValue() as string}
      </RecordTableCellDisplay>
    ),
  },
  {
    id: 'clientSecret',
    accessorKey: 'clientSecret',
    header: 'Client Secret',
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        {cell.getValue() as string}
      </RecordTableCellDisplay>
    ),
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        {format(new Date(cell.getValue() as string), 'yyyy/MM/dd') ||
          'YYYY/MM/DD'}
      </RecordTableCellDisplay>
    ),
  },
];
