import { useCustomersEdit } from '@/contacts/customers/customer-edit/hooks/useCustomerEdit';
import { ContactsHotKeyScope } from '@/contacts/types/ContactsHotKeyScope';
import { ApolloError } from '@apollo/client';
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
  EmailDisplay,
  EmailListField,
  FullNameField,
  PhoneDisplay,
  PhoneListField,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  RelativeDateDisplay,
  SexCode,
  SexDisplay,
  SexField,
  readImage,
  useQueryState,
  useToast,
} from 'erxes-ui';
import { useState } from 'react';
import { ICustomer, SelectTags } from 'ui-modules';
import { useSetAtom } from 'jotai';
import { renderingCustomerDetailAtom } from '@/contacts/states/customerDetailStates';

const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<ICustomer>;

export const customersColumns: ColumnDef<ICustomer>[] = [
  checkBoxColumn,
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTable.InlineHead icon={IconUser} label="" />,
    cell: ({ cell }) => {
      const { firstName, lastName } = cell.row.original;
      return (
        <div className="flex items-center justify-center h-8">
          <Avatar size="lg">
            <Avatar.Image src={readImage(cell.getValue() as string)} />
            <Avatar.Fallback>
              {firstName?.charAt(0) || lastName?.charAt(0) || '-'}
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
      const [, setDetailOpen] = useQueryState('contactId');
      const setRenderingCustomerDetail = useSetAtom(
        renderingCustomerDetailAtom,
      );
      const { firstName = '', lastName = '', _id } = cell.row.original;
      const { customersEdit } = useCustomersEdit();

      const onSave = (first: string, last: string) => {
        if (first !== firstName || last !== lastName) {
          customersEdit(
            { variables: { _id, firstName: first, lastName: last } },
            ['firstName', 'lastName'],
          );
        }
      };

      return (
        <FullNameField
          scope={ContactsHotKeyScope.CustomersPage + '.' + _id + '.Name'}
          firstName={firstName}
          lastName={lastName}
          onClose={onSave}
          closeOnEnter
          withBadge
          onClick={(e) => {
            e.stopPropagation();
            setDetailOpen(_id);
            setRenderingCustomerDetail(false);
          }}
        />
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
          scopeOptions={{
            preventDefault: false,
          }}
        >
          <RecordTableCellTrigger>
            <EmailDisplay emails={_emails} />
          </RecordTableCellTrigger>
          <RecordTableCellContent className="w-72">
            <EmailListField
              recordId={_id}
              onValidationStatusChange={(status) => {
                customersEdit(
                  {
                    variables: {
                      _id,
                      emailValidationStatus: status === 'verified' ? 'valid' : 'invalid',
                    },
                    onError: (e: ApolloError) => {
                      toast({
                        title: 'Error',
                        description: e.message,
                      });
                    },
                  },
                  ['emailValidationStatus'],
                );
              }}
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
                  ['primaryEmail', 'emails'],
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
              onValidationStatusChange={(status : 'verified' | 'unverified')=>{
                customersEdit(
                  {
                    variables: {
                      _id,
                      phoneValidationStatus: status === 'verified' ? 'valid' : 'invalid',
                    },
                    onError: (e: ApolloError) => {
                      toast({
                        title: 'Error',
                        description: e.message,
                      });
                    },
                  },
                  ['phoneValidationStatus'],
                );
              }}
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
                  ['primaryPhone', 'phones'],
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
      return (
        <SelectTags.InlineCell
          tagType="core:customer"
          mode="multiple"
          value={cell.row.original.tagIds}
          targetIds={[cell.row.original._id]}
          options={(newSelectedTagIds) => ({
            update: (cache) => {
              cache.modify({
                id: cache.identify({
                  __typename: 'Customer',
                  _id: cell.row.original._id,
                }),
                fields: {
                  tagIds: () => newSelectedTagIds,
                },
              });
            },
          })}
        />
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
