import { IconX } from '@tabler/icons-react';
import { Button } from 'erxes-ui';

export const RemoveButton = ({
  remove,
  fields,
}: {
  remove: (index: number | number[]) => void;
  fields: Array<{ id: string }>;
}) => {
  // const { selectedProducts, setSelectedProducts } = useInventoryContext();

  // if (selectedProducts.length === 0) return null;

  const handleRemove = () => {
    //   remove(
    //     selectedProducts.map((id) =>
    //       fields.findIndex((product) => product.id === id),
    //     ),
    //   );
    //   setSelectedProducts([]);
  };

  return (
    <Button
      variant="secondary"
      className="bg-destructive/10 text-destructive"
      onClick={handleRemove}
    >
      <IconX />
      Remove Selected
    </Button>
  );
};
