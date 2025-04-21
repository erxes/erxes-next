'use client';

import { IconUpload } from '@tabler/icons-react';
import { useProductDetail } from '../hooks/useProductDetail';
import { Skeleton, Label, Input, Select, Button } from 'erxes-ui/components';
import { useProductsEdit } from '@/products/hooks/useProductsEdit';
import { PRODUCT_TYPE_OPTIONS } from '@/products/constants/ProductConstants';
import { IconCurrencyDollar } from '@tabler/icons-react';
import { CurrencyDisplay } from 'erxes-ui/display';
import { CurrencyCode } from 'erxes-ui/types/CurrencyCode';
import { CurrencyInput } from 'erxes-ui/modules/record-field/meta-inputs/components/CurrencyInput';
import { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { SelectCategory } from '@/products/product-category/components/SelectCategory';
import { useUom } from '@/products/hooks/useUom';
import { BrandField } from '@/products/add-products/components/BrandField';
import { VendorField } from '@/products/add-products/components/vendorField';
import type { ProductDetail, ProductGeneralProps } from '../types/detailTypes';
import { DescriptionInput } from './DescriptionInput';

export const ProductGeneral = ({ form }: ProductGeneralProps) => {
  const {
    productDetail,
    loading: productLoading,
    error: productError,
  } = useProductDetail();
  const { productsEdit } = useProductsEdit();
  const [priceValue, setPriceValue] = useState<number>(0);
  const [isEditingPrice, setIsEditingPrice] = useState<boolean>(false);
  const client = useApolloClient();
  const { uoms } = useUom({});

  const loading = productLoading;

  useEffect(() => {
    if (productDetail && productDetail.unitPrice !== undefined) {
      setPriceValue(productDetail.unitPrice);
    }
  }, [productDetail]);

  useEffect(() => {
    if (productDetail && form) {
      if (productDetail.scopeBrandIds && form.setValue) {
        form.setValue('scopeBrandIds', productDetail.scopeBrandIds);
      }
      if (productDetail.vendorId && form.setValue) {
        form.setValue('vendorId', productDetail.vendorId);
      }
    }
  }, [productDetail, form]);

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (productError) {
    return (
      <div className="error-message">
        <p>
          Oops! There was an error loading the product details. Please try again
          later.
        </p>
      </div>
    );
  }

  const {
    _id,
    name,
    barcodeDescription,
    description,
    categoryId,
    type,
    code,
    status,
    attachment,
    barcodes,
    shortName,
    uom,
    vendorId,
    scopeBrandIds,
  } = productDetail || ({} as ProductDetail);

  const handleInputChange = (field: keyof ProductDetail, value: any) => {
    if (_id) {
      productsEdit({
        variables: {
          _id,
          [field]: value,
          uom,
        },
      });
    }
  };

  const handleSavePrice = async () => {
    if (_id) {
      productsEdit({
        variables: {
          _id,
          unitPrice: priceValue,
          uom,
        },
      });
      await client.refetchQueries({
        include: ['productDetail'],
      });
      setIsEditingPrice(false);
    }
  };

  const handleCancelPriceEdit = () => {
    if (productDetail && productDetail.unitPrice !== undefined) {
      setPriceValue(productDetail.unitPrice);
    }
    setIsEditingPrice(false);
  };

  const handleSaveDescription = (value: string) => {
    handleInputChange('description', value);
  };

  const handleSaveBarcodeDescription = (value: string) => {
    handleInputChange('barcodeDescription', value);
  };

  return (
    <div className="space-y-8 p-6 overflow-y-auto h-[900px] bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <Label
            htmlFor="product-name"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            PRODUCT NAME
          </Label>
          <Input
            id="product-name"
            defaultValue={name}
            placeholder="Enter product name"
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="barcodes"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            BARCODES
          </Label>
          <Input
            id="barcodes"
            defaultValue={barcodes}
            onChange={(e) => handleInputChange('barcodes', e.target.value)}
            className="w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="code"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            CODE
          </Label>
          <Input
            id="code"
            defaultValue={code}
            onChange={(e) => handleInputChange('code', e.target.value)}
            className="w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            CATEGORY
          </Label>
          <SelectCategory
            selected={categoryId}
            onSelect={(value) => {
              if (_id) {
                productsEdit({
                  variables: {
                    _id,
                    categoryId: value,
                    uom,
                  },
                });
              }
            }}
            className="w-full border border-gray-300"
            size="lg"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconCurrencyDollar className="h-4 w-4" />
            <Label
              htmlFor="unit-price"
              className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
            >
              UNIT PRICE
            </Label>
          </div>
          {isEditingPrice ? (
            <div className="flex items-center space-x-2">
              <div className="flex-grow">
                <CurrencyInput
                  value={priceValue}
                  onChange={(value: number) => setPriceValue(value)}
                />
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleSavePrice}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelPriceEdit}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => setIsEditingPrice(true)}
            >
              <CurrencyDisplay
                currencyValue={{
                  currencyCode: CurrencyCode.USD,
                  amountMicros: priceValue * 1000000,
                }}
              />
              <Button
                size="sm"
                variant="ghost"
                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingPrice(true);
                }}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="category-display"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            STATUS
          </Label>
          <Input
            id="category-display"
            value={status}
            disabled
            className="bg-gray-50 w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="type"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            TYPE
          </Label>
          <Select
            defaultValue={type}
            onValueChange={(value) => handleInputChange('type', value)}
          >
            <Select.Trigger className="w-full border-gray-200 rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all">
              <Select.Value placeholder="Choose type" />
            </Select.Trigger>
            <Select.Content>
              {PRODUCT_TYPE_OPTIONS.map((type) => (
                <Select.Item value={type.value} key={type.value}>
                  {type.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="uom"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            UNIT OF MEASUREMENTS
          </Label>
          <Select
            value={uom}
            onValueChange={(value) => handleInputChange('uom', value)}
          >
            <Select.Trigger className="w-full border-gray-200 rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all">
              <Select.Value>{uom || 'Select UOM'}</Select.Value>
            </Select.Trigger>
            <Select.Content>
              {uoms.map((unit) => (
                <Select.Item key={unit._id} value={unit._id}>
                  {unit.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="brand"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            BRAND
          </Label>
          <BrandField
            values={scopeBrandIds || []}
            onChange={(value) => handleInputChange('scopeBrandIds', value)}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="vendor"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            VENDOR
          </Label>
          <VendorField
            value={vendorId || ''}
            onChange={(value) => handleInputChange('vendorId', value)}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="short-name"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            SHORT NAME
          </Label>
          <Input
            id="short-name"
            defaultValue={shortName}
            onChange={(e) => handleInputChange('shortName', e.target.value)}
            className="w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
            PDF
          </Label>
          <Button variant="outline" className="w-full justify-between">
            Upload a PDF
            <IconUpload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
        >
          DESCRIPTION
        </Label>
        <div className="h-60 border rounded-md overflow-hidden shadow-sm hover:shadow transition-shadow">
          <DescriptionInput
            initialContent={description}
            onSave={handleSaveDescription}
            placeholder={description || 'Enter product description...'}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="barcode-description"
          className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
        >
          BARCODE DESCRIPTION
        </Label>
        <div className="h-60 border rounded-md overflow-hidden shadow-sm hover:shadow transition-shadow">
          <DescriptionInput
            initialContent={barcodeDescription}
            onSave={handleSaveBarcodeDescription}
            placeholder={barcodeDescription || 'Enter barcode description...'}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
          FEATURED IMAGE
        </Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
          {attachment ? (
            <div className="flex flex-col items-center">
              <img
                src={attachment.url || '/placeholder.svg'}
                alt={name || 'Product'}
                className="max-h-40 mb-2"
              />
              <Button
                variant="outline"
                className="mt-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50"
              >
                <IconUpload className="h-4 w-4 mr-2" />
                Change Image
              </Button>
            </div>
          ) : (
            <Button variant="outline">
              <IconUpload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
          SECONDARY IMAGES
        </Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
          <Button
            variant="outline"
            className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          >
            <IconUpload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </div>
      </div>
    </div>
  );
};
