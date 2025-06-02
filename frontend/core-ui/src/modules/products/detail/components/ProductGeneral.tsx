'use client';

import type React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useProductDetail } from '../hooks/useProductDetail';
import { useUom } from '@/products/hooks/useUom';
import { ProductHotKeyScope } from '@/products/types/ProductsHotKeyScope';
import { ProductBasicFields } from './ProductBasicFields';
import { FileUploadSection } from './FileUploadSection';
import { useProductFormData } from '../hooks/useProductFormData';
import { ProductEditorField } from './ProductEditor';
import { ProductFormValues } from '@/products/constants/ProductFormSchema';
import { Spinner } from 'erxes-ui';

interface ProductDetailFormProps {
  form: UseFormReturn<ProductFormValues>;
}

export const ProductDetailForm: React.FC<ProductDetailFormProps> = ({
  form,
}) => {
  const { productDetail, loading } = useProductDetail();
  const { uoms } = useUom({});

  useProductFormData(productDetail, form);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Spinner size="large" />
        <p className="text-muted-foreground font-medium">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 overflow-y-auto max-h-[calc(100vh-100px)] bg-white rounded-lg pb-24">
      <ProductBasicFields control={form.control} uoms={uoms} />
      <ProductEditorField
        control={form.control}
        setValue={form.setValue}
        name="description"
        label="DESCRIPTION"
        initialContent={productDetail?.description}
        scope={ProductHotKeyScope.ProductAddSheetDescriptionField}
      />

      <ProductEditorField
        control={form.control}
        setValue={form.setValue}
        name="barcodeDescription"
        label="BARCODE DESCRIPTION"
        initialContent={productDetail?.barcodeDescription}
        scope={ProductHotKeyScope.ProductAddSheetBarcodeDescriptionField}
      />

      <FileUploadSection label="FEATURED IMAGE" buttonText="Upload Image" />

      <FileUploadSection
        label="SECONDARY IMAGES"
        buttonText="Upload Images"
        variant="secondary"
        multiple
      />
    </div>
  );
};