import {
  IconAlignJustified,
  IconLabel,
  IconMessageCog,
  IconMessages,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  Input,
  Textarea,
  TextOverflowTooltip,
} from 'erxes-ui';
import { AssignMember, AssignMultipleMembers } from 'ui-modules/modules';
import { type TChannel } from '~/modules/settings/types/channel';

export const ChannelColumns: ColumnDef<TChannel>[] = [
  RecordTable.checkboxColumn as ColumnDef<TChannel>,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="name" icon={IconLabel} />,
    cell: ({ cell }) => (
      <RecordTablePopover>
        <RecordTableCellTrigger>
          <RecordTableCellDisplay>
            <TextOverflowTooltip value={cell.row.original.name} />
          </RecordTableCellDisplay>
        </RecordTableCellTrigger>
        <RecordTableCellContent>
          <Input value={cell.getValue() as string} />
        </RecordTableCellContent>
      </RecordTablePopover>
    ),
    size: 250,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => (
      <RecordTable.InlineHead label="description" icon={IconAlignJustified} />
    ),
    cell: ({ cell }) => (
      <RecordTablePopover>
        <RecordTableCellTrigger>
          <RecordTableCellDisplay>
            <TextOverflowTooltip value={cell.row.original.description} />
          </RecordTableCellDisplay>
        </RecordTableCellTrigger>
        <RecordTableCellContent>
          <Textarea value={cell.getValue() as string} />
        </RecordTableCellContent>
      </RecordTablePopover>
    ),
    size: 250,
  },
  {
    id: 'userId',
    accessorKey: 'userId',
    header: () => <RecordTable.InlineHead label="user" icon={IconUser} />,
    cell: ({ cell }) => (
      <RecordTableCellDisplay className="justify-center">
        <AssignMember
          className="shadow-none bg-transparent"
          value={cell.getValue() as string}
        />
      </RecordTableCellDisplay>
    ),
    size: 250,
  },
  {
    id: 'memberIds',
    accessorKey: 'memberIds',
    header: () => (
      <RecordTable.InlineHead label="users" icon={IconUsersGroup} />
    ),
    cell: ({ cell }) => (
      <RecordTableCellDisplay className="justify-center">
        <AssignMultipleMembers
          className="shadow-none bg-transparent"
          value={cell.getValue() as string[]}
        />
      </RecordTableCellDisplay>
    ),
    size: 250,
  },
  {
    id: 'conversationCount',
    accessorKey: 'conversationCount',
    header: () => (
      <RecordTable.InlineHead label="Conversations" icon={IconMessages} />
    ),
    cell: ({ cell }) => (
      <RecordTableCellDisplay className="justify-center">
        {cell.getValue() as number}
      </RecordTableCellDisplay>
    ),
  },
  {
    id: 'integrationsCount',
    accessorKey: 'integrationIds',
    header: () => (
      <RecordTable.InlineHead label="Integrations" icon={IconMessageCog} />
    ),
    cell: ({ cell }) => {
      const { integrationIds } = cell.row.original || [];
      return (
        <RecordTableCellDisplay className="justify-center">
          {integrationIds?.length as number}
        </RecordTableCellDisplay>
      );
    },
  },
];
