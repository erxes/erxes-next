import { IconPlus } from '@tabler/icons-react';

import { useWatch } from 'react-hook-form';
import { TInventoryProduct } from '../../transaction-form/types/AddTransaction';

import { Button } from 'erxes-ui/components/button';
import { useInventoryContext } from '../hooks/useInventoryContext';

export const AddInventoryRowButton = ({
  append,
}: {
  append: (product: TInventoryProduct | TInventoryProduct[]) => void;
}) => {
  const { inventoriesLength, journalIndex, form } = useInventoryContext();
  const { control } = form;

  const lastProduct = useWatch({
    control,
    name: `details.${journalIndex}.products.${inventoriesLength - 1}`,
  });

  const productDefaultValues = {
    amount: 0,
    accountId: lastProduct?.accountId || '',
    productId: '',
    quantity: 0,
    unitPrice: 0,
  };

  return (
    <>
      <Button
        variant="secondary"
        className="bg-border"
        onClick={() => append(productDefaultValues)}
      >
        <IconPlus />
        Add Product
      </Button>
      <Button
        variant="secondary"
        className="bg-border"
        onClick={() =>
          append([
            productDefaultValues,
            productDefaultValues,
            productDefaultValues,
          ])
        }
      >
        <IconPlus />
        Add Multiple Products
      </Button>
    </>
  );
};
