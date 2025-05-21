import {
  IconAlignJustified,
  IconLabel,
  IconMessageCog,
  IconMessages,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import { Cell, ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  Input,
  Textarea,
  TextOverflowTooltip,
  useQueryState,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { AssignMember, SelectMember } from 'ui-modules/modules';
import {
  ChannelHotKeyScope,
  type TChannel,
} from '~/modules/settings/types/channel';
import { renderingChannelDetailAtom } from '../../states/renderingChannelDetail';
import { useChannelsEdit } from '../../hooks/useChannelsEdit';

export const MoreColumnCell = ({ cell }: { cell: Cell<TChannel, unknown> }) => {
  const [, setOpen] = useQueryState('channel_id');
  const setRenderingChannelDetail = useSetAtom(renderingChannelDetailAtom);
  const { _id } = cell.row.original;
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingChannelDetail(false);
      }}
    />
  );
};

export const ChannelColumns: ColumnDef<TChannel>[] = [
  {
    id: 'more',
    cell: MoreColumnCell,
    size: 33,
  },
  RecordTable.checkboxColumn as ColumnDef<TChannel>,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="name" icon={IconLabel} />,
    cell: ({ cell }) => {
      const { channelsEdit } = useChannelsEdit();
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableCellDisplay>
              <TextOverflowTooltip value={cell.row.original.name} />
            </RecordTableCellDisplay>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input
              value={cell.getValue() as string}
              onChange={(e) =>
                channelsEdit(
                  {
                    variables: {
                      id: cell.row.original._id,
                      name: cell.row.original.name,
                    },
                  },
                  ['name'],
                )
              }
            />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 250,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => (
      <RecordTable.InlineHead label="description" icon={IconAlignJustified} />
    ),
    cell: ({ cell }) => {
      const { channelsEdit } = useChannelsEdit();
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableCellDisplay>
              <TextOverflowTooltip value={cell.row.original.description} />
            </RecordTableCellDisplay>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Textarea
              value={cell.getValue() as string}
              onChange={(e) =>
                channelsEdit(
                  {
                    variables: {
                      id: cell.row.original._id,
                      name: cell.row.original.name,
                      description: e.currentTarget.value,
                    },
                  },
                  ['description'],
                )
              }
            />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 250,
  },
  {
    id: 'memberIds',
    accessorKey: 'memberIds',
    header: () => (
      <RecordTable.InlineHead label="users" icon={IconUsersGroup} />
    ),
    cell: ({ cell }) => {
      const { channelsEdit } = useChannelsEdit();
      return (
        <RecordTableCellDisplay className="justify-center">
          -
        </RecordTableCellDisplay>
        // <SelectMember.InlineCell
        //   scope={
        //     ChannelHotKeyScope.ChannelSettingsPage +
        //     '.' +
        //     cell.row.original._id +
        //     '.users'
        //   }
        //   value={cell.getValue() as string[]}
        //   onValueChange={(value) =>
        //     channelsEdit(
        //       {
        //         variables: { _id: cell.row.original._id, memberIds: value },
        //       },
        //       ['memberIds'],
        //     )
        //   }
        // />
      );
    },
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
