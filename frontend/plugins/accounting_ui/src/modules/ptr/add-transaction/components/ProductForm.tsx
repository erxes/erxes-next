import {
  Button,
  cn,
  InlineCell,
  InlineCellDisplay,
  InlineCellEdit,
  Table,
  Form,
} from 'erxes-ui';
import { ITransactionGroupForm } from '../types/AddTransaction';
import { useFieldArray } from 'react-hook-form';
import { IconPlus } from '@tabler/icons-react';
import { SelectProduct } from 'ui-modules';

export const ProductForm = ({
  form,
  index,
}: {
  form: ITransactionGroupForm;
  index: number;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `details.${index}.products`,
  });

  return (
    <Table className="mt-8 p-1 overflow-hidden rounded-lg bg-sidebar border-sidebar">
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-1/4">Product</Table.Head>
          <Table.Head className="w-1/4">Quantity</Table.Head>
          <Table.Head className="w-1/4">Unit Price</Table.Head>
          <Table.Head className="w-1/4">Total</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body className="overflow-hidden">
        {fields.map((field, index) => (
          <Table.Row key={field.id} className="overflow-hidden h-cell">
            <Table.Cell
              className={cn('w-1/4 overflow-hidden', {
                'rounded-tl-lg border-t': index === 0,
                'rounded-bl-lg': index === fields.length - 1,
              })}
            >
              <Form.Field
                control={form.control}
                name={`details.${index}.products.${index}.productId`}
                render={({ field }) => (
                  <SelectProduct
                    value={field.value}
                    onValueChange={(productId) => {
                      field.onChange(productId);
                    }}
                  />
                )}
              />
            </Table.Cell>
            <Table.Cell
              className={cn('w-1/4', {
                'border-t': index === 0,
              })}
            >
              <InlineCell
                name="quantity"
                recordId={field.id}
                display={() => (
                  <InlineCellDisplay>{field.quantity}</InlineCellDisplay>
                )}
                edit={() => <InlineCellEdit>hi</InlineCellEdit>}
              />
            </Table.Cell>
            <Table.Cell
              className={cn('w-1/4', {
                'border-t': index === 0,
              })}
            >
              <InlineCell
                name="unitPrice"
                recordId={field.id}
                display={() => (
                  <InlineCellDisplay>{field.unitPrice}</InlineCellDisplay>
                )}
              />
            </Table.Cell>
            <Table.Cell
              className={cn('w-1/4', {
                'rounded-tr-lg border-t': index === 0,
                'rounded-br-lg': index === fields.length - 1,
              })}
            >
              <InlineCell
                name="total"
                recordId={field.id}
                display={() => (
                  <InlineCellDisplay>
                    {field.unitPrice * field.quantity}
                  </InlineCellDisplay>
                )}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <tr>
          <td colSpan={4} className="p-4">
            <div className="flex w-full justify-center gap-4">
              <Button
                variant="secondary"
                className="bg-border"
                onClick={() =>
                  append({
                    amount: 0,
                    accountId: '',
                    productId: '',
                    quantity: 0,
                    unitPrice: 0,
                  })
                }
              >
                <IconPlus />
                Add Product
              </Button>
              <Button
                variant="secondary"
                className="bg-border"
                onClick={() =>
                  append({
                    amount: 0,
                    accountId: '',
                    productId: '',
                    quantity: 0,
                    unitPrice: 0,
                  })
                }
              >
                <IconPlus />
                Add Multiple Products
              </Button>
            </div>
          </td>
        </tr>
      </Table.Footer>
    </Table>
  );
};
