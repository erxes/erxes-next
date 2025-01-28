import { UseFormReturn } from 'react-hook-form';
import { CustomerFormType } from '@/contacts/AddContacts/components/formSchema';
import {
  AvatarField,
  FirstNameField,
  LastNameField,
  CodeField,
  OwnerIdField,
  PrimaryEmailField,
  EmailValidationStatusField,
  PrimaryPhoneField,
  PhoneValidationStatusField,
  DescriptionField,
  IsSubscribedField,
} from '@/contacts/AddContacts/components/fields';
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
