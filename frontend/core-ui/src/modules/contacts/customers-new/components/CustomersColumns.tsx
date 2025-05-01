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
  RelativeDateDisplay,
  PhoneListField,
  useToast,
} from 'erxes-ui';
import { useCustomersEdit } from '@/contacts/customers-new/customer-edit/hooks/useCustomerEdit';
import { ApolloError } from '@apollo/client';
import { useState } from 'react';
import { ICustomer, SelectTags } from 'ui-modules';
import { EmailDisplay, PhoneDisplay } from 'erxes-ui/modules/display';
import { customerMoreColumn } from './CustomerMoreColumn';

const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<ICustomer>;

export const customersColumns: ColumnDef<ICustomer>[] = [
  customerMoreColumn as ColumnDef<ICustomer>,
  checkBoxColumn,
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => {
      const { firstName, lastName, primaryEmail, primaryPhone } =
        cell.row.original;
      return (
        <div className="flex items-center justify-center h-8">
          <Avatar>
            <Avatar.Image src={cell.getValue() as string} />
            <Avatar.Fallback>
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
          <RecordTableCellContent className="w-72 ">
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

      const { customersEdit } = useCustomersEdit();
      const { toast } = useToast();
      const _emails = [
        ...(primaryEmail
          ? [
              {
                email: primaryEmail,
                status: emailValidationStatus as 'verified' | 'unverified',
                isPrimary: true,
              },
            ]
          : []),
        ...(emails || []).map((email) => ({
          email,
          status: 'unverified' as 'verified' | 'unverified',
        })),
      ].filter(
        (email, index, self) =>
          index === self.findIndex((t) => t.email === email.email),
      );
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <EmailDisplay emails={_emails} />
          </RecordTableCellTrigger>
          <RecordTableCellContent className="w-72">
            <EmailListField
              recordId={_id}
              onValueChange={(newEmails) => {
                const primaryEmail = newEmails.find((email) => email.isPrimary);
                let newEmailValidationStatus = undefined;
                if (
                  primaryEmail?.status !==
                  (emailValidationStatus as 'verified' | 'unverified')
                ) {
                  newEmailValidationStatus = primaryEmail?.status;
                }
                customersEdit(
                  {
                    variables: {
                      _id,
                      primaryEmail: primaryEmail?.email || null,
                      emails: newEmails
                        .filter((email) => !email.isPrimary)
                        .map((email) => email.email),
                      emailValidationStatus: newEmailValidationStatus,
                    },
                    onError: (e: ApolloError) => {
                      toast({
                        title: 'Error',
                        description: e.message,
                      });
                    },
                  },
                  ['primaryEmail', 'emails', 'emailValidationStatus'],
                );
              }}
              emails={_emails}
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
      const {
        _id,
        primaryPhone,
        phones: _phones,
        phoneValidationStatus,
      } = cell.row.original;
      const { customersEdit } = useCustomersEdit();
      const { toast } = useToast();
      const phones = [
        ...(primaryPhone
          ? [
              {
                phone: primaryPhone,
                status: phoneValidationStatus as 'verified' | 'unverified',
                isPrimary: true,
              },
            ]
          : []),
        ...(_phones || []).map((_phone) => ({
          phone: _phone,
          status: 'unverified' as 'verified' | 'unverified',
        })),
      ].filter(
        (phone, index, self) =>
          index === self.findIndex((t) => t.phone === phone.phone),
      );
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <PhoneDisplay phones={phones} />
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <PhoneListField
              recordId={_id}
              phones={phones}
              onValueChange={(newPhones) => {
                customersEdit(
                  {
                    variables: {
                      _id,
                      primaryPhone:
                        newPhones.find((phone) => phone.isPrimary)?.phone ||
                        null,
                      phones: newPhones.map((phone) => ({
                        phone: phone.phone,
                        status: phone.status,
                        isPrimary: phone.isPrimary,
                      })),
                    },
                    onError: (e: ApolloError) => {
                      toast({
                        title: 'Error',
                        description: e.message,
                      });
                    },
                  },
                  ['primaryPhone', 'phones'],
                );
              }}
            />
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
          tagType="core:customer"
          mode="multiple"
          value={selectedTags}
          targetIds={[cell.row.original._id]}
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
        <RelativeDateDisplay value={cell.getValue() as string} asChild>
          <RecordTableCellDisplay>
            <RelativeDateDisplay.Value value={cell.getValue() as string} />
          </RecordTableCellDisplay>
        </RelativeDateDisplay>
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
        <RelativeDateDisplay value={cell.getValue() as string} asChild>
          <RecordTableCellDisplay>
            <RelativeDateDisplay.Value value={cell.getValue() as string} />
          </RecordTableCellDisplay>
        </RelativeDateDisplay>
      );
    },
  },
];
