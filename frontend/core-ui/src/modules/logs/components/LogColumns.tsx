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
import dayjs from 'dayjs';
import {
  Avatar,
  Badge,
  RecordTable,
  RecordTableCellDisplay,
  RelativeDateDisplay,
} from 'erxes-ui';
import { LogDetailDialog } from './LogDetail';
import { readImage } from 'erxes-ui';
import { IUser } from '@/settings/team-member/types';

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

const generateUserName = (user: IUser) => {
  if (user?.details?.firstName || user?.details?.lastName) {
    return `${user.details?.firstName || ''} ${user.details?.lastName || ''}`;
  }

  return user.email;
};

export const logColumns: ColumnDef<any>[] = [
  {
    id: 'detail',
    cell: ({ cell }) => {
      const { payload, ...doc } = cell?.row?.original || {};
      return (
        <RecordTableCellDisplay>
          <LogDetailDialog
            doc={{ ...doc, payload: JSON.parse(payload || '{}') }}
          />
        </RecordTableCellDisplay>
      );
    },
    size: 20,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => (
      <RecordTable.InlineHead icon={IconInfoCircle} label="Status" />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue() as 'failed' | 'success';

      const { Icon, variant } = statusInfos[status] || {};

      return (
        <RecordTableCellDisplay>
          <Badge variant={variant as 'success' | 'destructive'}>
            <Icon className="size-4" />
            {status}
          </Badge>
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => (
      <RecordTable.InlineHead icon={IconCalendarTime} label="Created At" />
    ),
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        <RelativeDateDisplay.Value
          value={dayjs(cell.getValue() as string).format('YYYY-MM-DD HH:mm:ss')}
        />
      </RecordTableCellDisplay>
    ),
  },
  {
    id: 'source',
    accessorKey: 'source',
    header: () => (
      <RecordTable.InlineHead icon={IconSourceCode} label="Source" />
    ),
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        {cell.getValue() as string}
      </RecordTableCellDisplay>
    ),
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: () => <RecordTable.InlineHead icon={IconSettings} label="Action" />,
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        {cell.getValue() as string}
      </RecordTableCellDisplay>
    ),
  },
  {
    id: 'userId',
    accessorKey: 'userId',
    header: () => <RecordTable.InlineHead icon={IconUser} label="User" />,
    cell: ({ cell }) => {
      const { user = {}, userId } = cell?.row?.original || {};
      if (!userId) {
        return (
          <RecordTableCellDisplay className="text-border">
            No User
          </RecordTableCellDisplay>
        );
      }
      const { details } = user as IUser;
      return (
        <RecordTableCellDisplay>
          <Avatar className="h-6 w-6 rounded-full">
            <Avatar.Image
              src={readImage(details?.avatar)}
              alt={details?.fullName || ''}
            />
            <Avatar.Fallback className="rounded-lg text-black">
              {(details?.fullName || '').split('')[0]}
            </Avatar.Fallback>
          </Avatar>
          {generateUserName(user)}
        </RecordTableCellDisplay>
      );
    },
  },
];
