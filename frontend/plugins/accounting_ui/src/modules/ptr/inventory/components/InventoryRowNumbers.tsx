import {
  Table,
  cn,
  Form,
  InlineCellDisplay,
  InlineCell,
  InputNumber,
  CurrencyField,
  InlineCellEdit,
} from 'erxes-ui';
import { useWatch } from 'react-hook-form';
import {
  useInventoryContext,
  useInventoryRowContext,
} from '../hooks/useInventoryContext';

export const InventoryRowNumbers = () => {
  const { form, journalIndex, inventoriesLength } = useInventoryContext();
  const { productIndex, product } = useInventoryRowContext();

  const { control } = form;
  const { unitPrice, quantity, amount } = useWatch({
    control,
    name: `details.${journalIndex}.products.${productIndex}`,
  });
  const getName = (name: string) =>
    `details.${journalIndex}.products.${productIndex}.${name}`;

  const handleAmountChange = (
    value: number,
    onChange: (value: number) => void,
  ) => {
    if (unitPrice) {
      form.setValue(getName('quantity') as any, value / unitPrice);
    }
    if (quantity && !unitPrice) {
      form.setValue(getName('unitPrice') as any, value / quantity);
    }
    onChange(value);
  };

  const handleQuantityChange = (
    value: number,
    onChange: (value: number) => void,
  ) => {
    if (unitPrice) {
      form.setValue(getName('amount') as any, value * unitPrice);
    }
    onChange(value);
  };

  const handleUnitPriceChange = (
    value: number,
    onChange: (value: number) => void,
  ) => {
    if (quantity) {
      form.setValue(getName('amount') as any, value * quantity);
    }
    onChange(value);
  };

  return (
    <>
      <Table.Cell
        className={cn({
          'border-t': productIndex === 0,
        })}
      >
        <Form.Field
          control={form.control}
          name={`details.${journalIndex}.products.${productIndex}.quantity`}
          render={({ field }) => (
            <Form.Item>
              <InlineCell
                name="quantity"
                recordId={product.id}
                display={() => (
                  <InlineCellDisplay>{field.value}</InlineCellDisplay>
                )}
                edit={() => (
                  <InlineCellEdit>
                    <Form.Control>
                      <InputNumber
                        value={field.value}
                        onChange={(value) =>
                          handleQuantityChange(value || 0, field.onChange)
                        }
                      />
                    </Form.Control>
                  </InlineCellEdit>
                )}
              />
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
          name={`details.${journalIndex}.products.${productIndex}.unitPrice`}
          render={({ field }) => (
            <Form.Item>
              <InlineCell
                name="unitPrice"
                recordId={product.id}
                display={() => (
                  <InlineCellDisplay>
                    {field.value?.toLocaleString() || '0'}
                  </InlineCellDisplay>
                )}
                edit={() => (
                  <InlineCellEdit>
                    <Form.Control>
                      <CurrencyField.ValueInput
                        value={field.value}
                        onChange={(value) =>
                          handleUnitPriceChange(value || 0, field.onChange)
                        }
                      />
                    </Form.Control>
                  </InlineCellEdit>
                )}
              />
              <Form.Message />
            </Form.Item>
          )}
        />
      </Table.Cell>
      <Table.Cell
        className={cn({
          'rounded-tr-lg border-t': productIndex === 0,
          'rounded-br-lg': productIndex === inventoriesLength - 1,
        })}
      >
        <Form.Field
          control={form.control}
          name={`details.${journalIndex}.products.${productIndex}.amount`}
          render={({ field }) => (
            <Form.Item>
              <InlineCell
                name="total"
                recordId={product.id}
                display={() => (
                  <InlineCellDisplay>
                    {amount?.toLocaleString() || '0'}
                  </InlineCellDisplay>
                )}
                edit={() => (
                  <InlineCellEdit>
                    <CurrencyField.ValueInput
                      value={field.value}
                      onChange={(value) =>
                        handleAmountChange(value || 0, field.onChange)
                      }
                    />
                  </InlineCellEdit>
                )}
              />
              <Form.Message />
            </Form.Item>
          )}
        />
      </Table.Cell>
    </>
  );
};
