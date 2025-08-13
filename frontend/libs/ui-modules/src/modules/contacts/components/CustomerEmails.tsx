import { ApolloError } from '@apollo/client';
import {
  EmailDisplay,
  EmailListField,
  IEmailField,
  IEmailStatus,
  PopoverScoped,
  RecordTableInlineCell,
  TEmails,
  useToast,
} from 'erxes-ui';
import { useCustomerEdit } from 'ui-modules/modules/contacts/hooks';

interface CustomerEmailsProps {
  primaryEmail: string;
  _id: string;
  emailValidationStatus: 'valid' | 'invalid';
  emails: string[];
  scope?: string;
  Trigger: React.ComponentType<{ children: React.ReactNode }>;
}

export function CustomerEmails({
  primaryEmail,
  _id,
  emailValidationStatus: _emailValidationStatus,
  emails,
  scope,
  Trigger,
}: CustomerEmailsProps) {
  const { customerEdit } = useCustomerEdit();
  const { toast } = useToast();

  const emailValidationStatus: IEmailStatus =
    _emailValidationStatus === 'valid'
      ? IEmailStatus.Verified
      : IEmailStatus.Unverified;

  const formattedEmails = formatEmails(
    primaryEmail,
    emails,
    emailValidationStatus,
  );

  const handleValidationStatusChange = (status: 'verified' | 'unverified') => {
    customerEdit({
      variables: {
        _id,
        emailValidationStatus: status === 'verified' ? 'valid' : 'invalid',
      },
      onError: (error: ApolloError) => {
        toast({
          title: 'Error',
          description: error.message,
        });
      },
    });
  };

  const handleValueChange = (newEmails: TEmails) => {
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
      onError: (error: ApolloError) => {
        toast({
          title: 'Error',
          description: error.message,
        });
      },
    });
  };

  return (
    <PopoverScoped scope={scope || ''} modal dd>
      <Trigger>
        <EmailDisplay emails={formattedEmails} />
      </Trigger>
      <RecordTableInlineCell.Content className="w-72">
        <EmailListField
          recordId={_id}
          emails={formattedEmails}
          onValueChange={handleValueChange}
          onValidationStatusChange={handleValidationStatusChange}
        />
      </RecordTableInlineCell.Content>
    </PopoverScoped>
  );
}

function formatEmails(
  primaryEmail: string,
  emails: string[],
  emailValidationStatus: IEmailStatus,
): TEmails {
  const formattedEmails: IEmailField[] = [
    ...(primaryEmail
      ? [
          {
            email: primaryEmail,
            status: emailValidationStatus,
            isPrimary: true,
          },
        ]
      : []),
    ...(emails || []).map((email) => ({
      email,
      status: emailValidationStatus,
    })),
  ];

  return formattedEmails.filter(
    (email, index, self) =>
      index === self.findIndex((t) => t.email === email.email),
  );
}
