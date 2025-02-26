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

export const LastNameField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <FormField
      control={control}
      name="lastName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>LAST NAME</FormLabel>
          <FormControl>
            <Input className="rounded-md h-8" {...field} value={field.value || ''} />
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};
