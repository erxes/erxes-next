import {
  IconAlignLeft,
  IconBuilding,
  IconLabelFilled,
  IconUser,
} from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';

import {
  Avatar,
  EmailDisplay,
  EmailListField,
  Input,
  PhoneDisplay,
  PhoneListField,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  TextOverflowTooltip,
} from 'erxes-ui';

import { TCompany } from '@/contacts/types/companyType';
import { SelectMember, SelectTags } from 'ui-modules';
import { useState } from 'react';
import { useCompaniesEdit } from '@/contacts/companies/hooks/useCompaniesEdit';
import { ApolloError } from '@apollo/client';
import { useToast } from 'erxes-ui';
import { ContactsHotKeyScope } from '@/contacts/types/ContactsHotKeyScope';

export const companyColumns: ColumnDef<TCompany>[] = [
  {
    id: 'more',
    cell: ({ cell }) => <RecordTable.MoreButton className="w-full h-full" />,
    size: 33,
  },
  RecordTable.checkboxColumn as ColumnDef<TCompany>,
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: () => <RecordTable.InlineHead icon={IconBuilding} label="" />,
    cell: ({ cell }) => {
      const { primaryName, primaryEmail, primaryPhone } = cell.row.original;
      return (
        <div className="flex items-center justify-center h-8">
          <Avatar>
            <Avatar.Image src={cell.getValue() as string} />
            <Avatar.Fallback>
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
      <RecordTable.InlineHead icon={IconLabelFilled} label="Name" />
    ),
    cell: ({ cell }) => {
      const { primaryName } = cell.row.original;
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>{primaryName}</RecordTableCellTrigger>
          <RecordTableCellContent className="min-w-72">
            <Input value={primaryName || ''} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 250,
  },
  {
    id: 'emails',
    accessorKey: 'primaryEmail',
    header: () => <RecordTable.InlineHead label="Emails" />,
    cell: ({ cell }) => {
      const {
        primaryEmail,
        _id,
        emails,
        emailValidationStatus: _emailValidationStatus,
      } = cell.row.original;

      const emailValidationStatus =
        _emailValidationStatus === 'valid' ? 'verified' : 'unverified';
      const { companiesEdit } = useCompaniesEdit();
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
          isPrimary: false,
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
          <RecordTableCellContent className="min-w-72">
            <EmailListField
              noValidation
              recordId={_id}
              onValueChange={(newEmails) => {
                const primaryEmail = newEmails.find((email) => email.isPrimary);
                let newEmailValidationStatus = undefined;
                if (primaryEmail?.status !== emailValidationStatus) {
                  newEmailValidationStatus =
                    primaryEmail?.status === 'verified' ? 'valid' : 'invalid';
                }
                companiesEdit(
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
        phoneValidationStatus: _phoneValidationStatus,
      } = cell.row.original;
      const phoneValidationStatus =
        _phoneValidationStatus === 'valid' ? 'verified' : 'unverified';
      const { companiesEdit } = useCompaniesEdit();
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
                const primaryPhone = newPhones.find((phone) => phone.isPrimary);
                let newPhoneValidationStatus = undefined;
                if (primaryPhone?.status !== phoneValidationStatus) {
                  newPhoneValidationStatus =
                    primaryPhone?.status === 'verified' ? 'valid' : 'invalid';
                }
                companiesEdit(
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
  },
  {
    id: 'owner',
    accessorKey: 'ownerId',
    header: () => <RecordTable.InlineHead label="Owner" />,
    cell: ({ cell }) => {
      const { companiesEdit } = useCompaniesEdit();
      return (
        <SelectMember.InlineCell
          scope={
            ContactsHotKeyScope.CompaniesPage +
            '.' +
            cell.row.original._id +
            '.Owner'
          }
          value={cell.getValue() as string}
          onValueChange={(value) =>
            companiesEdit(
              {
                variables: { _id: cell.row.original._id, ownerId: value },
              },
              ['ownerId'],
            )
          }
        />
      );
    },
    size: 200,
  },
  {
    id: 'plan',
    accessorKey: 'plan',
    header: () => <RecordTable.InlineHead label="Plan" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
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
      // TODO: USE TAGS INLINE CELL
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
    size: 300,
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
