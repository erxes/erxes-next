'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryForm } from '@/products/components/HeaderAddProductsButton/components/categoryForm';
import { TypeForm } from '@/products/components/HeaderAddProductsButton/components/typeForm';
import { BrandForm } from '@/products/components/HeaderAddProductsButton/components/brandForm';
import { UomForm } from '@/products/components/HeaderAddProductsButton/components/uomForm';
import { VendorForm } from '@/products/components/HeaderAddProductsButton/components/vendorForm';
import {
  Button,
  InputBorderless,
  ScrollArea,
  Upload,
  TextEditor,
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
} from '@/products/components/HeaderAddProductsButton/components/formSchema';
export function AddProductForm() {
  const { addProduct } = useAddProduct();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      shortName: '',
      attachment: null,
      attachmentMore: null,
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">
                      Category
                    </FormLabel>
                    <FormControl>
                      <CategoryForm {...field} />
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
                      <TypeForm {...field} />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="uom"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">UOM</FormLabel>
                    <FormControl>
                      <UomForm {...field} />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

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

              {/* <FormField
                control={form.control}
                name="vendorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Vendor</FormLabel>
                    <FormControl>
                      <VendorForm {...field} />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="attachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Featured Attachment
                    </FormLabel>
                    <FormControl>
                      <Upload.Root {...field}>
                        <Upload.Preview />
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-4">
                            <Upload.Button
                              size="sm"
                              variant="outline"
                              type="button"
                            >
                              Upload an attachment
                            </Upload.Button>
                            <Upload.RemoveButton
                              size="sm"
                              variant="outline"
                              type="button"
                            />
                          </div>
                        </div>
                      </Upload.Root>
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
                      <Upload.Root {...field} >
                        <Upload.Preview />
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-4">
                            <Upload.Button
                              size="sm"
                              variant="outline"
                              type="button"
                            />
                          </div>
                        </div>
                      </Upload.Root>
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Description
                    </FormLabel>
                    <FormControl>
                      <TextEditor
                        {...field}
                        className="h-28 border border-foreground rounded-lg"
                        parseTo="html"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcodes"
                render={({ field }) => (
                  <FormItem className="flex gap-20 items-center">
                    <FormLabel className="text-foreground w-24">
                      Barcodes
                    </FormLabel>
                    <div className="flex flex-col">
                      <FormControl>
                        <InputBorderless
                          className="bg-background border-input"
                          placeholder="Short Name"
                          {...field}
                          onChange={(e) => field.onChange([e.target.value])}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barcodeDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Bar code description
                    </FormLabel>
                    <FormControl>
                      <TextEditor
                        {...field}
                        className="h-28 border border-foreground rounded-lg"
                        parseTo="html"
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
