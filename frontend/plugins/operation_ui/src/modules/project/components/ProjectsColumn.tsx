import { IconLabelFilled } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import { RecordTable } from 'erxes-ui';

export const projectsColumns: ColumnDef<any>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => (
      <RecordTable.InlineHead label="Name" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      return <div>dadaaas</div>;
    },
    size: 240,
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    header: () => (
      <RecordTable.InlineHead label="Priority" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      return <div>dadaaas</div>;
    },
    size: 240,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => (
      <RecordTable.InlineHead label="Status" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      return <div>dadaaas</div>;
    },
    size: 240,
  },

  {
    id: 'Lead',
    header: () => (
      <RecordTable.InlineHead label="Lead" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      return <div>dadaaas</div>;
    },
    size: 240,
  },

  {
    id: 'targetDate',
    accessorKey: 'targetDate',
    header: () => (
      <RecordTable.InlineHead label="Target Date" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      return <div>dadaaas</div>;
    },
    size: 240,
  },
];
