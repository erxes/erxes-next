import {
  IconCalendarTime,
  IconInfoCircle,
  IconProgressCheck,
  IconProgressX,
  IconSettings,
  IconSourceCode,
  IconUser,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import { RecordTable } from 'erxes-ui/modules';
import { RecordTableInlineCell } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { AvatarPopover } from '../utils';
import { Badge } from 'erxes-ui/components';
import { TablerIcon, TablerIconNamesType } from 'erxes-ui/icons';
import dayjs from 'dayjs';

const statusInfos = {
  success: {
    variant: 'success',
    Icon: IconProgressCheck,
  },
  failed: {
    variant: 'destructive',
    Icon: IconProgressX,
  },
};

const columns: ColumnDef<any>[] = [
  {
    id: 'status',
    accessorKey: 'status',
    header: () => (
      <RecordTable.InlineHead icon={IconInfoCircle} label="Status" />
    ),
    cell: ({ cell }) => {
      const { status } = (cell?.row?.original || {}) as {
        status: 'failed' | 'success';
      };

      const { Icon, variant } = statusInfos[status] || {};

      return (
        <RecordTableInlineCell
          containerClassName="justify-center"
          display={() => (
            <Badge
              className={`text-white [&>svg]:size-4`}
              variant={variant as 'success' | 'destructive'}
            >
              <Icon className="size-4" />
              {status}
            </Badge>
          )}
        />
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => (
      <RecordTable.InlineHead icon={IconCalendarTime} label="Created At" />
    ),
    cell: ({ cell }) => {
      const { createdAt } = cell?.row?.original || {};
      return (
        <RecordTableInlineCell
          containerClassName="justify-center"
          display={() => (
            <div>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
          )}
        />
      );
    },
  },
  {
    id: 'source',
    accessorKey: 'source',
    header: () => (
      <RecordTable.InlineHead icon={IconSourceCode} label="Source" />
    ),
    cell: ({ cell }) => {
      const { source } = cell?.row?.original || {};
      return (
        <RecordTableInlineCell
          containerClassName="justify-center"
          display={() => <div>{source}</div>}
        />
      );
    },
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: () => <RecordTable.InlineHead icon={IconSettings} label="Action" />,
    cell: ({ cell }) => {
      const { action } = cell?.row?.original || {};
      return (
        <RecordTableInlineCell
          containerClassName="justify-center"
          display={() => <div>{action}</div>}
        />
      );
    },
  },
  {
    id: 'userId',
    accessorKey: 'userId',
    header: () => <RecordTable.InlineHead icon={IconUser} label="User" />,
    cell: ({ cell }) => {
      const { userId, user } = cell?.row?.original || {};
      return <AvatarPopover user={user} />;
    },
  },
];

export default columns;
