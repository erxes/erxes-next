"use client"

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IconPlus } from "@tabler/icons-react";
import { Button, Form, Input, Label, Select } from "erxes-ui";
import { useSearchParams } from "react-router-dom";
import { useSetAtom } from "jotai";
import { slotAtom } from "../../states/posCategory";
import { ALLOW_TYPES } from "~/modules/constants";
import { BasicInfoFormValues } from '../formSchema';

interface RestaurantFormProps {
  form: UseFormReturn<BasicInfoFormValues>;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({ form }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setSlot = useSetAtom(slotAtom);

  const handleAddSlot = () => {
    setSlot(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", "slot");
    setSearchParams(newParams);
  };

  const handleTypeToggle = (typeValue: string) => {
    const currentTypes = form.watch('allowTypes') || [];
    const newTypes = currentTypes.includes(typeValue)
      ? currentTypes.filter(t => t !== typeValue)
      : [...currentTypes, typeValue];
    
    form.setValue('allowTypes', newTypes);
  };

  const handleBrandChange = (brandId: string) => {
    const currentBrands = form.watch('scopeBrandIds') || [];
    const newBrands = currentBrands.includes(brandId)
      ? currentBrands.filter(id => id !== brandId)
      : [...currentBrands, brandId];
    
    form.setValue('scopeBrandIds', newBrands);
  };

  const handleBranchChange = (branchId: string) => {
    const currentBranches = form.watch('allowBranchIds') || [];
    const newBranches = currentBranches.includes(branchId)
      ? currentBranches.filter(id => id !== branchId)
      : [...currentBranches, branchId];
    
    form.setValue('allowBranchIds', newBranches);
  };

  return (
    <Form {...form}>
      <div className="p-3">
        <div className="space-y-6">
          {/* Name Field */}
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
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            {/* Description Field */}
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
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            {/* Brands Field */}
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

          {/* Slots Section */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">SLOTS</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="ml-2 h-6 w-6 p-0 bg-indigo-500 hover:bg-indigo-600"
                onClick={handleAddSlot}
              >
                <IconPlus size={16} className="text-white" />
                <span className="sr-only">Add slot</span>
              </Button>
            </div>
            <p className="text-sm text-gray-500">Configure time slots for restaurant operations</p>
          </div>

          {/* Allow Types Field */}
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
                  <div className="grid grid-cols-3 gap-2">
                    {ALLOW_TYPES.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={type.value}
                          checked={(field.value || []).includes(type.value)}
                          onChange={() => handleTypeToggle(type.value)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label 
                          htmlFor={type.value}
                          className="text-sm text-gray-700"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            {/* Branches Field */}
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

            {/* Additional Branch/Department Field */}
            <div className="space-y-1">
              <Label className="text-sm text-[#A1A1AA] uppercase font-semibold">CHOOSE DEPARTMENT</Label>
              <Select>
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