'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { Form, Checkbox, Button, Label } from 'erxes-ui';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { ProductFormValues } from '../formSchema';
import { IPosDetail } from '~/modules/pos-detail/types/IPos';
import { SelectCategory, SelectProduct } from 'ui-modules';

interface ProductFormProps {
  form?: UseFormReturn<ProductFormValues>;
  posDetail?: IPosDetail;
  isReadOnly?: boolean;
  onSubmit?: (data: ProductFormValues) => Promise<void>;
}

export default function ProductForm({
  form: externalForm,
  posDetail,
  isReadOnly = false,
  onSubmit,
}: ProductFormProps) {
  const isEditMode = !!posDetail;
  const [showProductGroups, setShowProductGroups] = useState(false);
  const [showMappings, setShowMappings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const internalForm = useForm<ProductFormValues>({
    defaultValues: {
      productDetails: [],
      catProdMappings: [],
      initialCategoryIds: [],
      kioskExcludeCategoryIds: [],
      kioskExcludeProductIds: [],
      checkExcludeCategoryIds: [],
    },
  });

  const form = externalForm || internalForm;

  useEffect(() => {
    if (!posDetail) return;

    form.reset({
      productDetails: posDetail.productDetails || [],
      catProdMappings: posDetail.catProdMappings || [],
      initialCategoryIds: posDetail.initialCategoryIds || [],
      kioskExcludeCategoryIds: posDetail.kioskExcludeCategoryIds || [],
      kioskExcludeProductIds: posDetail.kioskExcludeProductIds || [],
      checkExcludeCategoryIds: posDetail.checkExcludeCategoryIds || [],
    });

    if (posDetail.productDetails && posDetail.productDetails.length > 0) {
      setShowProductGroups(true);
    }
    if (posDetail.catProdMappings && posDetail.catProdMappings.length > 0) {
      setShowMappings(true);
    }
  }, [posDetail, form]);

  const handleToggleProductGroups = () => {
    if (isReadOnly) return;
    setShowProductGroups(!showProductGroups);
  };

  const handleToggleMappings = () => {
    if (isReadOnly) return;
    setShowMappings(!showMappings);
  };

  const handleAddProductDetail = () => {
    if (isReadOnly) return;
    const currentDetails = form.watch('productDetails') || [];
    const newProductDetail = {
      productId: '',
      categoryId: '',
      isRequired: false,
    };
    form.setValue('productDetails', [...currentDetails, newProductDetail]);
  };

  const handleAddMapping = () => {
    if (isReadOnly) return;
    const currentMappings = form.watch('catProdMappings') || [];
    const newMapping = {
      categoryId: '',
      productIds: [],
    };
    form.setValue('catProdMappings', [...currentMappings, newMapping]);
  };

  const handleRemoveProductDetail = (index: number) => {
    if (isReadOnly) return;
    const currentDetails = form.watch('productDetails') || [];
    const updatedDetails = currentDetails.filter((_, i) => i !== index);
    form.setValue('productDetails', updatedDetails);
  };

  const handleRemoveMapping = (index: number) => {
    if (isReadOnly) return;
    const currentMappings = form.watch('catProdMappings') || [];
    const updatedMappings = currentMappings.filter((_, i) => i !== index);
    form.setValue('catProdMappings', updatedMappings);
  };

  const handleSubmit = async (data: ProductFormValues) => {
    if (isReadOnly || !onSubmit) return;

    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (categoryId: string, fieldName: string) => {
    const currentValue = form.watch(fieldName as any) || [];
    if (currentValue.includes(categoryId)) {
      form.setValue(fieldName as any, currentValue.filter((id: string) => id !== categoryId));
    } else {
      form.setValue(fieldName as any, [...currentValue, categoryId]);
    }
  };

  const handleProductSelect = (productId: string, fieldName: string) => {
    const currentValue = form.watch(fieldName as any) || [];
    if (currentValue.includes(productId)) {
      form.setValue(fieldName as any, currentValue.filter((id: string) => id !== productId));
    } else {
      form.setValue(fieldName as any, [...currentValue, productId]);
    }
  };

  const handleProductDetailCategorySelect = (categoryId: string, index: number) => {
    form.setValue(`productDetails.${index}.categoryId`, categoryId);
  };

  const handleProductDetailProductSelect = (productId: string, index: number) => {
    form.setValue(`productDetails.${index}.productId`, productId);
  };

  const handleMappingCategorySelect = (categoryId: string, index: number) => {
    form.setValue(`catProdMappings.${index}.categoryId`, categoryId);
  };

  const handleMappingProductSelect = (productId: string, index: number) => {
    const currentProductIds = form.watch(`catProdMappings.${index}.productIds`) || [];
    if (!currentProductIds.includes(productId)) {
      form.setValue(`catProdMappings.${index}.productIds`, [...currentProductIds, productId]);
    }
  };

  const handleRemoveProductFromMapping = (productId: string, index: number) => {
    const currentProductIds = form.watch(`catProdMappings.${index}.productIds`) || [];
    form.setValue(`catProdMappings.${index}.productIds`, 
      currentProductIds.filter((id: string) => id !== productId)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-3">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">
              PRODUCT DETAILS
            </h2>

            <Button
              type="button"
              onClick={handleToggleProductGroups}
              className="hover:bg-indigo-700 text-white flex items-center gap-2"
              disabled={isReadOnly}
            >
              <IconPlus size={16} />
              {showProductGroups ? 'Hide' : 'Show'} Product Details
            </Button>

            {showProductGroups && (
              <div className="space-y-4">
                {(form.watch('productDetails') || []).map((detail, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 mt-4 p-4 border rounded-md"
                  >
                    <Form.Field
                      control={form.control}
                      name={`productDetails.${index}.productId`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                            PRODUCT <span className="text-red-500">*</span>
                          </Form.Label>
                          <Form.Control>
                            <SelectProduct
                              value={field.value}
                              onValueChange={(productId) => 
                                handleProductDetailProductSelect(productId, index)
                              }
                              disabled={isReadOnly}
                              className="border border-gray-300 h-10"
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field
                      control={form.control}
                      name={`productDetails.${index}.categoryId`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                            CATEGORY
                          </Form.Label>
                          <Form.Control>
                            <SelectCategory
                              selected={field.value}
                              onSelect={(categoryId) => 
                                handleProductDetailCategorySelect(categoryId as string, index)
                              }
                              disabled={isReadOnly}
                              className="border border-gray-300 h-10"
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field
                      control={form.control}
                      name={`productDetails.${index}.isRequired`}
                      render={({ field }) => (
                        <Form.Item>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(Boolean(checked))
                              }
                              id={`required-${index}`}
                              disabled={isReadOnly}
                            />
                            <Label
                              htmlFor={`required-${index}`}
                              className="text-sm text-gray-500"
                            >
                              Required
                            </Label>
                          </div>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    {!isReadOnly && (
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProductDetail(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <IconTrash size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {!isReadOnly && (
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={handleAddProductDetail}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <IconPlus size={16} className="mr-1" />
                      Add Product Detail
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">
              INITIAL PRODUCT CATEGORIES
            </h2>
            <Form.Field
              control={form.control}
              name="initialCategoryIds"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                    INITIAL CATEGORY IDS
                  </Form.Label>
                  <Form.Control>
                    <div className="space-y-2">
                      <SelectCategory
                        selected={field.value?.[0]}
                        onSelect={(categoryId) => 
                          handleCategorySelect(categoryId as string, 'initialCategoryIds')
                        }
                        disabled={isReadOnly}
                        className="w-full h-10 px-3 text-left justify-between"
                      />
                      {field.value && field.value.length > 0 && (
                        <div className="text-sm text-gray-600">
                          Selected: {field.value.length} category(ies)
                        </div>
                      )}
                    </div>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">
              KIOSK EXCLUDE PRODUCTS
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="kioskExcludeCategoryIds"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                      EXCLUDE CATEGORIES
                    </Form.Label>
                    <Form.Control>
                      <div className="space-y-2">
                        <SelectCategory
                          selected={field.value?.[0]}
                          onSelect={(categoryId) => 
                            handleCategorySelect(categoryId as string, 'kioskExcludeCategoryIds')
                          }
                          disabled={isReadOnly}
                          className="w-full h-10 px-3 text-left justify-between"
                        />
                        {field.value && field.value.length > 0 && (
                          <div className="text-sm text-gray-600">
                            Selected: {field.value.length} category(ies)
                          </div>
                        )}
                      </div>
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />

              <Form.Field
                control={form.control}
                name="kioskExcludeProductIds"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                      EXCLUDE PRODUCTS
                    </Form.Label>
                    <Form.Control>
                      <div className="space-y-2">
                        <SelectProduct
                          value={field.value?.[0]}
                          onValueChange={(productId) => 
                            handleProductSelect(productId, 'kioskExcludeProductIds')
                          }
                          disabled={isReadOnly}
                          className="w-full h-10 px-3 text-left justify-between"
                        />
                        {field.value && field.value.length > 0 && (
                          <div className="text-sm text-gray-600">
                            Selected: {field.value.length} product(s)
                          </div>
                        )}
                      </div>
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">
              PRODUCT & CATEGORY MAPPING
            </h2>
            <p className="text-sm text-gray-500">
              MAP A PRODUCT TO CATEGORY. WHEN A PRODUCT WITHIN THAT CATEGORY IS
              SOLD IN POS SYSTEM WITH TAKE OPTION, THEN THE MAPPED PRODUCT WILL
              BE ADDED TO THE PRICE
            </p>

            <Button
              type="button"
              onClick={handleToggleMappings}
              className="hover:bg-indigo-700 text-white flex items-center gap-2"
              disabled={isReadOnly}
            >
              <IconPlus size={16} />
              {showMappings ? 'Hide' : 'Show'} Mappings
            </Button>

            {showMappings && (
              <div className="space-y-4 p-4 mt-4 border rounded-md">
                {(form.watch('catProdMappings') || []).map((mapping, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mt-4">
                    <Form.Field
                      control={form.control}
                      name={`catProdMappings.${index}.categoryId`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                            CATEGORY <span className="text-red-500">*</span>
                          </Form.Label>
                          <Form.Control>
                            <SelectCategory
                              selected={field.value}
                              onSelect={(categoryId) => 
                                handleMappingCategorySelect(categoryId as string, index)
                              }
                              disabled={isReadOnly}
                              className="border border-gray-300 h-10"
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field
                      control={form.control}
                      name={`catProdMappings.${index}.productIds`}
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                            PRODUCTS
                          </Form.Label>
                          <Form.Control>
                            <div className="space-y-2">
                              <SelectProduct
                                value=""
                                onValueChange={(productId) => 
                                  handleMappingProductSelect(productId, index)
                                }
                                disabled={isReadOnly}
                                className="w-full h-10 px-3 text-left justify-between"
                              />
                              {field.value && field.value.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {field.value.map((productId: string) => (
                                    <div
                                      key={productId}
                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                                    >
                                      Product: {productId}
                                      {!isReadOnly && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveProductFromMapping(productId, index)}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          ×
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    {!isReadOnly && (
                      <div className="flex justify-end col-span-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMapping(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <IconTrash size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {!isReadOnly && (
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={handleAddMapping}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <IconPlus size={16} className="mr-1" />
                      Add Mapping
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-[#4F46E5] text-lg font-semibold uppercase">
              CHECK EXCLUDE CATEGORIES
            </h2>
            <Form.Field
              control={form.control}
              name="checkExcludeCategoryIds"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                    EXCLUDE CATEGORIES
                  </Form.Label>
                  <Form.Control>
                    <div className="space-y-2">
                      <SelectCategory
                        selected={field.value?.[0]}
                        onSelect={(categoryId) => 
                          handleCategorySelect(categoryId as string, 'checkExcludeCategoryIds')
                        }
                        disabled={isReadOnly}
                        className="w-full h-10 px-3 text-left justify-between"
                      />
                      {field.value && field.value.length > 0 && (
                        <div className="text-sm text-gray-600">
                          Selected: {field.value.length} category(ies)
                        </div>
                      )}
                    </div>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
        </div>

        {!isReadOnly && onSubmit && (
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}