import { Control } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'erxes-ui/components';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';
export const PrimaryPhoneField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <FormField
      control={control}
      name="primaryPhone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>PHONE</FormLabel>
          <FormControl>
            <Input className="rounded-md h-8" {...field} />
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};
