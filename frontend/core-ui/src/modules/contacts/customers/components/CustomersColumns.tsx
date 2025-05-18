import {
  IconCalendarPlus,
  IconChartBar,
  IconClock,
  IconGenderMale,
  IconLabelFilled,
  IconMail,
  IconPhone,
  IconTags,
  IconUser,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  Avatar,
  FullNameField,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  EmailListField,
  RelativeDateDisplay,
  PhoneListField,
  useToast,
  SexCode,
  EmailDisplay,
  PhoneDisplay,
  SexDisplay,
  SexField,
} from 'erxes-ui';
import { useCustomersEdit } from '@/contacts/customers/customer-edit/hooks/useCustomerEdit';
import { ApolloError } from '@apollo/client';
import { useState } from 'react';
import { ICustomer, SelectTags } from 'ui-modules';
import { customerMoreColumn } from './CustomerMoreColumn';
import { ContactsHotKeyScope } from '@/contacts/types/ContactsHotKeyScope';

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
          <Avatar size="lg">
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
    header: () => (
      <RecordTable.InlineHead label="Name" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      const { firstName, lastName, _id } = cell.row.original;
      const { customersEdit } = useCustomersEdit();
      const [_firstName, setFirstName] = useState(firstName);
      const [_lastName, setLastName] = useState(lastName);
      const [open, setOpen] = useState(false);

      const onSave = () => {
        if (_firstName !== firstName || _lastName !== lastName) {
          customersEdit(
            { variables: { _id, firstName: _firstName, lastName: _lastName } },
            ['firstName', 'lastName'],
          );
        }
      };

      return (
        <RecordTablePopover
          scope={ContactsHotKeyScope.CustomersPage + '.' + _id + '.Name'}
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              onSave();
            }
          }}
        >
          <RecordTableCellTrigger>
            {_firstName} {_lastName}
          </RecordTableCellTrigger>
          <RecordTableCellContent className="w-72" asChild>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSave();
                setOpen(false);
              }}
            >
              <FullNameField>
                <FullNameField.FirstName
                  value={_firstName || ''}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                <FullNameField.LastName
                  value={_lastName || ''}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
              </FullNameField>
              <button type="submit" className="sr-only" />
            </form>
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 240,
  },
  {
    id: 'emails',
    accessorKey: 'primaryEmail',
    header: () => <RecordTable.InlineHead label="Emails" icon={IconMail} />,
    cell: ({ cell }) => {
      const {
        primaryEmail,
        _id,
        emailValidationStatus: _emailValidationStatus,
        emails,
      } = cell.row.original;
      const emailValidationStatus =
        _emailValidationStatus === 'valid' ? 'verified' : 'unverified';

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
          status: emailValidationStatus as 'verified' | 'unverified',
        })),
      ].filter(
        (email, index, self) =>
          index === self.findIndex((t) => t.email === email.email),
      );
      return (
        <RecordTablePopover
          scope={ContactsHotKeyScope.CustomersPage + '.' + _id + '.Emails'}
        >
          <RecordTableCellTrigger>
            <EmailDisplay emails={_emails} />
          </RecordTableCellTrigger>
          <RecordTableCellContent className="w-72">
            <EmailListField
              recordId={_id}
              onValueChange={(newEmails) => {
                const primaryEmail = newEmails.find((email) => email.isPrimary);
                let newEmailValidationStatus;
                if (primaryEmail?.status !== emailValidationStatus) {
                  newEmailValidationStatus =
                    primaryEmail?.status === 'verified' ? 'valid' : 'invalid';
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
    size: 250,
  },
  {
    id: 'phones',
    accessorKey: 'primaryPhone',
    header: () => <RecordTable.InlineHead label="Phones" icon={IconPhone} />,
    cell: ({ cell }) => {
      const {
        _id,
        primaryPhone,
        phones: _phones,
        phoneValidationStatus: _phoneValidationStatus,
      } = cell.row.original;
      const phoneValidationStatus =
        _phoneValidationStatus === 'valid' ? 'verified' : 'unverified';
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
        <RecordTablePopover
          scope={ContactsHotKeyScope.CustomersPage + '.' + _id + '.Phones'}
        >
          <RecordTableCellTrigger>
            <PhoneDisplay phones={phones} />
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <PhoneListField
              recordId={_id}
              phones={phones}
              onValueChange={(newPhones) => {
                const primaryPhone = newPhones.find((phone) => phone.isPrimary);
                let newPhoneValidationStatus;
                if (primaryPhone?.status !== phoneValidationStatus) {
                  newPhoneValidationStatus =
                    primaryPhone?.status === 'verified' ? 'valid' : 'invalid';
                }
                customersEdit(
                  {
                    variables: {
                      _id,
                      primaryPhone: primaryPhone?.phone || null,
                      phones: newPhones
                        .filter((phone) => !phone.isPrimary)
                        .map((phone) => phone.phone),
                      phoneValidationStatus: newPhoneValidationStatus,
                    },
                    onError: (e: ApolloError) => {
                      toast({
                        title: 'Error',
                        description: e.message,
                      });
                    },
                  },
                  ['primaryPhone', 'phones', 'emailValidationStatus'],
                );
              }}
            />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 250,
  },
  {
    id: 'tagIds',
    accessorKey: 'tagIds',
    header: () => <RecordTable.InlineHead label="Tags" icon={IconTags} />,
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
              <SelectTags.List />
            </RecordTableCellTrigger>
            <RecordTableCellContent className="w-96">
              <SelectTags.Content />
            </RecordTableCellContent>
          </RecordTablePopover>
        </SelectTags>
      );
    },
    size: 360,
  },
  {
    id: 'sex',
    accessorKey: 'sex',
    header: () => <RecordTable.InlineHead label="Sex" icon={IconGenderMale} />,
    cell: ({ cell }) => {
      const { customersEdit } = useCustomersEdit();
      const [open, setOpen] = useState(false);
      const { _id } = cell.row.original;
      return (
        <RecordTablePopover
          scope={ContactsHotKeyScope.CustomersPage + '.' + _id + '.Sex'}
          open={open}
          onOpenChange={setOpen}
        >
          <RecordTableCellTrigger>
            <SexDisplay value={cell.getValue() as SexCode} />
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <SexField
              value={cell.getValue() as SexCode}
              onValueChange={(value) => {
                if (value !== (cell.getValue() as SexCode)) {
                  customersEdit(
                    {
                      variables: { _id, sex: value },
                    },
                    ['sex'],
                  );
                }
                setOpen(false);
              }}
            />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'lastSeenAt',
    accessorKey: 'lastSeenAt',
    header: () => <RecordTable.InlineHead label="Last Seen" icon={IconClock} />,
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
    header: () => (
      <RecordTable.InlineHead label="Session Count" icon={IconChartBar} />
    ),
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
    header: () => (
      <RecordTable.InlineHead label="Created At" icon={IconCalendarPlus} />
    ),
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
