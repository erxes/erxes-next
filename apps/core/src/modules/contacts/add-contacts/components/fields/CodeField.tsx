import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'erxes-ui/components';
import { Control } from 'react-hook-form';
import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';

export const CodeField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <FormField
      control={control}
      name="code"
      render={({ field }) => (
        <FormItem>
          <FormLabel>CODE</FormLabel>
          <FormControl>
            <Input className="rounded-md h-8" {...field} />
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};
