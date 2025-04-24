import { Phone } from 'erxes-ui';
import { useCustomersEdit } from '@/contacts/customers/customer-edit/hooks/useCustomerEdit';
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
}: {
  _id: string;
  primaryPhone: string;
  phones: string[];
  className?: string;
  fieldId?: string;
  defaultCountryCode?: CountryCode | undefined;
}) => {
  const { customersEdit } = useCustomersEdit();
  const { toast } = useToast();
  return (
    <Phone
      recordId={_id}
      fieldId={fieldId}
      primaryPhone={primaryPhone}
      phones={phones.filter((phone) => !!phone)}
      className={className}
      defaultCountryCode={defaultCountryCode}
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
