import { Control } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Switch,
} from 'erxes-ui/components';

import { CustomerFormType } from '@/contacts/schemas/formSchema';

export const IsSubscribedField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <FormField
      name="isSubscribed"
      control={control}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>SUBSCRIBED</FormLabel>
          <FormControl>
            <div className='p-2'>
              <Switch
                className="scale-150 w-7"
                checked={field.value === 'Yes'}
                onCheckedChange={(checked) =>
                  field.onChange(checked ? 'Yes' : 'No')
                }
              />
            </div>
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};
