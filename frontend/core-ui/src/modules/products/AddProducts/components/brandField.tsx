import React from 'react';

import { SelectBrand } from '@/brands/components/SelectBrand';
interface BrandFieldProps {
  values: string[];
  onChange: (value: string[]) => void;
}

export const BrandField = ({ values, onChange }: BrandFieldProps) => {
  return (
    <div>
      <SelectBrand values={values} onValueChange={onChange}></SelectBrand>
    </div>
  );   
};
