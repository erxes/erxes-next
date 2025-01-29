import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  TextEditor,
} from 'erxes-ui/components';
import { Control } from 'react-hook-form';
import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';
export const DescriptionField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem className="mb-5">
          <FormLabel>DESCRIPTION</FormLabel>

          <FormControl>
            <TextEditor
              {...field}
              className=" h-28 rounded-md border"
              parseTo="html"
            />
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};
