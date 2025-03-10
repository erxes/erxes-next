import { UseFormReturn } from 'react-hook-form';

import { IconUpload } from '@tabler/icons-react';

import { Form, Input, Upload } from 'erxes-ui/components';

import { BlockEditor } from 'erxes-ui/modules/blocks/components/BlockEditor';
import { BrandField } from '@/products/add-products/components/BrandField';
import { ProductFormValues } from './formSchema';
import { VendorField } from './vendorField';
import { useCreateBlockNote } from '@blocknote/react';
import { BLOCK_SCHEMA } from 'erxes-ui/modules/blocks/constant/blockEditorSchema';

export const ProductAddMoreFields = ({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) => {
  const descriptionEditor = useCreateBlockNote({
    schema: BLOCK_SCHEMA,
  });
  const barcodeDescriptionEditor = useCreateBlockNote({
    schema: BLOCK_SCHEMA,
  });
  return (
    <>
      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-muted-foreground" />
        <Form.Label className="mx-2">More Info</Form.Label>
        <div className="flex-1 border-t border-muted-foreground" />
      </div>
      <Form.Field
        control={form.control}
        name="description"
        render={({ field }) => (
          <Form.Item className="mb-5">
            <Form.Label>DESCRIPTION</Form.Label>
            <Form.Control>
              <BlockEditor
                onChange={field.onChange}
                editor={descriptionEditor}
                className=" h-28 rounded-md border overflow-auto"
              />
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="shortName"
        render={({ field }) => (
          <Form.Item className="flex flex-col mb-5">
            <Form.Label>SHORT NAME</Form.Label>
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
        name="barcodes"
        render={({ field }) => (
          <Form.Item className="flex flex-col mb-5">
            <Form.Label>BARCODES</Form.Label>
            <div className="flex flex-col">
              <Form.Control>
                <Input
                  className="rounded-md h-8"
                  {...field}
                  onChange={(e) => field.onChange([e.target.value])}
                />
              </Form.Control>
              <Form.Message className="text-destructive" />
            </div>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="barcodeDescription"
        render={({ field }) => (
          <Form.Item className="mb-5">
            <Form.Label>BARCODE DESCRIPTION</Form.Label>
            <Form.Control>
              <BlockEditor
                onChange={field.onChange}
                editor={barcodeDescriptionEditor}
                className=" h-28 rounded-md border overflow-auto"
              />
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Form.Field
          control={form.control}
          name="scopeBrandIds"
          render={({ field }) => (
            <Form.Item className="flex flex-col">
              <Form.Label>BRAND</Form.Label>
              <Form.Control>
                <BrandField
                  values={field.value || []}
                  onChange={field.onChange}
                />
              </Form.Control>
              <Form.Message className="text-destructive" />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="vendorId"
          render={({ field }) => (
            <Form.Item className="flex flex-col">
              <Form.Label>VENDOR</Form.Label>
              <Form.Control>
                <VendorField {...field} />
              </Form.Control>
              <Form.Message className="text-destructive" />
            </Form.Item>
          )}
        />
      </div>
      <Form.Field
        control={form.control}
        name="attachment"
        render={({ field }) => (
          <Form.Item className="mb-5">
            <Form.Label>UPLOAD</Form.Label>
            <Form.Control>
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
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="attachmentMore"
        render={({ field }) => (
          <Form.Item className="mb-5">
            <Form.Label>SECONDARY UPLOAD</Form.Label>
            <Form.Control>
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
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
    </>
  );
};
