import { SelectAccount } from '@/settings/account/components/SelectAccount';
import { cn, CurrencyField, Form, InlineCell, InlineCellDisplay, InlineCellEdit, InputNumber, Table } from 'erxes-ui';
import { useWatch } from 'react-hook-form';
import { SelectProduct } from 'ui-modules';
// import { InventoryRowCheckbox } from './InventoryRowCheckbox';
import { JournalEnum } from '@/settings/account/types/Account';
import { ITransactionGroupForm } from '../../../types/JournalForms';

export const InventoryRow = ({
  detailIndex,
  journalIndex,
  form,
}: {
  detailIndex: number;
  journalIndex: number;
  form: ITransactionGroupForm;
  // product: TInventoryProduct & { id: string };
}) => {
  // const { selectedProducts, form, inventoriesLength, journalIndex } =
  //   useInventoryContext();

  const details = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.details`,
  });

  const detail = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.details.${detailIndex}`,
  });
  const { unitPrice, count, amount, _id } = detail;

  const getName = (name: string) =>
    `trDocs.${journalIndex}.details.${detailIndex}.${name}`;

  const handleAmountChange = (
    value: number,
    onChange: (value: number) => void,
  ) => {
    if (unitPrice) {
      form.setValue(getName('count') as any, value / unitPrice);
    }
    if (count && !unitPrice) {
      form.setValue(getName('unitPrice') as any, value / count);
    }
    onChange(value);
  };

  const handlecountChange = (
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
    if (count) {
      form.setValue(getName('amount') as any, value * count);
    }
    onChange(value);
  };

  return (
    <Table.Row
      key={_id}
      // data-state={
      //   selectedProducts.includes(product.id) ? 'selected' : 'unselected'
      // }
      className="overflow-hidden h-cell"
    >
      <Table.Cell
        className={cn('overflow-hidden', {
          'rounded-tl-lg border-t': detailIndex === 0,
          'rounded-bl-lg': detailIndex === details.length - 1,
        })}
      >
        <div className="w-9 flex items-center justify-center">
          {/* <InventoryRowCheckbox productId={product.id} /> */}

        </div>
      </Table.Cell>

      <Table.Cell
        className={cn({
          'border-t': detailIndex === 0,
        })}
      >
        <Form.Field
          control={form.control}
          name={`trDocs.${journalIndex}.details.${detailIndex}.accountId`}
          render={({ field }) => (
            <Form.Item>
              <Form.Control>
                <SelectAccount
                  value={field.value || ''}
                  onValueChange={(accountId) => {
                    field.onChange(accountId);
                  }}
                  defaultFilter={{ journals: [JournalEnum.INVENTORY] }}
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
          'border-t': detailIndex === 0,
        })}
      >
        <Form.Field
          control={form.control}
          name={`trDocs.${journalIndex}.details.${detailIndex}.productId`}
          render={({ field }) => (
            <Form.Item>
              <Form.Control>
                <SelectProduct
                  value={field.value || ''}
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
      <Table.Cell
        className={cn({
          'border-t': detailIndex === 0,
        })}
      >
        <Form.Field
          control={form.control}
          name={`trDocs.${journalIndex}.details.${detailIndex}.count`}
          render={({ field }) => (
            <Form.Item>
              <Form.Control>
                <InputNumber
                  value={field.value ?? 0}
                  className='rounded-none focus-visible:relative focus-visible:z-10 shadow-none'
                  onChange={(value) =>
                    handlecountChange(value || 0, field.onChange)
                  }
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
      </Table.Cell>
      <Table.Cell
        className={cn({
          'border-t': detailIndex === 0,
        })}
      >
        <Form.Field
          control={form.control}
          name={`trDocs.${journalIndex}.details.${detailIndex}.unitPrice`}
          render={({ field }) => (
            <Form.Item>
              <Form.Control>
                <CurrencyField.ValueInput
                  value={field.value ?? 0}
                  className='rounded-none focus-visible:relative focus-visible:z-10 shadow-none'
                  onChange={(value) =>
                    handleUnitPriceChange(value || 0, field.onChange)
                  }
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
      </Table.Cell>
      <Table.Cell
        className={cn({
          'rounded-tr-lg border-t': detailIndex === 0,
          'rounded-br-lg': detailIndex === details.length - 1,
        })}
      >
        <Form.Field
          control={form.control}
          name={`trDocs.${journalIndex}.details.${detailIndex}.amount`}
          render={({ field }) => (
            <Form.Item>
              <Form.Control>
                <CurrencyField.ValueInput
                  value={field.value ?? 0}
                  className='rounded-none focus-visible:relative focus-visible:z-10 shadow-none'
                  onChange={(value) =>
                    handleAmountChange(value || 0, field.onChange)
                  }
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
      </Table.Cell>
    </Table.Row>
    // </InventoryRowContext.Provider>
  );
};
