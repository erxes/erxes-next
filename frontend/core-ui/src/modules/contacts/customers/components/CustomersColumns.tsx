import {
  IconAlignLeft,
  IconHistory,
  IconMail,
  IconPhone,
  IconTag,
  IconUser,
} from '@tabler/icons-react';
import type { ColumnDef, Cell } from '@tanstack/react-table';

import { Avatar, RecordTable, RelativeDateDisplay } from 'erxes-ui';
import { RecordTableInlineHead } from 'erxes-ui';
import { RecordTableInlineCell } from 'erxes-ui';

import { ICustomer } from '@/contacts/types/customerType';
import { TagsField } from '@/contacts/customers/customer-edit/components/TagsField';
import { FullNameField } from '@/contacts/customers/customer-edit/components/FullNameField';
import { EmailField } from '@/contacts/customers/customer-edit/components/EmailField';
import { PhoneField } from '@/contacts/customers/customer-edit/components/PhoneField';
import { TextFieldCustomer } from '@/contacts/customers/customer-edit/components/TextField';

export const customersColumns: ColumnDef<ICustomer>[] = [
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell
        display={() => (
          <Avatar>
            <Avatar.Image src={cell.getValue() as string} />
            <Avatar.Fallback colorSeed={cell.row.original._id}>
              {cell.row.original.firstName?.charAt(0) ||
                cell.row.original.lastName?.charAt(0) ||
                cell.row.original.primaryEmail?.charAt(0)}
            </Avatar.Fallback>
          </Avatar>
        )}
      />
    ),
    size: 34,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTableInlineHead icon={IconAlignLeft} label="Name" />,
    cell: ({ cell }) => {
      const { firstName, lastName, middleName, _id } = cell.row.original;

      return (
        <FullNameField
          _id={_id}
          firstName={firstName || ''}
          lastName={
            middleName
              ? `${middleName || ''} ${lastName || ''}`
              : lastName || ''
          }
        />
      );
    },
  },
  {
    id: 'primaryEmail',
    accessorKey: 'primaryEmail',
    header: () => (
      <RecordTableInlineHead icon={IconMail} label="Primary Email" />
    ),
    cell: ({ cell }) => {
      const { primaryEmail, emails, _id } = cell.row.original;
      return (
        <EmailField
          primaryEmail={primaryEmail || ''}
          emails={emails || []}
          _id={_id}
        />
      );
    },
  },

  {
    id: 'primaryPhone',
    accessorKey: 'primaryPhone',
    header: () => (
      <RecordTableInlineHead icon={IconPhone} label="Primary Phone" />
    ),
    cell: ({ cell }) => {
      const { primaryPhone, phones, _id, location } = cell.row.original;
      return (
        <PhoneField
          primaryPhone={primaryPhone || ''}
          phones={phones || []}
          defaultCountryCode={location?.countryCode}
          _id={_id}
        />
      );
    },
  },

  {
    id: 'tagIds',
    accessorKey: 'tagIds',
    header: () => <RecordTableInlineHead icon={IconTag} label="Tags" />,
    cell: ({ cell }) => {
      return (
        <TagsField
          _id={cell.row.original._id}
          tagType="core:customer"
          selected={cell.row.original.tagIds}
          recordId={cell.row.original._id}
        />
      );
    },
  },
  {
    id: 'lastSeenAt',
    accessorKey: 'lastSeenAt',
    header: () => (
      <RecordTableInlineHead icon={IconHistory} label="Last Seen" />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell
        display={() => (
          <RelativeDateDisplay value={cell.getValue() as string} />
        )}
      />
    ),
  },
  {
    id: 'sessionCount',
    accessorKey: 'sessionCount',
    header: () => (
      <RecordTableInlineHead icon={IconUser} label="Session Count" />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell display={() => <>{cell.getValue() as number}</>} />
    ),
  },
  {
    id: 'profileScore',
    accessorKey: 'score',
    header: () => (
      <RecordTableInlineHead icon={IconUser} label="Profile Score" />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell display={() => <>{cell.getValue() as number}</>} />
    ),
  },
  ...['position', 'department', 'leadStatus'].map((field) => ({
    id: field,
    accessorKey: field,
    header: () => <RecordTableInlineHead icon={IconAlignLeft} label={field} />,
    cell: ({ cell }: { cell: Cell<ICustomer, unknown> }) => (
      <TextFieldCustomer
        _id={cell.row.original._id}
        field={field}
        value={cell.getValue() as string}
      />
    ),
  })),
];
