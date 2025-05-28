"use client"

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IconPlus } from "@tabler/icons-react";
import { Button, Form, Input, Label, Select } from "erxes-ui";
import { useSearchParams } from "react-router-dom";
import { useSetAtom } from "jotai";
import { slotAtom } from "../../states/posCategory";
import { BasicInfoFormValues } from '../formSchema';
import { ALLOW_TYPES } from '~/modules/constants';

type AllowedType = "eat" | "take" | "delivery" | "loss" | "spend" | "reject";

interface RestaurantFormProps {
  form: UseFormReturn<BasicInfoFormValues>;
  posDetail?: any;
  isReadOnly?: boolean;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({ 
  form, 
  posDetail,
  isReadOnly = false 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setSlot = useSetAtom(slotAtom);
  const isEditMode = !!posDetail;

  const handleAddSlot = () => {
    if (isReadOnly) return;
    setSlot(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", "slot");
    setSearchParams(newParams);
  };

  const handleTypeChange = (typeValue: AllowedType) => {
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
      ? currentBrands.filter(id => id !== brandId)
      : [...currentBrands, brandId];
    
    form.setValue('scopeBrandIds', newBrands);
  };

  const handleBranchChange = (branchId: string) => {
    if (isReadOnly) return;
    
    const currentBranches = form.watch('allowBranchIds') || [];
    const newBranches = currentBranches.includes(branchId)
      ? currentBranches.filter(id => id !== branchId)
      : [...currentBranches, branchId];
    
    form.setValue('allowBranchIds', newBranches);
  };

  const getFormTitle = () => {
    if (isReadOnly) return 'View Restaurant Details';
    return isEditMode ? 'Edit Restaurant' : 'Create New Restaurant';
  };

  return (
    <Form {...form}>
      <div className="p-3">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{getFormTitle()}</h2>
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
                  <p className="text-sm font-medium text-[#71717A]">What is description ?</p>
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
                  <p className="text-sm text-gray-500">Which specific Brand does this integration belongs to?</p>
                  <Form.Control>
                    <div className="border border-gray-300">
                      <Select 
                        onValueChange={(value) => handleBrandChange(value)}
                        value={field.value?.[0] || ""}
                        disabled={isReadOnly}
                      >
                        <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                          <Select.Value placeholder="Choose brands" />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="restaurant_brand1">Restaurant Brand 1</Select.Item>
                          <Select.Item value="restaurant_brand2">Restaurant Brand 2</Select.Item>
                          <Select.Item value="restaurant_brand3">Restaurant Brand 3</Select.Item>
                        </Select.Content>
                      </Select>
                    </div>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">SLOTS</Label>
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
                    {Array.from({ length: 6 }, (_, index) => (
                      <div key={index} className="flex flex-col">
                        <Select 
                          onValueChange={(value) => {
                            handleTypeChange(value as AllowedType);
                          }}
                          value=""
                          disabled={isReadOnly}
                        >
                          <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                            <Select.Value placeholder={`Select Type ${index + 1}`} />
                          </Select.Trigger>
                          <Select.Content>
                            {ALLOW_TYPES.map((type) => (
                              <Select.Item key={type.value} value={type.value}>
                                {type.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </div>
                    ))}
                  </div>
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <Form.Field
              control={form.control}
              name="allowBranchIds"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                    CHOOSE BRANCH
                  </Form.Label>
                  <Form.Control>
                    <Select 
                      onValueChange={(value) => handleBranchChange(value)}
                      value={field.value?.[0] || ""}
                      disabled={isReadOnly}
                    >
                      <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                        <Select.Value placeholder="Choose branch" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="breakfast">Breakfast</Select.Item>
                        <Select.Item value="lunch">Lunch</Select.Item>
                        <Select.Item value="dinner">Dinner</Select.Item>
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <div className="space-y-1">
              <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">CHOOSE DEPARTMENT</Label>
              <Select disabled={isReadOnly}>
                <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                  <Select.Value placeholder="Choose department" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="kitchen">Kitchen</Select.Item>
                  <Select.Item value="bar">Bar</Select.Item>
                  <Select.Item value="service">Service</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};