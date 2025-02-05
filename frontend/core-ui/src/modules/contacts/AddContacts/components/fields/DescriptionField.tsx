import { Control } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'erxes-ui/components';

import { CustomerFormType } from '@/contacts/AddContacts/components/formSchema';
import { BlockEditor } from 'erxes-ui/components';
import { useCreateBlockNote } from '@blocknote/react';
import { BLOCK_SCHEMA } from 'erxes-ui/modules/blocks/constant/blockEditorSchema';
export const DescriptionField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  const editor = useCreateBlockNote({
    schema: BLOCK_SCHEMA,
  });

  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem className="mb-5">
          <FormLabel>DESCRIPTION</FormLabel>

          <FormControl>
            <BlockEditor
              editor={editor}
              onChange={() => field.onChange()}
              className=" h-28 rounded-md border min-h-28"
            />
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};
