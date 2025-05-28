import {
  IconBuilding,
  IconChartBar,
  IconLabel,
  IconMobiledata,
  IconPhone,
  IconClock,
  IconFileDescription
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  TextOverflowTooltip,
  RecordTableCellDisplay,
  Badge,
} from 'erxes-ui';
import { posMoreColumn } from './posMoreColumn';
import { IPos } from '../types/pos';

export const posColumns: ColumnDef<IPos>[] = [
  posMoreColumn,
  RecordTable.checkboxColumn as ColumnDef<IPos>,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead icon={IconLabel} label="Name" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'isOnline',
    accessorKey: 'isOnline',
    header: () => <RecordTable.InlineHead icon={IconMobiledata} label="Status" />,
    cell: ({ cell }) => {
      const value = cell.getValue() as boolean;
      return (
        <RecordTableCellDisplay>
          <Badge variant={value ? "success" : "secondary"}>
            {value ? 'Online' : 'Offline'}
          </Badge>
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'onServer',
    accessorKey: 'onServer',
    header: () => <RecordTable.InlineHead icon={IconPhone} label="Server Status" />,
    cell: ({ cell }) => {
      const value = cell.getValue() as boolean;
      return (
        <RecordTableCellDisplay>
          <Badge variant="default">
            {value ? 'On Server' : 'Local Only'}
          </Badge>
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'branchTitle',
    accessorKey: 'branchTitle',
    header: () => <RecordTable.InlineHead icon={IconBuilding} label="Branch" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'departmentTitle',
    accessorKey: 'departmentTitle',
    header: () => <RecordTable.InlineHead icon={IconChartBar} label="Department" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => <RecordTable.InlineHead icon={IconClock} label="Created at" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => <RecordTable.InlineHead icon={IconFileDescription} label="description" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
];