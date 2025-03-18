import { EmailInlineCell } from 'erxes-ui/modules/record-field/components/EmailInlineCell';
import { useCustomersEdit } from '@/contacts/customer-edit/hooks/useCustomerEdit';
import { useToast } from 'erxes-ui';
import { ApolloError } from '@apollo/client';
export const EmailField = ({
  _id,
  primaryEmail,
  emails,
  className,
  fieldId,
}: {
  _id: string;
  primaryEmail: string;
  emails: string[];
  className?: string;
  fieldId?: string;
}) => {
  const { customersEdit } = useCustomersEdit();
  const { toast } = useToast();
  return (
    <EmailInlineCell
      recordId={_id}
      fieldId={fieldId}
      primaryEmail={primaryEmail}
      emails={emails}
      className={className}
      onChange={(mainEmail, restEmails, onCompleted) => {
        customersEdit(
          {
            variables: { _id, primaryEmail: mainEmail, emails: restEmails },
            onError: (e: ApolloError) => {
              toast({
                title: 'Error',
                description: e.message,
              });
            },
            onCompleted,
          },
          ['primaryEmail', 'emails'],
        );
      }}
    />
  );
};
