import { ApolloError } from '@apollo/client';
import clsx from 'clsx';
import {
  EmailDisplay,
  EmailListField,
  PopoverScoped,
  RecordTableInlineCell,
  useToast,
} from 'erxes-ui';
import { useCustomerEdit } from 'ui-modules/modules/contacts/hooks';

export const CustomerEmails = ({
  primaryEmail,
  _id,
  emailValidationStatus: _emailValidationStatus,
  emails,
  scope,
}: {
  primaryEmail: string;
  _id: string;
  emailValidationStatus: 'valid' | 'invalid';
  emails: string[];
  scope?: string;
}) => {
  const emailValidationStatus =
    _emailValidationStatus === 'valid' ? 'verified' : 'unverified';

  const { customerEdit } = useCustomerEdit();
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
    <PopoverScoped
      scope={clsx(scope, _id, 'Emails')}
      scopeOptions={{
        preventDefault: false,
      }}
    >
      <RecordTableInlineCell.Trigger>
        <EmailDisplay emails={_emails} />
      </RecordTableInlineCell.Trigger>
      <RecordTableInlineCell.Content className="w-72">
        <EmailListField
          recordId={_id}
          onValidationStatusChange={(status) => {
            customerEdit({
              variables: {
                _id,
                emailValidationStatus:
                  status === 'verified' ? 'valid' : 'invalid',
              },
              onError: (e: ApolloError) => {
                toast({
                  title: 'Error',
                  description: e.message,
                });
              },
            });
          }}
          onValueChange={(newEmails) => {
            const primaryEmail = newEmails.find((email) => email.isPrimary);
            let newEmailValidationStatus;
            if (primaryEmail?.status !== emailValidationStatus) {
              newEmailValidationStatus =
                primaryEmail?.status === 'verified' ? 'valid' : 'invalid';
            }
            customerEdit({
              variables: {
                _id,
                primaryEmail: primaryEmail?.email || null,
                emails: newEmails
                  .filter((email) => !email.isPrimary)
                  .map((email) => email.email),
                emailValidationStatus: newEmailValidationStatus,
              },
              onError(e: ApolloError) {
                toast({
                  title: 'Error',
                  description: e.message,
                });
              },
            });
          }}
          emails={_emails}
        />
      </RecordTableInlineCell.Content>
    </PopoverScoped>
  );
};
