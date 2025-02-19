import { Email } from 'erxes-ui/modules/record-field/components/Email';
import { useCustomersEdit } from '@/contacts/customer-edit/hooks/useCustomerEdit';
import { useToast } from 'erxes-ui/hooks';
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
    <Email
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
                description: e.message || 'Something went wrong',
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
