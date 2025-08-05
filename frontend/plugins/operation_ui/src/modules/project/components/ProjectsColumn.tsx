import {
  IconCalendarPlus,
  IconLabelFilled,
  IconTags,
  IconUser,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  Avatar,
  RecordTable,
  RecordTableCellDisplay,
  RelativeDateDisplay,
  readImage,
} from 'erxes-ui';

// import { IProjec, SelectTags } from 'ui-modules';

const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<any>;

export const projectsColumns: ColumnDef<any>[] = [
  checkBoxColumn,
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => {
      const { firstName, lastName } = cell.row.original;
      return (
        <div className="flex items-center justify-center h-8">
          <Avatar size="lg">
            <Avatar.Image src={readImage(cell.getValue() as string)} />
            <Avatar.Fallback>
              {firstName?.charAt(0) || lastName?.charAt(0) || '-'}
            </Avatar.Fallback>
          </Avatar>
        </div>
      );
    },
    size: 34,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: () => (
      <RecordTable.InlineHead label="Name" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      return <div>132</div>;
    },
    size: 240,
  },

  {
    id: 'tagIds',
    accessorKey: 'tagIds',
    header: () => <RecordTable.InlineHead label="Tags" icon={IconTags} />,
    cell: ({ cell }) => {
      return <div>123</div>;
    },
    size: 360,
  },

  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => (
      <RecordTable.InlineHead label="Created At" icon={IconCalendarPlus} />
    ),
    cell: ({ cell }) => {
      return (
        <RelativeDateDisplay value={cell.getValue() as string} asChild>
          <RecordTableCellDisplay>
            <RelativeDateDisplay.Value value={cell.getValue() as string} />
          </RecordTableCellDisplay>
        </RelativeDateDisplay>
      );
    },
  },
];
