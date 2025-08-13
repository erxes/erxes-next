import { ApolloError } from '@apollo/client';
import {
  IPhoneStatus,
  PhoneDisplay,
  PhoneField,
  PopoverScoped,
  RecordTableInlineCell,
  TPhones,
  useToast,
} from 'erxes-ui';
import { useCustomerEdit } from 'ui-modules/modules/contacts/hooks';

interface CustomerPhonesProps {
  _id: string;
  primaryPhone: string;
  phones: string[];
  phoneValidationStatus: 'valid' | 'invalid';
  scope: string;
  Trigger: React.ComponentType<{ children: React.ReactNode }>;
}

export function CustomerPhones({
  _id,
  primaryPhone,
  phones: _phones,
  phoneValidationStatus: _phoneValidationStatus,
  scope,
  Trigger,
}: CustomerPhonesProps) {
  const { customerEdit } = useCustomerEdit();
  const { toast } = useToast();

  const phoneValidationStatus =
    _phoneValidationStatus === 'valid'
      ? IPhoneStatus.Verified
      : IPhoneStatus.Unverified;

  const formattedPhones = formatPhones(
    primaryPhone,
    _phones,
    phoneValidationStatus,
  );

  const handleValueChange = (newPhones: TPhones) => {
    const primaryPhone = newPhones.find((phone) => phone.isPrimary);

    let newPhoneValidationStatus;
    if (primaryPhone?.status !== phoneValidationStatus) {
      newPhoneValidationStatus =
        primaryPhone?.status === IPhoneStatus.Verified ? 'valid' : 'invalid';
    }

    customerEdit({
      variables: {
        _id,
        primaryPhone: primaryPhone?.phone || null,
        phones: newPhones
          .filter((phone) => !phone.isPrimary)
          .map((phone) => phone.phone),
        phoneValidationStatus: newPhoneValidationStatus,
      },
      onError: (error: ApolloError) => {
        toast({
          title: 'Error',
          description: error.message,
        });
      },
    });
  };

  const handleValidationStatusChange = (status: IPhoneStatus) => {
    customerEdit({
      variables: {
        _id,
        phoneValidationStatus:
          status === IPhoneStatus.Verified ? 'valid' : 'invalid',
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
    <PopoverScoped scope={scope || ''}>
      <Trigger>
        <PhoneDisplay phones={formattedPhones} />
      </Trigger>
      <RecordTableInlineCell.Content className="w-72">
        <PhoneField
          recordId={_id}
          phones={formattedPhones}
          onValueChange={handleValueChange}
          onValidationStatusChange={handleValidationStatusChange}
        />
      </RecordTableInlineCell.Content>
    </PopoverScoped>
  );
}

export function formatPhones(
  primaryPhone: string,
  phones: string[],
  phoneValidationStatus: IPhoneStatus,
): TPhones {
  const formattedPhones = [
    ...(primaryPhone
      ? [
          {
            phone: primaryPhone,
            status: phoneValidationStatus,
            isPrimary: true,
          },
        ]
      : []),
    ...(phones || []).map((phone) => ({
      phone,
      status: IPhoneStatus.Unverified,
    })),
  ];

  return formattedPhones.filter(
    (phone, index, self) =>
      index === self.findIndex((t) => t.phone === phone.phone),
  );
}
