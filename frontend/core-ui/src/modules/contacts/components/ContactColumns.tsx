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
import { RelativeDateDisplay } from 'erxes-ui/display';
import { VerificationDisplay } from 'erxes-ui/display';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import { VerificationInput } from 'erxes-ui/modules/record-field/meta-inputs/components/VerificationInput';
import { EmailFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/EmailFieldInput';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';

import { useCustomerEdit } from '@/contacts/hooks/useEditCustomer';
import { Customer } from '@/contacts/types/contactsTypes';
import { isValidEmail } from 'erxes-ui/utils';
import { TagBadges } from '@/tags/components/tagBadges';
import { SelectTags } from '@/tags/components/SelectTags';
import { ITag } from '@/tags/types/tagTypes';
import { RelativeDateDisplay } from 'erxes-ui/components/display/relativeDateDisplay';

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
    cell: ({ cell }) => {
      const initialValue = cell.getValue() as string;
      const [value, setValue] = useState(initialValue);
      const [validationStatus, setValidationStatus] = useState(
        cell.row.original.emailValidationStatus,
      );
      const { customerEdit } = useCustomerEdit();

      return (
        <RecordTableInlineCell
          onSave={() => {
            if (isValidEmail(value)) {
              customerEdit({
                variables: {
                  _id: cell.row.original._id,
                  [cell.column.id]: value,
                  emailValidationStatus: validationStatus,
                },
              });
            } else {
              setValue(initialValue);
            }
          }}
          getValue={() => cell.getValue()}
          value={value}
          display={() => (
            <div className="flex items-center gap-2">
              {value && (
                <VerificationDisplay value={validationStatus || null} />
              )}
              <span>{value}</span>
            </div>
          )}
          edit={() => (
            <RecordTableInlineCellEditForm>
              <div className="flex border border-border">
                {value && (
                  <VerificationInput
                    className="ring-0 outline-none mr-1 border-transparent h-full rounded-none hover:bg-muted"
                    value={cell.row.original.emailValidationStatus || null}
                    onChange={(newStatus) => {
                      setValidationStatus(newStatus);
                      customerEdit({
                        variables: {
                          _id: cell.row.original._id,
                          emailValidationStatus: newStatus,
                        },
                      });
                    }}
                  />
                )}
                <EmailFieldInput
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-full border-transparent"
                />
              </div>
            </RecordTableInlineCellEditForm>
          )}
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
    cell: ({ cell }) => <TableTextInput cell={cell} />,
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
