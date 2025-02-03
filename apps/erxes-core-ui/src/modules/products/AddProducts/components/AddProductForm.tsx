'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, ScrollArea, Sheet } from 'erxes-ui/components';
import { Form } from 'erxes-ui/components/form';

import { ProductAddCollapsible } from './ProductAddCollapsible';
import { ProductAddCoreFields } from './ProductAddCoreFields';
import { ProductAddMoreFields } from './ProductAddMoreFields';
import { ProductAddSheet, ProductAddSheetHeader } from './ProductAddSheet';

import {
  productFormSchema,
  ProductFormValues,
} from '@/products/AddProducts/components/formSchema';
import { useAddProduct } from '@/products/hooks/useAddProduct';

export function AddProductForm() {
  const [open, setOpen] = useState<boolean>(false);
  const { addProduct } = useAddProduct();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      code: '',
      categoryId: '',
      vendorId: '',
      type: '',
      uom: '',
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
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ProductAddSheet onOpenChange={setOpen} open={open}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col h-full"
        >
          <ScrollArea.Root className="flex-auto">
            <ProductAddSheetHeader />
            <div className="px-5">
              <ProductAddCoreFields form={form} />
              <ProductAddCollapsible>
                <ProductAddMoreFields form={form} />
              </ProductAddCollapsible>
            </div>
          </ScrollArea.Root>

          <Sheet.Footer className="flex justify-end flex-shrink-0 p-2.5 gap-1 bg-muted">
            <Button
              type="button"
              variant="ghost"
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
    </ProductAddSheet>
  );
}
