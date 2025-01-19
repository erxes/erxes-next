import {
  FormMessage,
  Input,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  TextEditor,
  Upload,
} from 'erxes-ui/components';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from './formSchema';
import { BrandField } from './brandField';
import { VendorField } from './vendorField';
import { IconUpload } from '@tabler/icons-react';

export const ProductAddMoreFields = ({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="mb-5">
            <FormLabel className="text-muted-foreground text-xs">
              DESCRIPTION
            </FormLabel>

            <FormControl>
              <TextEditor
                {...field}
                className=" h-28 rounded-md border"
                parseTo="html"
              />
            </FormControl>
            <FormMessage className="text-destructive" />
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
                  <span className="font-medium text-sm">Primary upload</span>
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
            <div className="flex flex-col">
              <FormControl>
                <Input className="rounded-md h-8" {...field} />
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
                <BrandField
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
                <VendorField {...field} />
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
            <div className="flex flex-col">
              <FormControl>
                <Input
                  className="rounded-md h-8"
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
            <FormControl>
              <TextEditor
                {...field}
                className=" h-28 rounded-md border"
                parseTo="html"
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
                  <span className="font-medium text-sm">Secondary upload</span>
                </Upload.Button>
              </Upload.Root>
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
    </>
  );
};
