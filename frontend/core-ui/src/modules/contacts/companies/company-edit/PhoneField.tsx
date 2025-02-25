import { Phone } from 'erxes-ui/modules/record-field/components/Phone';
import { useCompaniesEdit } from '../hooks/useCompaniesEdit';
import { useToast } from 'erxes-ui/hooks';
import { ApolloError } from '@apollo/client';
import { CountryCode } from 'libphonenumber-js';
export const PhoneField = ({
  _id,
  primaryPhone,
  phones = [],
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
  const { companiesEdit } = useCompaniesEdit();
  const { toast } = useToast();
  return (
    <Phone
      recordId={_id}
      fieldId={fieldId}
      primaryPhone={primaryPhone}
      phones={phones}
      className={className}
      defaultCountryCode={defaultCountryCode}
      onChange={(mainPhone, restPhones, onCompleted) => {
        companiesEdit(
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
