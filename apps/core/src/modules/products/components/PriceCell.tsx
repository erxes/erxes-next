import { CellContext } from '@tanstack/react-table';
import { useState } from 'react';
import { CurrencyDisplay } from 'erxes-ui/display';
import { CurrencyCode } from 'erxes-ui/types';
import { Button, Input, Popover } from 'erxes-ui/components';
import { ProductT } from '@/products/types/productTypes';
import { useProductsEdit } from '@/products/hooks/useProductsEdit';

export const PriceCell = (info: CellContext<ProductT, any>) => {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [value, setValue] = useState(info.getValue());
  const { handleProductsEdit } = useProductsEdit();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleProductsEdit({
      _id: info.row.original._id,
      unitPrice: +value,
    });
    setIsInEditMode(false);
  };

  return (
    <div
      className="h-full flex items-start"
      onBlur={() => setIsInEditMode(false)}
    >
      {isInEditMode ? (
        <Popover open={isInEditMode} onOpenChange={setIsInEditMode} modal>
          <Popover.Trigger className="w-full h-px" />

          <Popover.Content
            className="bg-background shadow-command-bar w-auto p-0"
            style={{ minWidth: 'var(--radix-popper-anchor-width)' }}
            sideOffset={-2}
          >
            <form onSubmit={handleSubmit}>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-8"
              />
            </form>
          </Popover.Content>
        </Popover>
      ) : (
        <Button
          variant="ghost"
          className="h-full w-full rounded-none"
          onClick={() => setIsInEditMode(true)}
        >
          <CurrencyDisplay
            currencyValue={{
              currencyCode: CurrencyCode.MNT,
              amountMicros: value * 1000000,
            }}
          />
        </Button>
      )}
    </div>
  );
};
