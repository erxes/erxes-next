'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBrands } from '@/products/hooks/useBrands';
import { useProductCategories } from '@/products/hooks/useProductCategories';
import { Button, Input, ScrollArea, Select } from 'erxes-ui/components';
import { useAddProduct } from '@/products/hooks/useAddProduct';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from 'erxes-ui/components/form';
import {
  productFormSchema,
  ProductFormValues,
  types,
  vendors,
} from './formSchema';

export function AddProductForm() {
  const { productCategories, loading: categoriesLoading } =
    useProductCategories({});
  const { brands, loading: brandsLoading } = useBrands({});
  const { addProduct, loading } = useAddProduct();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      code: '',
      name: '',
      shortName: '',
      unitPrice: 0,
      uom: '',
      attachment: null,
      attachmentMore: [],
      description: '',
      pdfAttachment: {},
      subUoms: [],
      barcodes: [],
      variants: {},
      barcodeDescription: '',
      scopeBrandIds: [],
    },
  });

  async function onSubmit(data: ProductFormValues) {
    console.log(data);
    try {
      await addProduct(data);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea.Root className="h-[60vh] pr-4">
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Add description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter short name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter a unit price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.[0]}
                  >
                    <FormControl>
                      <Select.Trigger>
                        <Select.Value placeholder="Select category" />
                      </Select.Trigger>
                    </FormControl>
                    <Select.Content>
                      {(categoriesLoading ? [] : productCategories).map(
                        (category) => (
                          <Select.Item key={category._id} value={category._id}>
                            {category.name}
                          </Select.Item>
                        )
                      )}
                    </Select.Content>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.[0]}
                  >
                    <FormControl>
                      <Select.Trigger>
                        <Select.Value placeholder="Select type" />
                      </Select.Trigger>
                    </FormControl>
                    <Select.Content>
                      {types.map((type) => (
                        <Select.Item key={type.value} value={type.value}>
                          {type.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measure *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter UOM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <Select.Trigger>
                        <Select.Value placeholder="Select vendor" />
                      </Select.Trigger>
                    </FormControl>
                    <Select.Content>
                      {vendors.map((vendor) => (
                        <Select.Item key={vendor.value} value={vendor.value}>
                          {vendor.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scopeBrandIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange([value])}
                    defaultValue={'12938713'}
                  >
                    <FormControl>
                      <Select.Trigger>
                        <Select.Value placeholder="Select a Brand" />
                      </Select.Trigger>
                    </FormControl>
                    <Select.Content>
                      {(brandsLoading ? [] : brands).map((brand) => (
                        <Select.Item key={brand._id} value={brand._id}>
                          {brand.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Attachment</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} value={field.value?.[0]} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachmentMore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>More Attachment</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} value={field.value?.[0]} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea.Root>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </Form>
  );
}
