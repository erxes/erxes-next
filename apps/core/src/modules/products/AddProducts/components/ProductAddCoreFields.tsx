import {
  FormMessage,
  Input,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
} from 'erxes-ui/components';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from './formSchema';
import { TypeForm } from './typeForm';
import { CategoryForm } from './categoryForm';
import { UomForm } from './uomForm';

export const ProductAddCoreFields = ({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) => {
  return (
    <div className="grid grid-cols-2 gap-5 ">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NAME</FormLabel>

            <FormControl>
              <Input className="rounded-md" {...field} />
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
            <FormLabel className="text-muted-foreground text-xs">
              CODE
            </FormLabel>
            <div className="flex flex-col mr-1">
              <FormControl>
                <Input
                  className=" border-0 rounded-md focus-visible:ring-0 shadow-input"
                  {...field}
                />
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
            <FormLabel className="text-muted-foreground text-xs">
              CATEGORY
            </FormLabel>
            <FormControl>
              <CategoryForm {...field} className="ml-1 shadow-button-outline" />
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
            <FormLabel className="text-muted-foreground text-xs">
              TYPE
            </FormLabel>
            <FormControl>
              <TypeForm {...field} className="mr-1 shadow-button-outline" />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="unitPrice"
        render={({ field }) => (
          <FormItem className="flex flex-col ml-1 ">
            <FormLabel className="text-muted-foreground text-xs">
              UNIT PRICE
            </FormLabel>
            <FormControl>
              <Input
                className=" border-0 rounded-md focus-visible:ring-0 shadow-input"
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
            <FormLabel className="text-muted-foreground text-xs">
              UNIT OF MEASUREMENTS
            </FormLabel>
            <FormControl>
              <UomForm {...field} className="mr-1 shadow-button-outline" />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
    </div>
  );
};
