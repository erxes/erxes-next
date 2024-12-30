import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';
import { ProductTypeIcon } from '@/products/components/ProductTypeIcon';
import { Button, Select } from 'erxes-ui';
import { useState } from 'react';
import { useProductsEdit } from '@/products/hooks/useProductsEdit';
import { PRODUCT_TYPE_OPTIONS } from '@/products/constants/ProductConstants';

export function ProductTypeCell(info: CellContext<ProductT, any>) {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [value, setValue] = useState(info.getValue());
  const { handleProductsEdit } = useProductsEdit();

  const handleValueChange = (value: string) => {
    setValue(value);
    handleProductsEdit({
      _id: info.row.original._id,
      type: value as ProductT['type'],
    });
    setIsInEditMode(false);
  };

  return (
    <div className="h-full flex items-start">
      {isInEditMode ? (
        <Select
          value={value}
          onValueChange={handleValueChange}
          open={isInEditMode}
          onOpenChange={setIsInEditMode}
        >
          <Select.Trigger className="h-8 text-xs">
            <Select.Value placeholder="Select type" />
          </Select.Trigger>
          <Select.Content>
            {PRODUCT_TYPE_OPTIONS.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                <span className="flex items-center gap-1 h-full text-xs">
                  <ProductTypeIcon
                    type={option.value as ProductT['type']}
                    className="w-4 h-4"
                  />
                  {option.label}
                </span>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="h-full w-full rounded-none justify-start"
          onClick={() => setIsInEditMode(true)}
        >
          <ProductTypeIcon type={value} />
          {value}
        </Button>
      )}
    </div>
  );
}
