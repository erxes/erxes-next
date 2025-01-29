import {
  FormMessage,
  Input,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  Select,
} from 'erxes-ui/components';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from './formSchema';
import { CategoryField } from './categoryField';
import {
  IconDeviceUnknown,
  IconHotelService,
  IconPackage,
  IconStar,
} from '@tabler/icons-react';
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
                <Select.Trigger className="truncate w-full border rounded-md justify-between text-foreground h-8">
                  <Select.Value
                    className="text-foreground font-medium text-sm"
                    placeholder={
                      <span className="truncate text-foreground font-medium text-sm">
                        {'Choose type'}
                      </span>
                    }
                  />
                </Select.Trigger>
              </FormControl>
              <Select.Content
              // className="border-input p-0 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
              // align="start"
              >
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
      <FormField
        control={form.control}
        name="unitPrice"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>UNIT PRICE</FormLabel>
            <FormControl>
              <Input
                className="rounded-md h-8"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage className="text-destructive" />
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
                <Select.Trigger className="truncate w-full border rounded-md justify-between text-foreground h-8">
                  <Select.Value
                    className="text-foreground font-medium text-sm"
                    placeholder={
                      <span className="truncate text-foreground font-medium text-sm">
                        {'Choose UOM'}
                      </span>
                    }
                  ></Select.Value>
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
    </div>
  );
};
