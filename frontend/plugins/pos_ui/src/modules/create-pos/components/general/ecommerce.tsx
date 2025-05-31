"use client"

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, Input, Select } from "erxes-ui";
import { BasicInfoFormValues } from '../formSchema';
import { ALLOW_TYPES } from '~/modules/constants';
import { Branch, Department } from '../../types';
import { PosDetailQueryResponse } from '~/modules/pos-detail.tsx/types/detail';

type AllowedType = "eat" | "take" | "delivery" | "loss" | "spend" | "reject";

interface EcommerceFormProps {
  form: UseFormReturn<BasicInfoFormValues>;
  posDetail?: PosDetailQueryResponse['posDetail'];
  isReadOnly?: boolean;
  branches?: Branch[]; 
  departments?: Department[]; 
}

export const EcommerceForm: React.FC<EcommerceFormProps> = ({ 
  form, 
  posDetail,
  isReadOnly = false,
  branches = [], 
  departments = []
}) => {
  const isEditMode = !!posDetail;
  const defaultBranches: Branch[] = [
    { id: "branch1", name: "Main Branch" },
    { id: "branch2", name: "Downtown Branch" },
    { id: "branch3", name: "Mall Branch" },
  ];

  const defaultDepartments: Department[] = [
    { id: "kitchen", name: "Kitchen" },
    { id: "bar", name: "Bar" },
    { id: "service", name: "Service" },
  ];

  const availableBranches = branches.length > 0 ? branches : defaultBranches;
  const availableDepartments = departments.length > 0 ? departments : defaultDepartments;

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

  const handleDepartmentChange = (departmentId: string) => {
    if (isReadOnly) return;
    // form.setValue('departmentId', departmentId);
  };

  const getFormTitle = () => {
    if (isReadOnly) return 'View Ecommerce Details';
    return isEditMode ? 'Edit Ecommerce' : 'Create New Ecommerce';
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
                      const currentValue = selectedTypes[index] || "";
                      
                      return (
                        <div key={index} className="flex flex-col">
                          <Select 
                            onValueChange={(value) => {
                              if (isReadOnly) return;
                              const newTypes = [...(field.value || [])];
                              if (value === "NULL") {
                                newTypes.splice(index, 1);
                              } else {
                                newTypes[index] = value as "eat" | "take" | "delivery";
                              }
                              const cleanTypes = newTypes.filter((type, idx, arr) => 
                                type && arr.indexOf(type) === idx
                              );
                              form.setValue('allowTypes', cleanTypes);
                            }}
                            value={currentValue || "NULL"}
                            disabled={isReadOnly}
                          >
                            <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                              <Select.Value placeholder={`Select Type ${index + 1}`} />
                            </Select.Trigger>
                            <Select.Content>
                              <Select.Item value="NULL">NULL</Select.Item>
                              {ALLOW_TYPES.map((type) => (
                                <Select.Item key={type.value} value={type.value}>
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
                        {availableBranches.map((branch) => (
                          <Select.Item key={branch.id} value={branch.id}>
                            {branch.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            {/* <Form.Field
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-sm text-[#A1A1AA] uppercase font-semibold">
                    CHOOSE DEPARTMENT
                  </Form.Label>
                  <Form.Control>
                    <Select 
                      onValueChange={(value) => handleDepartmentChange(value)}
                      value={field.value || ""}
                      disabled={isReadOnly}
                    >
                      <Select.Trigger className="w-full h-10 px-3 text-left justify-between">
                        <Select.Value placeholder="Choose department" />
                      </Select.Trigger>
                      <Select.Content>
                        {availableDepartments.map((department) => (
                          <Select.Item key={department.id} value={department.id}>
                            {department.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            /> */}
          </div>
        </div>
      </div>
    </Form>
  );
};