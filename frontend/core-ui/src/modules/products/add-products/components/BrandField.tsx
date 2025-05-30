import { SelectBrand } from 'ui-modules';

interface BrandFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const BrandField = ({ value, onChange }: BrandFieldProps) => {
  return (
    <div>
      <SelectBrand value={value} onValueChange={onChange}></SelectBrand>
    </div>
  );
};
