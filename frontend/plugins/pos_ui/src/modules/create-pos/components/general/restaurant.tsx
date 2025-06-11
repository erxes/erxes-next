'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IconPlus } from '@tabler/icons-react';
import { Button, Form, Input, Label, Select } from 'erxes-ui';
import { useSearchParams } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { slotAtom } from '../../states/posCategory';
import { BasicInfoFormValues } from '../formSchema';
import { ALLOW_TYPES } from '~/modules/constants';
import { IPosDetail } from '~/modules/pos-detail/types/IPos';
import { SelectBranch, SelectDepartment , SelectBrand } from 'ui-modules';

interface RestaurantFormProps {
  form: UseFormReturn<BasicInfoFormValues>;
  posDetail?: IPosDetail;
  isReadOnly?: boolean;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({
  form,
  posDetail,
  isReadOnly = false,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setSlot = useSetAtom(slotAtom);
  const isEditMode = !!posDetail;

  const handleAddSlot = () => {
    if (isReadOnly) return;
    setSlot(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'slot');
    setSearchParams(newParams);
  };

  const handleTypeChange = (typeValue: string) => {
    if (isReadOnly) return;

    const currentTypes = (form.watch('allowTypes') || []) as string[];
    const newTypes: string[] = currentTypes.includes(typeValue)
      ? currentTypes.filter((t: string) => t !== typeValue)
      : [...currentTypes, typeValue];

    form.setValue('allowTypes', newTypes as any);
  };

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

  const selectedBrandId = form.watch('scopeBrandIds')?.[0] || '';

  const getFormTitle = () => {
    if (isReadOnly) return 'View Restaurant Details';
    return isEditMode ? 'Edit Restaurant' : 'Create New Restaurant';
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
                    <SelectBrand
                      value={selectedBrandId}
                      onValueChange={handleBrandChange}
                      className="w-full h-10 border border-gray-300"
                      disabled={isReadOnly}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                SLOTS
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="ml-2 h-6 w-6 p-0 bg-indigo-500 hover:bg-indigo-600"
                onClick={handleAddSlot}
                disabled={isReadOnly}
              >
                <IconPlus size={16} className="text-white" />
                <span className="sr-only">Add slot</span>
              </Button>
            </div>
          </div>

          <Form.Field
            control={form.control}
            name="allowTypes"
            render={({ field }) => (
              <Form.Item>
                <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                  TYPE <span className="text-red-500">*</span>
                </Form.Label>
                <p className="text-sm text-gray-500">How use types ?</p>
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
