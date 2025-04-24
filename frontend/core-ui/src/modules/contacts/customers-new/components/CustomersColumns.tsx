import { IconUser } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  Avatar,
  FullNameField,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  TextOverflowTooltip,
  EmailListField,
} from 'erxes-ui';
import { ICustomer } from 'ui-modules';

const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<ICustomer>;

export const customersColumns: ColumnDef<ICustomer>[] = [
  {
    id: 'more',
    cell: ({ row }) => <RecordTable.MoreButton />,
    size: 34,
  },
  checkBoxColumn,
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => {
      const { firstName, lastName, primaryEmail, _id, primaryPhone } =
        cell.row.original;
      return (
        <div className="flex items-center justify-center h-8">
          <Avatar>
            <Avatar.Image src={cell.getValue() as string} />
            <Avatar.Fallback colorSeed={_id}>
              {firstName?.charAt(0) ||
                lastName?.charAt(0) ||
                primaryEmail?.charAt(0) ||
                primaryPhone?.charAt(0) ||
                '-'}
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
    header: () => <RecordTable.InlineHead label="Name" />,
    cell: ({ cell }) => {
      const { firstName, lastName } = cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            {firstName} {lastName}
          </RecordTableCellTrigger>
          <RecordTableCellContent className="min-w-72">
            <FullNameField>
              <FullNameField.FirstName value={firstName} />
              <FullNameField.LastName value={lastName} />
            </FullNameField>
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 240,
  },
  {
    id: 'emails',
    accessorKey: 'primaryEmail',
    header: () => <RecordTable.InlineHead label="Emails" />,
    cell: ({ cell }) => {
      const { primaryEmail, _id, emailValidationStatus, emails } =
        cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <TextOverflowTooltip value={primaryEmail} />
          </RecordTableCellTrigger>
          <RecordTableCellContent className="min-w-72">
            <EmailListField
              recordId={_id}
              emails={[
                {
                  email: primaryEmail,
                  status: emailValidationStatus as 'verified' | 'unverified',
                  isPrimary: true,
                },
                ...(emails || []).map((email) => ({
                  email,
                  status: 'unverified' as 'verified' | 'unverified',
                })),
              ]}
            />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'phones',
    accessorKey: 'primaryPhone',
    header: () => <RecordTable.InlineHead label="Phones" />,
    cell: ({ cell }) => {
      const { primaryPhone } = cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <TextOverflowTooltip value={primaryPhone} />
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={primaryPhone} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'tagIds',
    accessorKey: 'tagIds',
    header: () => <RecordTable.InlineHead label="Tags" />,
    cell: ({ cell }) => {
      return (
        <div className="p-2 h-8">{(cell.getValue() as string[])?.join()}</div>
      );
    },
  },
  {
    id: 'lastSeenAt',
    accessorKey: 'lastSeenAt',
    header: () => <RecordTable.InlineHead label="Last Seen" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'sessionCount',
    accessorKey: 'sessionCount',
    header: () => <RecordTable.InlineHead label="Session Count" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          {cell.getValue() as number}
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => <RecordTable.InlineHead label="Created At" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
];
