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
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';

import { useCustomerEdit } from '@/contacts/hooks/useEditCustomer';
import { Customer } from '@/contacts/types/contactsTypes';
import { TagBadges } from '@/tags/components/tagBadges';
import { SelectTags } from '@/tags/components/SelectTags';
import { ContactEmailColumnCell } from '@/contacts/components/ContactEmailColumnCell';
import { ITag } from '@/tags/types/tagTypes';
import { ContactPhoneColumnCell } from '@/contacts/components/ContactPhoneColumnCell';

const TableTextInput = ({ cell }: { cell: Cell<Customer, unknown> }) => {
  const [value, setValue] = useState(cell.getValue() as string);
  const { customerEdit } = useCustomerEdit();
  return (
    <RecordTableInlineCell
      onSave={() => {
        customerEdit({
          variables: {
            id: cell.row.original._id,
            [cell.column.id]: value,
          },
        });
      }}
      getValue={() => cell.getValue()}
      value={value}
      display={() => value}
      edit={() => (
        <RecordTableInlineCellEditForm>
          <TextFieldInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </RecordTableInlineCellEditForm>
      )}
    />
  );
};

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
    id: 'firstName',
    accessorKey: 'firstName',
    header: () => <RecordTableInlineHead icon={IconAlignLeft} label="Name" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'primaryEmail',
    accessorKey: 'primaryEmail',
    header: () => (
      <RecordTableInlineHead icon={IconMail} label="Primary Email" />
    ),
    cell: ({ cell }) => <ContactEmailColumnCell cell={cell} />,
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
];
