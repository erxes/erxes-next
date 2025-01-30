import { UseFormReturn } from 'react-hook-form';

import {
  AvatarField,
  CodeField,
  DescriptionField,
  EmailValidationStatusField,
  FirstNameField,
  IsSubscribedField,
  LastNameField,
  OwnerIdField,
  PhoneValidationStatusField,
  PrimaryEmailField,
  PrimaryPhoneField,
} from '@/contacts/AddContacts/components/fields';
import { CustomerFormType } from '@/contacts/schemas/formSchema';
export const CustomerAddGeneralInformationFields = ({
  form,
}: {
  form: UseFormReturn<CustomerFormType>;
}) => {
  return (
    <>
      <AvatarField control={form.control} />
      <div className="grid grid-cols-2 gap-4 py-4">
        <FirstNameField control={form.control} />
        <LastNameField control={form.control} />
        <CodeField control={form.control} />
        <OwnerIdField control={form.control} />
        <PrimaryEmailField control={form.control} />
        <EmailValidationStatusField control={form.control} />
        <PrimaryPhoneField control={form.control} />
        <PhoneValidationStatusField control={form.control} />
      </div>
      <DescriptionField control={form.control} />
      <IsSubscribedField control={form.control} />
    </>
  );
};
