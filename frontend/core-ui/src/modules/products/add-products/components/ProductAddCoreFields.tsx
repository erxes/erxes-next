import { UseFormReturn } from 'react-hook-form';
import {
  IconDeviceUnknown,
  IconHotelService,
  IconPackage,
  IconStar,
} from '@tabler/icons-react';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  Separator,
} from 'erxes-ui/components';
import { SelectCurrency } from 'erxes-ui/components/currency/select-currency';
import { CURRENCY_CODES } from 'erxes-ui/constants';
import { CurrencyCode } from 'erxes-ui/types';
import { CategoryField } from './categoryField';
import { ProductFormValues } from './formSchema';
import { useUom } from '@/products/hooks/useUom';
const types = [
  { label: 'Product', value: 'product', icon: IconPackage },
  { label: 'Service', value: 'service', icon: IconHotelService },
  { label: 'Unique', value: 'unique', icon: IconStar },
  { label: 'Subscription', value: 'subscription', icon: IconDeviceUnknown },
];
export const ProductAddCoreFields = ({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) => {
  const { uoms } = useUom({});
  return (
    <div className="grid grid-cols-2 gap-5 ">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NAME</FormLabel>
            <FormControl>
              <Input className="rounded-md h-8" {...field} />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CODE</FormLabel>
            <div className="flex flex-col">
              <FormControl>
                <Input className="rounded-md h-8" {...field} />
              </FormControl>
              <FormMessage className="text-destructive" />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="uom"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>UNIT OF MEASUREMENTS</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <Select.Trigger className="truncate w-full border rounded-md justify-between text-foreground h-8 hover:bg-muted">
                  <Select.Value
                    placeholder={
                      <span className="truncate text-foreground font-medium text-sm">
                        {'Choose UOM'}
                      </span>
                    }
                  >
                    <span className="text-foreground font-medium text-sm">
                      {uoms.find((uom) => uom._id === field.value)?.name}
                    </span>
                  </Select.Value>
                </Select.Trigger>
              </FormControl>
              <Select.Content>
                {uoms.map((uom) => (
                  <Select.Item
                    key={uom._id}
                    className="text-xs"
                    value={uom._id}
                  >
                    {uom.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="unitPrice"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>UNIT PRICE</FormLabel>
            <FormControl>
              <div className="flex rounded-md border border-border">
                <SelectCurrency
                  currencies={CURRENCY_CODES}
                  value={CurrencyCode.USD}
                  displayIcon={true}
                  className="h-full ring-0 rounded-l-md shadow-none border border-transparent hover:"
                />
                <Separator orientation="vertical" />
                <Input
                  className="rounded-md h-8 border-transparent"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value || ''}
                />
              </div>
            </FormControl>

            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>CATEGORY</FormLabel>
            <FormControl>
              <CategoryField {...field} />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>TYPE</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <Select.Trigger className="truncate w-full border rounded-md justify-between text-foreground h-8 hover:bg-muted">
                  <Select.Value
                    placeholder={
                      <span className="truncate text-foreground font-medium text-sm">
                        {'Choose type'}
                      </span>
                    }
                  >
                    <span className="text-foreground font-medium text-sm">
                      {types.find((type) => type.value === field.value)?.label}
                    </span>
                  </Select.Value>
                </Select.Trigger>
              </FormControl>
              <Select.Content>
                {types.map((type) => (
                  <Select.Item
                    key={type.value}
                    className="text-[13px]"
                    value={type.value}
                  >
                    {type.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
    </div>
  );
};
