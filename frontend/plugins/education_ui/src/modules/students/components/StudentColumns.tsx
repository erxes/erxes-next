import type { ColumnDef } from '@tanstack/react-table';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import {
  Avatar,
  InlineCell,
  RecordTable,
  RecordTableCellDisplay,
  Switch,
  TextOverflowTooltip,
} from 'erxes-ui';
import { IStudent } from '@/students/types/type';
import {
  IconAlignLeft,
  IconChecks,
  IconMail,
  IconUser,
} from '@tabler/icons-react';

const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<IStudent>;

export const studentColumns: ColumnDef<IStudent>[] = [
  checkBoxColumn,
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => (
      <InlineCell
        name="avatar"
        className="flex items-center justify-center"
        recordId={cell.row.original._id}
        display={() => (
          <Avatar>
            <Avatar.Image src={cell.getValue() as string} />
            <Avatar.Fallback>
              {cell.row.original.details.firstName?.charAt(0) ||
                cell.row.original.details.lastName?.charAt(0) ||
                cell.row.original.email?.charAt(0)}
            </Avatar.Fallback>
          </Avatar>
        )}
      />
    ),
    size: 34,
  },
  {
    id: 'firstName',
    accessorKey: 'firstName',
    header: () => (
      <RecordTableInlineHead icon={IconAlignLeft} label="First name" />
    ),
    cell: ({ cell }) => {
      const {
        details: { firstName },
      } = cell.row.original;
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={firstName as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'lastName',
    accessorKey: 'lastName',
    header: () => (
      <RecordTableInlineHead icon={IconAlignLeft} label="Last Name" />
    ),
    cell: ({ cell }) => {
      const {
        details: { lastName },
      } = cell.row.original;
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={lastName as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: () => <RecordTableInlineHead icon={IconMail} label="Email" />,
    cell: ({ cell }) => {
      const { email } = cell.row.original;
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={email as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: () => <RecordTable.InlineHead icon={IconChecks} label="Status" />,
    cell: ({ cell }) => (
      <InlineCell
        name="isActive"
        className="flex items-center justify-center"
        recordId={cell.row.original._id}
        display={() => (
          <Switch className="mx-auto" checked={cell.row.original.isActive} />
        )}
      />
    ),
  },
];
