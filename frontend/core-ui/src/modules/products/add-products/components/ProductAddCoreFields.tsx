import { UseFormReturn } from 'react-hook-form';
import {
  IconDeviceUnknown,
  IconHotelService,
  IconPackage,
  IconStar,
} from '@tabler/icons-react';

import { Form, Input, Select, Separator } from 'erxes-ui';
import { SelectCurrency } from 'erxes-ui/components/select-currency';
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
      <Form.Field
        control={form.control}
        name="name"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>NAME</Form.Label>
            <Form.Control>
              <Input className="rounded-md h-8" {...field} />
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="code"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>CODE</Form.Label>
            <div className="flex flex-col">
              <Form.Control>
                <Input className="rounded-md h-8" {...field} />
              </Form.Control>
              <Form.Message className="text-destructive" />
            </div>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="uom"
        render={({ field }) => (
          <Form.Item className="flex flex-col">
            <Form.Label>UNIT OF MEASUREMENTS</Form.Label>
            <Select onValueChange={field.onChange} value={field.value}>
              <Form.Control>
                <Select.Trigger className="truncate w-full border rounded-md justify-between text-foreground h-8 hover:bg-muted">
                  <Select.Value
                    placeholder={
                      <span className="truncate text-foreground font-medium text-sm">
                        {'Choose UOM'}
                      </span>
                    }
                  >
                    <span className="text-foreground font-medium text-sm">
                      {uoms.find((uom: any) => uom._id === field.value)?.name}
                    </span>
                  </Select.Value>
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                {uoms.map((uom: any) => (
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
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="unitPrice"
        render={({ field }) => (
          <Form.Item className="flex flex-col">
            <Form.Label>UNIT PRICE</Form.Label>
            <Form.Control>
              <div className="flex rounded-md border border-border shadow-xs">
                <SelectCurrency
                  currencies={CURRENCY_CODES}
                  value={CurrencyCode.USD}
                  displayIcon={true}
                  className="h-full focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none focus-visible:ring-offset-0 rounded-l-md shadow-none "
                />
                <Separator orientation="vertical" />
                <Input
                  className="rounded-md h-8 border-transparent"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value || ''}
                />
              </div>
            </Form.Control>

            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <Form.Item className="flex flex-col">
            <Form.Label>CATEGORY</Form.Label>
            <Form.Control>
              <CategoryField {...field} />
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="type"
        render={({ field }) => (
          <Form.Item className="flex flex-col">
            <Form.Label>TYPE</Form.Label>
            <Select onValueChange={field.onChange} value={field.value}>
              <Form.Control>
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
              </Form.Control>
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
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
    </div>
  );
};
