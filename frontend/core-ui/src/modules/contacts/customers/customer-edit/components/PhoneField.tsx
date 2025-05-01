import { Phone } from 'erxes-ui/modules/record-field/components/Phone';
import { useCustomersEdit } from '@/contacts/customer-edit/hooks/useCustomerEdit';
import { useToast } from 'erxes-ui';
import { ApolloError } from '@apollo/client';
import { CountryCode } from 'libphonenumber-js';
export const PhoneField = ({
  _id,
  primaryPhone,
  phones,
  className,
  fieldId,
  defaultCountryCode,
  phoneValidationStatus,
}: {
  _id: string;
  primaryPhone: string;
  phones: string[];
  className?: string;
  fieldId?: string;
  defaultCountryCode?: CountryCode | undefined;
  phoneValidationStatus: string;
}) => {
  const { customersEdit } = useCustomersEdit();
  const { toast } = useToast();
  return (
    <Phone
      phoneValidationStatus={phoneValidationStatus}
      recordId={_id}
      fieldId={fieldId}
      primaryPhone={primaryPhone}
      phones={phones}
      className={className}
      defaultCountryCode={defaultCountryCode}
      onValidationStatusSelect={(phoneValidationStatus) => {
        customersEdit(
          {
            variables: { _id, phoneValidationStatus },
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
      onChange={(mainPhone, restPhones, onCompleted) => {
        customersEdit(
          {
            variables: { _id, primaryPhone: mainPhone, phones: restPhones },
            onError: (e: ApolloError) => {
              toast({
                title: 'Error',
                description: e.message,
              });
            },
            onCompleted,
          },
          ['primaryPhone', 'phones'],
        );
      }}
    />
  );
};