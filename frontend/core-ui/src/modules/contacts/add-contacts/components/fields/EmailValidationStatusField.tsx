import { Control } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
} from 'erxes-ui/components';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';

const emailValidationStatuses = [
  { label: 'Valid', value: 'valid' },
  { label: 'Invalid', value: 'invalid' },
  { label: 'Accept all unverifiable', value: 'accept_all_unverifiable' },
  { label: 'Unknown', value: 'unknown' },
  { label: 'Disposable', value: 'disposable' },
  { label: 'Catch all', value: 'catchall' },
  { label: 'Bat syntax', value: 'bad_syntax' },
  { label: 'Not checked', value: 'not_checked' },
];
export const EmailValidationStatusField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <FormField
      control={control}
      name="emailValidationStatus"
      render={({ field }) => (
        <FormItem>
          <FormLabel>EMAIL VERIFICATION STATUS</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <Select.Trigger className="truncate w-full rounded-md justify-between text-foreground h-8">
                <Select.Value
                  placeholder={
                    <span className="truncate text-muted-foreground font-medium text-sm">
                      {'Choose'}
                    </span>
                  }
                >
                  {' '}
                  <span className="text-foreground font-medium text-sm">
                    {
                      emailValidationStatuses.find(
                        (status) => status.value === field.value,
                      )?.label
                    }
                  </span>
                </Select.Value>
              </Select.Trigger>
            </FormControl>
            <Select.Content
              className="border p-0 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
              align="start"
            >
              <Select.Group>
                {emailValidationStatuses.map((status) => (
                  <Select.Item
                    key={status.value}
                    className="h-7 text-xs"
                    value={status.value}
                  >
                    {status.label}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};
