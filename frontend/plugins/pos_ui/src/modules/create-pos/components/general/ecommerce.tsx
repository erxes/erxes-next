'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, Input, Select } from 'erxes-ui';
import { BasicInfoFormValues } from '../formSchema';
import { ALLOW_TYPES } from '@/constants';
import { IPosDetail } from '@/pos-detail.tsx/types/IPos';
import { SelectBranch, SelectDepartment } from 'ui-modules';

interface EcommerceFormProps {
  form: UseFormReturn<BasicInfoFormValues>;
  posDetail?: IPosDetail;
  isReadOnly?: boolean;
}

export const EcommerceForm: React.FC<EcommerceFormProps> = ({
  form,
  posDetail,
  isReadOnly = false,
}) => {
  const isEditMode = !!posDetail;

  const handleBrandChange = (brandId: string) => {
    if (isReadOnly) return;

    const currentBrands = form.watch('scopeBrandIds') || [];
    const newBrands = currentBrands.includes(brandId)
      ? currentBrands.filter((id) => id !== brandId)
      : [...currentBrands, brandId];

    form.setValue('scopeBrandIds', newBrands);
  };

  const handleBranchChange = (branchId: string) => {
    if (isReadOnly) return;
    form.setValue('branchId', branchId);
  };

  const handleDepartmentChange = (departmentId: string) => {
    if (isReadOnly) return;
    form.setValue('departmentId', departmentId);
  };

  const getFormTitle = () => {
    if (isReadOnly) return 'View Ecommerce Details';
    return isEditMode ? 'Edit Ecommerce' : 'Create New Ecommerce';
  };

  return (
    <Form {...form}>
      <div className="p-3">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {getFormTitle()}
          </h2>
        </div>

        <div className="space-y-6">
          <Form.Field
            control={form.control}
            name="name"
            render={({ field }) => (
              <Form.Item>
                <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                  NAME <span className="text-red-500">*</span>
                </Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    placeholder="Write here"
                    className="border border-gray-300 h-10"
                    disabled={isReadOnly}
                    readOnly={isReadOnly}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                    DESCRIPTION <span className="text-red-500">*</span>
                  </Form.Label>
                  <p className="text-sm font-medium text-[#71717A]">
                    What is description ?
                  </p>
                  <Form.Control>
                    <Input
                      {...field}
                      className="border border-gray-300 h-10"
                      value={field.value || ''}
                      disabled={isReadOnly}
                      readOnly={isReadOnly}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="scopeBrandIds"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                    BRANDS
                  </Form.Label>
                  <p className="text-sm text-gray-500">
                    Which specific Brand does this integration belongs to?
                  </p>
                  <Form.Control>
                    <div className="border border-gray-300">
                      <Select
                        onValueChange={(value) => handleBrandChange(value)}
                        value={
                          field.value && field.value.length > 0
                            ? field.value.join(', ')
                            : ''
                        }
                        disabled={isReadOnly}
                      >
                        <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                          <Select.Value placeholder="Choose brands" />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="restaurant_brand1">
                            Restaurant Brand 1
                          </Select.Item>
                          <Select.Item value="restaurant_brand2">
                            Restaurant Brand 2
                          </Select.Item>
                          <Select.Item value="restaurant_brand3">
                            Restaurant Brand 3
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </div>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>

          <Form.Field
            control={form.control}
            name="allowTypes"
            render={({ field }) => (
              <Form.Item>
                <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                  TYPE <span className="text-red-500">*</span>
                </Form.Label>
                <p className="text-sm text-gray-500">How to use types?</p>
                <Form.Control>
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 6 }, (_, index) => {
                      const selectedTypes = field.value || [];
                      const currentValue = selectedTypes[index] || '';

                      return (
                        <div key={index} className="flex flex-col">
                          <Select
                            onValueChange={(value) => {
                              if (isReadOnly) return;
                              const newTypes = [...(field.value || [])];
                              if (value === 'NULL') {
                                newTypes.splice(index, 1);
                              } else {
                                newTypes[index] = value as
                                  | 'eat'
                                  | 'take'
                                  | 'delivery';
                              }
                              const cleanTypes = newTypes.filter(
                                (type, idx, arr) =>
                                  type && arr.indexOf(type) === idx,
                              );
                              form.setValue('allowTypes', cleanTypes);
                            }}
                            value={currentValue || 'NULL'}
                            disabled={isReadOnly}
                          >
                            <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                              <Select.Value
                                placeholder={`Select Type ${index + 1}`}
                              />
                            </Select.Trigger>
                            <Select.Content>
                              <Select.Item value="NULL">NULL</Select.Item>
                              {ALLOW_TYPES.map((type) => (
                                <Select.Item
                                  key={type.value}
                                  value={type.value}
                                >
                                  {type.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select>
                        </div>
                      );
                    })}
                  </div>
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <Form.Field
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                    CHOOSE BRANCH
                  </Form.Label>
                  <Form.Control>
                    <SelectBranch
                      value={field.value || ''}
                      onValueChange={(branchId) => {
                        if (!isReadOnly) {
                          handleBranchChange(branchId);
                        }
                      }}
                      className="w-full h-10"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                    CHOOSE DEPARTMENT
                  </Form.Label>
                  <Form.Control>
                    <SelectDepartment
                      value={field.value || ''}
                      onValueChange={(departmentId) => {
                        if (!isReadOnly) {
                          handleDepartmentChange(departmentId);
                        }
                      }}
                      className="w-full h-10 px-3 text-left justify-between"
                      disabled={isReadOnly}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};
