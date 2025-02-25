import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
} from 'erxes-ui/components';
import { Control, Path } from 'react-hook-form';
import { TGeneralSettingsProps } from '../types';

type Props = {
  name: string;
  control: Control<TGeneralSettingsProps>;
  label: string;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
};

const SelectControl = ({
  name,
  control,
  placeholder,
  options,
  label,
}: Props) => {
  return (
    <FormField
      name={name as Path<TGeneralSettingsProps>}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            defaultValue={field.value as Path<TGeneralSettingsProps>}
            onValueChange={(value) => field.onChange(value)}
          >
            <FormControl>
              <Select.Trigger>
                <Select.Value placeholder={placeholder} />
              </Select.Trigger>
            </FormControl>
            <Select.Content>
              {options?.map((opt, idx) => (
                <Select.Item key={idx} value={opt.value}>
                  {opt.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};

export default SelectControl;
