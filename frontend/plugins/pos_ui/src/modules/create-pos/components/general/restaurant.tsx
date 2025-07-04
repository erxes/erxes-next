'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IconPlus } from '@tabler/icons-react';
import { Button, Form, Input, Label, Select } from 'erxes-ui';
import { useSearchParams } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { slotAtom } from '../../states/posCategory';
import { BasicInfoFormValues } from '../formSchema';
import { ALLOW_TYPES } from '@/constants';
import { IPosDetail } from '@/pos-detail/types/IPos';
import { SelectBranches, SelectBrand, SelectDepartments } from 'ui-modules';

interface RestaurantFormProps {
  form: UseFormReturn<BasicInfoFormValues>;
  posDetail?: IPosDetail;
  isReadOnly?: boolean;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({
  form,
  isReadOnly = false,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setSlot = useSetAtom(slotAtom);

  const handleAddSlot = () => {
    if (isReadOnly) return;
    setSlot(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'slot');
    setSearchParams(newParams);
  };

  const handleBrandChange = (brandId: string | string[]) => {
    if (isReadOnly) return;
    const singleBrandId = Array.isArray(brandId) ? brandId[0] : brandId;
    form.setValue('scopeBrandIds', singleBrandId ? [singleBrandId] : []);
  };

  const handleBranchChange = (branchId: string | string[] | undefined) => {
    if (isReadOnly) return;
    const singleBranchId = Array.isArray(branchId) ? branchId[0] : branchId;
    form.setValue('branchId', singleBranchId || '');
    form.trigger('branchId');
  };

  const handleDepartmentChange = (
    departmentId: string | string[] | undefined,
  ) => {
    if (isReadOnly) return;
    const singleDepartmentId = Array.isArray(departmentId)
      ? departmentId[0]
      : departmentId;
    form.setValue('departmentId', singleDepartmentId || '');
    form.trigger('departmentId');
  };

  const selectedBrandId = form.watch('scopeBrandIds')?.[0] || '';

  return (
    <Form {...form}>
      <div className="p-3">
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
                    <SelectBranches.FormItem
                      value={field.value}
                      onValueChange={handleBranchChange}
                      className="w-full h-10"
                      mode="single"
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
                    <SelectDepartments.FormItem
                      value={field.value}
                      onValueChange={handleDepartmentChange}
                      className="w-full h-10"
                      mode="single"
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
