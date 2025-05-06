import { Checkbox, Table } from 'erxes-ui';
import { useInventoryContext } from '../hooks/useInventoryContext';

export const InventoryRowCheckbox = ({ productId }: { productId: string }) => {
  const { selectedProducts, setSelectedProducts } = useInventoryContext();

  return (
    <Checkbox
      checked={selectedProducts.includes(productId)}
      onCheckedChange={(checked) => {
        setSelectedProducts(
          checked
            ? [...selectedProducts, productId]
            : selectedProducts.filter(
                (selectedId: string) => selectedId !== productId,
              ),
        );
      }}
    />
  );
};

export const InventoryHeaderCheckbox = () => {
  const { selectedProducts, setSelectedProducts, fields } =
    useInventoryContext();

  return (
    <Table.Head className="w-9">
      <div className="flex items-center justify-center">
        <Checkbox
          checked={selectedProducts.length === fields.length}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedProducts(fields.map((product) => product.id));
            } else {
              setSelectedProducts([]);
            }
          }}
        />
      </div>
    </Table.Head>
  );
};
