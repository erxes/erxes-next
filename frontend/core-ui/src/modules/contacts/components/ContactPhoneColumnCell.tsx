import { useState } from 'react';
import { PhoneVerificationInput } from 'erxes-ui/modules/record-field/meta-inputs/components/PhoneVerificationInput';
import { ValidationDisplay } from 'erxes-ui/components/display/ValidationDisplay';
import { useCustomerEdit } from '@/contacts/hooks/useEditCustomer';
import { PHONE_VALIDATION_STATUS_INFOS } from 'erxes-ui/constants/PhoneValidationStatusInfos';
import { CountryPhoneCodes } from 'erxes-ui/constants/CountryPhoneCodes';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import { PhoneCodeInput } from 'erxes-ui/modules/record-field/meta-inputs/components/PhoneCodeInput';


export const ContactPhoneColumnCell = ({ cell }: { cell: any }) => {
  const initialValue = cell.getValue() as string;
  const [phoneValue, setPhoneValue] = useState(initialValue);
  const [dialCode, setDialCode] = useState('+976');
  const [validationStatus, setValidationStatus] = useState(
    cell.row.original.phoneValidationStatus,
  );
  const { customerEdit } = useCustomerEdit();

  return (
    <RecordTableInlineCell
      onSave={() => {
        customerEdit({
          variables: {
            id: cell.row.original._id,
            phoneValidationStatus: validationStatus,
          },
        });
      }}
      getValue={() => cell.getValue()}
      value={phoneValue}
      display={() => (
        <div className="flex items-center gap-2 ml-2">
          {phoneValue && (
            <ValidationDisplay
              validationInfos={PHONE_VALIDATION_STATUS_INFOS}
              value={validationStatus || null}
            />
          )}
          <span>{phoneValue}</span>
        </div>
      )}
      edit={({ setIsInEditMode }) => {
        const handlePhoneSubmit = (e:  React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const country = CountryPhoneCodes.find(
            (c) => c.dial_code === dialCode,
          );
          // const countryCode = country?.code as CountryCode | undefined;
          // const isValid = isValidPhoneNumber(phoneValue, countryCode);
          // if (!isValid) {
          //   console.error('Invalid phone number');
          // } else setIsInEditMode(false);
        };
        return (
          <form onSubmit={handlePhoneSubmit}>
            <div className="flex border border-border">
              {phoneValue && (
                <PhoneVerificationInput
                  className="ring-0 outline-none mr-1  h-full border-r border-border shadow-none rounded-none hover:bg-muted"
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
              <PhoneCodeInput value={dialCode} onChange={setDialCode} />
              <TextFieldInput
                value={phoneValue}
                type="number"
                onChange={(e) => setPhoneValue(e.target.value)}
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-nonee h-full border-transparent"
              />
            </div>
          </form>
        );
      }}
    />
  );
};
