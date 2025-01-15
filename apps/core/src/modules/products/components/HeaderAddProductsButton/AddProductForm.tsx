'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryForm } from '@/products/components/HeaderAddProductsButton/components/categoryForm';
import { TypeForm } from '@/products/components/HeaderAddProductsButton/components/typeForm';
import { BrandForm } from '@/products/components/HeaderAddProductsButton/components/brandForm';
import { UomForm } from '@/products/components/HeaderAddProductsButton/components/uomForm';
import { VendorForm } from '@/products/components/HeaderAddProductsButton/components/vendorForm';
import {
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconUpload,
} from '@tabler/icons-react';
import {
  Button,
  Sheet,
  Input,
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
import { useState } from 'react';
export function AddProductForm() {
  const [isExtended, setIsExtended] = useState<boolean>(false);
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
    <Sheet>
      <Sheet.Trigger>
        <Button>
          <IconPlus className="w-4 h-4" />
          Add product
        </Button>
      </Sheet.Trigger>
      <Sheet.Content className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea.Root
              className="h-[82vh] px-2"
              scrollBarClassName="hidden"
            >
              <Sheet.Title className="mb-6">
                <span className="text-lg font-semibold">
                  Create new product or service
                </span>
                <p className="text-sm text-muted-foreground">
                  Create and configure your products & services
                </p>
              </Sheet.Title>
              <div className="grid grid-cols-2 gap-5 ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-xs text-muted-foreground ">
                        NAME
                      </FormLabel>
                      <div className="flex flex-col ml-1">
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
                        <CategoryForm
                          {...field}
                          className="ml-1 shadow-button-outline"
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
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-muted-foreground text-xs">
                        TYPE
                      </FormLabel>
                      <FormControl>
                        <TypeForm
                          {...field}
                          className="mr-1 shadow-button-outline"
                        />
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                        <UomForm
                          {...field}
                          className="mr-1 shadow-button-outline"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              {!isExtended ? (
                <div className="flex justify-center items-center w-full my-4">
                  <Button
                    variant={'secondary'}
                    onClick={() => {
                      setIsExtended(true);
                    }}
                  >
                    <span>See more options</span>
                    <IconChevronDown
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-foreground"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center w-full my-4">
                    <div className="flex-grow border-t border-muted-foreground border-dashed" />
                    <div className="flex-shrink-0 px-4 text-muted-foreground text-sm">
                      Optional
                    </div>
                    <div className="flex-grow border-t border-muted-foreground border-dashed" />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormLabel className="text-muted-foreground text-xs">
                          DESCRIPTION
                        </FormLabel>
                        <div className="mx-2">
                          <FormControl>
                            <TextEditor
                              {...field}
                              className=" h-28 rounded-md shadow-input"
                              parseTo="html"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="attachment"
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormLabel className="text-muted-foreground text-xs">
                          UPLOAD
                        </FormLabel>
                        <FormControl>
                          <Upload.Root {...field}>
                            <Upload.Preview className="hidden" />
                            <Upload.Button
                              size="sm"
                              variant="secondary"
                              type="button"
                              className="w-full h-20 flex flex-col items-center justify-center border border-dashed border-muted-foreground text-muted-foreground"
                            >
                              <IconUpload />
                              <span>Primary upload</span>
                            </Upload.Button>
                          </Upload.Root>
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shortName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-5">
                        <FormLabel className=" text-muted-foreground text-xs">
                          SHORT NAME
                        </FormLabel>
                        <div className="flex flex-col mx-1 ">
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

                  <div className="grid grid-cols-2 gap-5 mb-5">
                    <FormField
                      control={form.control}
                      name="scopeBrandIds"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-muted-foreground text-xs">
                            BRAND
                          </FormLabel>
                          <FormControl>
                            <BrandForm
                              className="ml-1 shadow-button-outline"
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
                        <FormItem className="flex flex-col">
                          <FormLabel className=" text-muted-foreground text-xs">
                            VENDOR
                          </FormLabel>
                          <FormControl>
                            <VendorForm
                              {...field}
                              className="mr-1 shadow-button-outline"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="barcodes"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-5">
                        <FormLabel className="text-muted-foreground text-xs">
                          BARCODES
                        </FormLabel>
                        <div className="flex flex-col mx-1 ">
                          <FormControl>
                            <Input
                              className=" border-0 rounded-md focus-visible:ring-0 shadow-input"
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
                      <FormItem className="mb-5">
                        <FormLabel className="text-muted-foreground text-xs">
                          BARCODE DESCRIPTION
                        </FormLabel>
                        <div className="mx-2">
                          <FormControl>
                            <TextEditor
                              {...field}
                              className=" h-28 rounded-md shadow-input"
                              parseTo="html"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="attachmentMore"
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormLabel className="text-muted-foreground text-xs">
                          SECONDARY UPLOAD
                        </FormLabel>
                        <FormControl>
                          <Upload.Root {...field}>
                            <Upload.Preview className="hidden" />
                            <Upload.Button
                              size="sm"
                              variant="secondary"
                              type="button"
                              className="w-full h-20 flex flex-col items-center justify-center border border-dashed border-muted-foreground text-muted-foreground"
                            >
                              <IconUpload />
                              <span>Secondary upload</span>
                            </Upload.Button>
                          </Upload.Root>
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-center items-center w-full my-4">
                    <Button
                      variant={'secondary'}
                      onClick={() => {
                        setIsExtended(false);
                      }}
                    >
                      <span>See less options</span>
                      <IconChevronUp
                        size={16}
                        strokeWidth={2}
                        className="shrink-0 text-foreground"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </>
              )}
            </ScrollArea.Root>

            <Sheet.Footer className="flex justify-end space-x-4 pt-4 border-t border-border">
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
                Save
              </Button>
            </Sheet.Footer>
          </form>
        </Form>
      </Sheet.Content>
    </Sheet>
  );
}
