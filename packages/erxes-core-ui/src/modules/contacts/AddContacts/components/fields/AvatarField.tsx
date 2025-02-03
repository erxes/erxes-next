import { Control } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  Upload,
} from 'erxes-ui/components';

import { CustomerFormType } from '@/contacts/AddContacts/components/formSchema';

export const AvatarField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <FormField
      name="avatar"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Upload.Root
              {...field}
              value={field.value || ''}
              onChange={(fileInfo) => field.onChange(fileInfo.url)}
            >
              <Upload.Preview className="rounded-full" />
              <div className="flex flex-col gap-2 justify-center">
                <div className="flex gap-4">
                  <Upload.Button size="sm" variant="outline" type="button">
                    Upload picture
                  </Upload.Button>

                  <Upload.RemoveButton
                    size="sm"
                    variant="outline"
                    type="button"
                  />
                </div>
                <FormDescription>
                  Recommended size 1:1, up to 2MB
                </FormDescription>
              </div>
            </Upload.Root>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
