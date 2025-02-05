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

const phoneValidationStatuses = [
  { label: 'Valid', value: 'valid' },
  { label: 'Invalid', value: 'invalid' },
  { label: 'Unknown', value: 'unknown' },
  { label: 'Unverifiable', value: 'unverifiable' },
  { label: 'Mobile phone', value: 'mobile_phone' },
];
export const PhoneValidationStatusField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <FormField
      control={control}
      name="phoneValidationStatus"
      render={({ field }) => (
        <FormItem>
          <FormLabel>PHONE VERIFICATION STATUS</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <Select.Trigger className="truncate w-full border rounded-md justify-between text-foreground h-8">
                <Select.Value
                  placeholder={
                    <span className="truncate text-muted-foreground font-medium text-sm">
                      {'Choose'}
                    </span>
                  }
                >
                  <span className="text-foreground font-medium text-sm">
                    {
                      phoneValidationStatuses.find(
                        (status) => status.value === field.value,
                      )?.label
                    }
                  </span>
                </Select.Value>
              </Select.Trigger>
            </FormControl>
            <Select.Content
              className="border-input p-0 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
              align="start"
            >
              <Select.Group>
                {phoneValidationStatuses.map((status) => (
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
