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
import { RecordTableInlineHead, RecordTableInlineCell } from 'erxes-ui';

import { TCompany } from '@/contacts/types/companyType';
import { TagsField } from '@/contacts/companies/company-edit/TagsField';
import { EmailField } from '@/contacts/companies/company-edit/EmailField';
import { CompanyTextField } from '@/contacts/companies/company-edit/TextField';
import { PhoneField } from '@/contacts/companies/company-edit/PhoneField';

export const companyColumns: ColumnDef<TCompany>[] = [
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell
          display={() => (
            <Avatar>
              <Avatar.Image src={cell.getValue() as string} />
              <Avatar.Fallback colorSeed={cell.row.original._id}>
                {cell.row.original.primaryName?.charAt(0)}
              </Avatar.Fallback>
            </Avatar>
          )}
        />
      );
    },
    size: 34,
  },
  {
    id: 'primaryName',
    accessorKey: 'primaryName',
    header: () => (
      <RecordTableInlineHead icon={IconAlignLeft} label="Primary Name" />
    ),
    cell: ({ cell }) => {
      return (
        <CompanyTextField
          value={cell.getValue() as string}
          field="primaryName"
          _id={cell.row.original._id}
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
    header: () => {
      return <RecordTableInlineHead icon={IconPhone} label="Primary Phone" />;
    },
    cell: ({ cell }) => {
      const { _id, primaryPhone, phones, location } = cell.row.original;
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
          tagType="core:company"
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
    cell: ({ cell }: { cell: Cell<TCompany, unknown> }) => (
      <CompanyTextField
        _id={cell.row.original._id}
        field={field}
        value={cell.getValue() as string}
      />
    ),
  })),
];
