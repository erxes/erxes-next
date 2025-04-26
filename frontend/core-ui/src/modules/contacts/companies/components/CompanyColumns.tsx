import { IconAlignLeft, IconUser } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';

import {
  Avatar,
  EmailListField,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  TextOverflowTooltip,
} from 'erxes-ui';

import { TCompany } from '@/contacts/types/companyType';
import { SelectTags } from 'ui-modules';
import { useState } from 'react';

export const companyColumns: ColumnDef<TCompany>[] = [
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => {
      const { _id, primaryName, primaryEmail, primaryPhone } =
        cell.row.original;
      return (
        <div className="flex items-center justify-center h-8">
          <Avatar>
            <Avatar.Image src={cell.getValue() as string} />
            <Avatar.Fallback colorSeed={_id}>
              {primaryName?.charAt(0) ||
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
    id: 'primaryName',
    accessorKey: 'primaryName',
    header: () => (
      <RecordTable.InlineHead icon={IconAlignLeft} label="Primary Name" />
    ),
    cell: ({ cell }) => {
      const { primaryName } = cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>{primaryName}</RecordTableCellTrigger>
          <RecordTableCellContent className="min-w-72">
            <Input value={primaryName} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'emails',
    accessorKey: 'primaryEmail',
    header: () => <RecordTable.InlineHead label="Emails" />,
    cell: ({ cell }) => {
      const { primaryEmail, _id, emails } = cell.row.original;
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
                  status: 'verified',
                  isPrimary: true,
                },
                ...(emails || []).map((email) => ({
                  email,
                  status: 'verified' as 'verified' | 'unverified',
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
      const [selectedTags, setSelectedTags] = useState<string[]>(
        cell.row.original.tagIds || [],
      );
      const [open, setOpen] = useState(false);

      return (
        <SelectTags
          tagType="core:company"
          mode="multiple"
          value={selectedTags}
          onValueChange={(tags) => {
            if (Array.isArray(tags)) {
              setSelectedTags(tags);
              setOpen(false);
            }
          }}
        >
          <RecordTablePopover open={open} onOpenChange={setOpen}>
            <RecordTableCellTrigger>
              <SelectTags.Value />
            </RecordTableCellTrigger>
            <RecordTableCellContent className="w-96">
              <SelectTags.Content />
            </RecordTableCellContent>
          </RecordTablePopover>
        </SelectTags>
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
    id: 'profileScore',
    accessorKey: 'score',
    header: () => (
      <RecordTable.InlineHead icon={IconUser} label="Profile Score" />
    ),
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableCellDisplay>
    ),
  },
  ...['position', 'department', 'leadStatus'].map((field) => ({
    id: field,
    accessorKey: field,
    header: () => <RecordTable.InlineHead icon={IconAlignLeft} label={field} />,
    cell: ({ cell }: { cell: { getValue: () => unknown } }) => (
      <RecordTableCellDisplay>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableCellDisplay>
    ),
  })),
];
