"use client"

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, Input, Select } from "erxes-ui";
import { ALLOW_TYPES } from "~/modules/constants";
import { BasicInfoFormValues } from '../formSchema';

interface EcommerceFormProps {
  form: UseFormReturn<BasicInfoFormValues>;
}

export const EcommerceForm: React.FC<EcommerceFormProps> = ({ form }) => {
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
                          <Select.Item value="brand1">Brand 1</Select.Item>
                          <Select.Item value="brand2">Brand 2</Select.Item>
                          <Select.Item value="brand3">Brand 3</Select.Item>
                        </Select.Content>
                      </Select>
                    </div>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
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
                        <Select.Item value="branch1">Branch 1</Select.Item>
                        <Select.Item value="branch2">Branch 2</Select.Item>
                        <Select.Item value="branch3">Branch 3</Select.Item>
                      </Select.Content>
                    </Select>
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