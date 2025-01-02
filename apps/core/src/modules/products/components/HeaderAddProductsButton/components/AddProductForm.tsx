'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBrands } from '@/products/hooks/useBrands';
import { useProductCategories } from '@/products/hooks/useProductCategories';
import { CategoryForm } from '@/products/components/HeaderAddProductsButton/components/categoryForm';
import { TypeForm } from '@/products/components/HeaderAddProductsButton/components/typeForm';
import { BrandForm } from '@/products/components/HeaderAddProductsButton/components/brandForm';
import { UomForm } from '@/products/components/HeaderAddProductsButton/components/uomForm';
import {
  Button,
  InputBorderless,
  ScrollArea,
  Select,
  Avatar,
  Popover,
  Command,
  Skeleton,
} from 'erxes-ui/components';
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
} from '@/products/components/HeaderAddProductsButton/components/formSchema';
import { cn } from 'erxes-ui/lib';
import { useState, useRef, useEffect } from 'react';
import { IconCheck } from '@tabler/icons-react';
export function AddProductForm() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { productCategories, loading: categoriesLoading } =
    useProductCategories({
      onCompleted({ productCategories }) {
        if (productCategories?.length > 0) {
          form.setValue('categoryId', productCategories[0]._id);
        }
      },
    });
  useEffect(() => {
    console.log(categoryOpen);
  }, [categoryOpen]);
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
      categoryId: '',
    },
  });

  async function onSubmit(data: ProductFormValues) {
    try {
      await addProduct(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ScrollArea.Root className="h-[60vh] pr-4">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">
                      Name *
                    </FormLabel>
                    <div className="flex flex-col">
                      <FormControl>
                        <InputBorderless
                          className="bg-background border-input placeholder:font-bold"
                          placeholder="Name"
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
                name="code"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">
                      Code *
                    </FormLabel>
                    <div className="flex flex-col">
                      <FormControl>
                        <InputBorderless
                          className="border-none focus-visible:ring-0"
                          placeholder="Code"
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
                name="description"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">
                      Description
                    </FormLabel>
                    <div className="flex flex-col">
                      <FormControl>
                        <InputBorderless
                          className="bg-background border-input"
                          placeholder="Description"
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
                name="shortName"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">
                      Short Name *
                    </FormLabel>
                    <div className="flex flex-col">
                      <FormControl>
                        <InputBorderless
                          className="bg-background border-input"
                          placeholder="Short Name"
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
                name="unitPrice"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">
                      Unit Price *
                    </FormLabel>
                    <div className="flex flex-col">
                      <FormControl>
                        <InputBorderless
                          className="bg-background border-input"
                          placeholder="Unit Price"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          value={field.value || ''}
                        />
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
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">
                      Uom *
                    </FormLabel>
                    <div className="flex flex-col">
                      <FormControl>
                        <InputBorderless
                          className="bg-background border-input"
                          placeholder="Enter UOM"
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
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">
                      Category
                    </FormLabel>
                    <FormControl>
                      <CategoryForm
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">Type</FormLabel>
                    <FormControl>
                      <TypeForm
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="uom"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">UOM</FormLabel>
                    <FormControl>
                      <UomForm
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="scopeBrandIds"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">
                      Brand
                    </FormLabel>
                    <FormControl>
                      <BrandForm
                        values={field.value || []}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Vendor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <Select.Trigger className="bg-background border-input">
                          <Select.Value placeholder="Select vendor" />
                        </Select.Trigger>
                      </FormControl>
                      <Select.Content className="bg-background border-input">
                        {vendors.map((vendor) => (
                          <Select.Item key={vendor.value} value={vendor.value}>
                            {vendor.label}
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
                name="attachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Primary Attachment
                    </FormLabel>
                    <FormControl>
                      <InputBorderless
                        type="file"
                        className="bg-background border-input file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        {...field}
                        value={field.value?.[0]}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attachmentMore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      More Attachment
                    </FormLabel>
                    <FormControl>
                      <InputBorderless
                        type="file"
                        className="bg-background border-input file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        {...field}
                        value={field.value?.[0]}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea.Root>

          <div className="flex justify-end space-x-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="bg-background hover:bg-background/90"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Product
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
