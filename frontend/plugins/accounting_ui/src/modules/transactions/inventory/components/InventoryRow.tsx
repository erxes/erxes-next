import { TInventoryProduct } from '../../transactionForm/types/AddTransaction';
import { Table, cn, Form } from 'erxes-ui';
import { SelectAccount } from '@/settings/account/components/SelectAccount';
import { SelectProduct } from 'ui-modules';
import { InventoryRowContext } from '../context/InventoryContext';
import { InventoryRowNumbers } from './InventoryRowNumbers';
import { InventoryRowCheckbox } from './InventoryRowCheckbox';
import { useInventoryContext } from '../hooks/useInventoryContext';

export const InventoryRow = ({
  productIndex,
  product,
}: {
  productIndex: number;
  product: TInventoryProduct & { id: string };
}) => {
  const { selectedProducts, form, journal, inventoriesLength, journalIndex } =
    useInventoryContext();

  return (
    <InventoryRowContext.Provider
      value={{
        productIndex,
        product,
      }}
    >
      <Table.Row
        key={product.id}
        data-state={
          selectedProducts.includes(product.id) ? 'selected' : 'unselected'
        }
        className="overflow-hidden h-cell"
      >
        <Table.Cell
          className={cn('overflow-hidden', {
            'rounded-tl-lg border-t': productIndex === 0,
            'rounded-bl-lg': productIndex === inventoriesLength - 1,
          })}
        >
          <div className="w-9 flex items-center justify-center">
            <InventoryRowCheckbox productId={product.id} />
          </div>
        </Table.Cell>

        <Table.Cell
          className={cn({
            'border-t': productIndex === 0,
          })}
        >
          <Form.Field
            control={form.control}
            name={`details.${journalIndex}.products.${productIndex}.accountId`}
            render={({ field }) => (
              <Form.Item>
                <Form.Control>
                  <SelectAccount
                    value={field.value}
                    onValueChange={(accountId) => {
                      field.onChange(accountId);
                    }}
                    journal={journal}
                    className="rounded-none focus-visible:relative focus-visible:z-10"
                    variant="ghost"
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </Table.Cell>
        <Table.Cell
          className={cn({
            'border-t': productIndex === 0,
          })}
        >
          <Form.Field
            control={form.control}
            name={`details.${journalIndex}.products.${productIndex}.productId`}
            render={({ field }) => (
              <Form.Item>
                <Form.Control>
                  <SelectProduct
                    value={field.value}
                    onValueChange={(productId) => {
                      field.onChange(productId);
                    }}
                    className="rounded-none focus-visible:relative focus-visible:z-10"
                    variant="ghost"
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </Table.Cell>
        <InventoryRowNumbers />
      </Table.Row>
    </InventoryRowContext.Provider>
  );
};
