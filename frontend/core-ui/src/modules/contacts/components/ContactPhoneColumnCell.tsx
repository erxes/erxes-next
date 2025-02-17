import { useState } from 'react';
import { PhoneVerificationInput } from 'erxes-ui/modules/record-field/meta-inputs/components/PhoneVerificationInput';
import { ValidationDisplay } from 'erxes-ui/components/display/ValidationDisplay';
import { useCustomerEdit } from '@/contacts/hooks/useEditCustomer';
import { PHONE_VALIDATION_STATUS_INFOS } from 'erxes-ui/constants/PhoneValidationStatusInfos';
import { CountryPhoneCodes } from 'erxes-ui/constants/CountryPhoneCodes';
import parsePhoneNumberFromString, {
  CountryCode,
  isValidPhoneNumber,
  PhoneNumber,
} from 'libphonenumber-js';
import { useToast } from 'erxes-ui/hooks';
import { formatPhoneNumber } from 'erxes-ui/utils/format';
import { TCountryCode } from 'erxes-ui/types';
import {
  RecordTableInlineCell,
  // RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { PhoneInput } from 'erxes-ui/modules/record-field/meta-inputs/components/PhoneInput';
import { IconWorld } from '@tabler/icons-react';

export const ContactPhoneColumnCell = ({ cell }: { cell: any }) => {
  const initialValue = cell.getValue() as string;
  const [phoneValue, setPhoneValue] = useState(initialValue);
  const [validationStatus, setValidationStatus] = useState(
    cell.row.original.phoneValidationStatus,
  );
  const { customerEdit } = useCustomerEdit();
  const { toast } = useToast();
  const submitHandler = (newValue: string) => {
    try {
      const parsedNumber = parsePhoneNumberFromString(newValue);

      if (!parsedNumber) {
        toast({
          title: 'Invalid Phone Number',
          description: 'Please enter a valid phone number',
        });
        return;
      }
      if (!isValidPhoneNumber(parsedNumber.number)) {
        toast({
          title: 'Invalid Phone Number',
          description: 'The phone number format is invalid',
        });
        return;
      }

      const updatedPhone = parsedNumber.number;

      customerEdit({
        variables: {
          id: cell.row.original._id,
          phoneValidationStatus: validationStatus,
          primaryPhone: updatedPhone,
        },
        onError: (e) => {
          if (e.graphQLErrors?.length > 0) {
            const errorMessage = e.graphQLErrors[0]?.message;
            if (errorMessage === 'Duplicated phone') {
              toast({
                title: 'Duplicate Phone',
                description: 'This phone number is already in use',
              });
              return;
            }
          }
          toast({
            title: 'Error',
            description: e.message || 'Something went wrong',
          });
        },
        onCompleted: () => {
          setPhoneValue(updatedPhone);
          toast({
            title: 'Success',
            description: 'Phone number updated successfully',
          });
        },
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Invalid phone number format',
      });
    }
  };

  return (
    <RecordTableInlineCell
      getValue={() => cell.getValue()}
      value={phoneValue}
      display={() => {
        let parsedNumber: PhoneNumber | undefined,
          countryData: TCountryCode | undefined;
        try {
          parsedNumber = parsePhoneNumberFromString(phoneValue);
          if (parsedNumber) {
            countryData = CountryPhoneCodes.find(
              (country) => country.code === parsedNumber?.country,
            );
          }
        } catch {
          parsedNumber = undefined;
          countryData = undefined;
        }
        return (
          <div className="flex items-center gap-1 ml-1">
            {phoneValue && (
              <ValidationDisplay
                validationInfos={PHONE_VALIDATION_STATUS_INFOS}
                value={validationStatus || null}
              />
            )}
            {phoneValue && (
              <span>
                {parsedNumber && countryData ? (
                  <span>{countryData.flag}</span>
                ) : (
                  <IconWorld size={16} className="text-muted-foreground" />
                )}
              </span>
            )}
            <span className="ml-1">
              {parsedNumber
                ? formatPhoneNumber({
                    value: parsedNumber.nationalNumber,
                    defaultCountry: countryData?.code as CountryCode,
                  })
                : formatPhoneNumber({ value: phoneValue || '' })}
            </span>
          </div>
        );
      }}
      edit={() => (
        <form
          onSubmit={() => submitHandler(phoneValue)}
        >
          <div className="flex border border-border">
            {phoneValue && (
              <PhoneVerificationInput
                className="ring-0 border-none focus:z-50 outline-none h-cell shadow-none rounded-none hover:bg-muted"
                value={validationStatus || null}
                inputValue={phoneValue}
                onChange={(newStatus) => {
                  setValidationStatus(newStatus);
                  customerEdit({
                    variables: {
                      id: cell.row.original._id,
                      phoneValidationStatus: newStatus,
                    },
                  });
                }}
              />
            )}
            <PhoneInput
              value={phoneValue}
              onChange={setPhoneValue}
              defaultCountry={
                (cell.row.original?.location?.countryCode as CountryCode) ||
                undefined
              }
            />
          </div>
        </form>
      )}
    />
  );
};
