import { FullNameField } from 'erxes-ui';
import { useCustomerEdit } from '../hooks';

export const CustomerName = ({
  _id,
  firstName,
  lastName,
  middleName,
  scope,
  className,
  withBadge = false,
  onClick,
}: {
  _id?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  scope: string;
  className?: string;
  withBadge?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const { customerEdit } = useCustomerEdit();

  return (
    <FullNameField
      className={className}
      withBadge={withBadge}
      onClick={onClick}
      firstName={firstName || ''}
      lastName={
        middleName ? `${middleName || ''} ${lastName || ''}` : lastName || ''
      }
      scope={scope}
      onSave={(newFirstName: string, newLastName: string) => {
        if (
          newFirstName !== firstName ||
          newLastName !== lastName ||
          middleName
        ) {
          customerEdit({
            variables: {
              _id,
              firstName: newFirstName,
              lastName: newLastName,
              ...(middleName ? { middleName: '' } : {}),
            },
          });
        }
      }}
    />
  );
};
