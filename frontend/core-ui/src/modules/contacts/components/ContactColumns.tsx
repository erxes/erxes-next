import { useState } from 'react';

import {
  IconAlignLeft,
  IconHistory,
  IconMail,
  IconPhone,
  IconTag,
  IconUser,
} from '@tabler/icons-react';
import type { ColumnDef, Cell } from '@tanstack/react-table';

import { Avatar } from 'erxes-ui/components/avatar';
import { RelativeDateDisplay } from 'erxes-ui/components/display/relativeDateDisplay';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';

import { Customer } from '@/contacts/types/contactsTypes';
import { TagBadges } from '@/tags/components/tagBadges';
import { SelectTags } from '@/tags/components/SelectTags';
import { ContactEmailColumnCell } from '@/contacts/components/ContactEmailColumnCell';
import { ITag } from '@/tags/types/tagTypes';
import { ContactPhoneColumnCell } from '@/contacts/components/ContactPhoneColumnCell';
import { FullNameField } from '../customer-edit/components/FullNameField';
import { EmailField } from '../customer-edit/components/EmailField';
import { TextField } from '../customer-edit/components/TextField';

export const contactColumns: ColumnDef<Customer>[] = [
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTableInlineHead icon={IconUser} label="" />,
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
    cell: ({ cell }) => <ContactPhoneColumnCell cell={cell} />,
  },

  {
    id: 'tagIds',
    accessorKey: 'tagIds',
    header: () => <RecordTableInlineHead icon={IconTag} label="Tags" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell
        display={() => (
          <div className="flex gap-1">
            <TagBadges tagIds={cell.getValue() as string[]} />
          </div>
        )}
        edit={() => {
          const [selectedTags, setSelectedTags] = useState<string[]>(
            (cell.getValue() as ITag[]).map((tag) => tag._id),
          );
          const handleSelect = (tags: string[] | string) => {
            setSelectedTags(tags as string[]);
          };
          return (
            <RecordTableInlineCellEditForm>
              <SelectTags selected={selectedTags} onSelect={handleSelect} />
            </RecordTableInlineCellEditForm>
          );
        }}
      />
    ),
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
    cell: ({ cell }: { cell: Cell<Customer, unknown> }) => (
      <TextField
        _id={cell.row.original._id}
        field={field}
        value={cell.getValue() as string}
      />
    ),
  })),
];
