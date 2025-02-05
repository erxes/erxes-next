import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'erxes-ui/components';
import { Control } from 'react-hook-form';
import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';
import { AssignMember } from '@/team-members/components/AssignMember';

export const OwnerIdField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <FormField
      control={control}
      name="ownerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>CHOOSE AN OWNER</FormLabel>
          <FormControl>
            <div className="w-full">
              <AssignMember
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
              />
            </div>
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};
