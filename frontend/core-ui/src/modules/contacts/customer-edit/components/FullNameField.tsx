import { FullName } from 'erxes-ui/modules/record-field/components/FullName';
import { useCustomersEdit } from '@/contacts/customer-edit/hooks/useCustomerEdit';
export const FullNameField = ({
  _id,
  firstName,
  lastName,
  className,
  fieldId,
}: {
  _id: string;
  firstName: string;
  lastName: string;
  className?: string;
  fieldId?: string;
}) => {
  const { customersEdit } = useCustomersEdit();
  return (
    <FullName
      recordId={_id}
      fieldId={fieldId}
      firstName={firstName}
      lastName={lastName}
      className={className}
      onChange={(first, last) => {
        if (firstName + lastName !== first + last) {
          customersEdit(
            {
              variables: { _id, firstName: first, lastName: last },
            },
            ['firstName', 'lastName'],
          );
        }
      }}
    />
  );
};
