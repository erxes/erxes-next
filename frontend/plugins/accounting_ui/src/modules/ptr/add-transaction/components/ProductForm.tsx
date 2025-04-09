import {
  Button,
  cn,
  InlineCell,
  InlineCellDisplay,
  InlineCellEdit,
  Table,
  Form,
  InputNumber,
  Checkbox,
  CurrencyValueInput,
} from 'erxes-ui';
import {
  ITransactionGroupForm,
  TInventoryProduct,
} from '../types/AddTransaction';
import { useFieldArray, useWatch } from 'react-hook-form';
import { IconPlus, IconX } from '@tabler/icons-react';
import { SelectProduct } from 'ui-modules';
import { useState } from 'react';
import { SelectAccount } from '@/account/components/SelectAccount';
import { JournalEnum } from '@/account/type/Account';

export const ProductForm = ({
  form,
  index,
  journal,
}: {
  form: ITransactionGroupForm;
  index: number;
  journal: JournalEnum;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `details.${index}.products`,
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  return (
    <Form.Field
      control={form.control}
      name={`details.${index}.products`}
      render={() => (
        <Form.Item>
          <Table className="mt-8 p-1 overflow-hidden rounded-lg bg-sidebar border-sidebar">
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-9">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedProducts.length === fields.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts(
                            fields.map((product) => product.id),
                          );
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                    />
                  </div>
                </Table.Head>
                <Table.Head>Account</Table.Head>
                <Table.Head>Inventory</Table.Head>
                <Table.Head>Quantity</Table.Head>
                <Table.Head>Unit Price</Table.Head>
                <Table.Head>Amount</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body className="overflow-hidden">
              {fields.map((product, index) => (
                <InventoryProductForm
                  form={form}
                  index={index}
                  product={product}
                  selected={selectedProducts.includes(product.id)}
                  key={product.id}
                  journal={journal}
                  fieldsLength={fields.length}
                >
                  <Table.Cell
                    className={cn('overflow-hidden', {
                      'rounded-tl-lg border-t': index === 0,
                      'rounded-bl-lg': index === fields.length - 1,
                    })}
                  >
                    <div className="w-9 flex items-center justify-center">
                      <ProductCheckbox
                        id={product.id}
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                      />
                    </div>
                  </Table.Cell>
                </InventoryProductForm>
              ))}
            </Table.Body>
            <Table.Footer>
              <tr>
                <td colSpan={6} className="p-4">
                  <div className="flex w-full justify-center gap-4">
                    <AddProductButton
                      form={form}
                      index={index}
                      append={append}
                      fieldsLength={fields.length}
                    />
                    <RemoveSelectedButton
                      selectedProducts={selectedProducts}
                      remove={remove}
                      fields={fields}
                      setSelectedProducts={setSelectedProducts}
                    />
                  </div>
                </td>
              </tr>
            </Table.Footer>
          </Table>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const ProductCheckbox = ({
  id,
  selectedProducts,
  setSelectedProducts,
}: {
  id: string;
  selectedProducts: string[];
  setSelectedProducts: (selectedProducts: string[]) => void;
}) => (
  <Checkbox
    checked={selectedProducts.includes(id)}
    onCheckedChange={(checked) => {
      setSelectedProducts(
        checked
          ? [...selectedProducts, id]
          : selectedProducts.filter((selectedId) => selectedId !== id),
      );
    }}
  />
);

export const InventoryProductCompute = ({
  index,
  form,
  product,
  fieldsLength,
}: {
  index: number;
  form: ITransactionGroupForm;
  product: TInventoryProduct & { id: string };
  fieldsLength: number;
}) => {
  const { control } = form;
  const { unitPrice, quantity, amount } = useWatch({
    control,
    name: `details.${index}.products.${index}`,
  });

  const getName = (name: string) =>
    `details.${index}.products.${index}.${name}`;

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
          'border-t': index === 0,
        })}
      >
        <Form.Field
          control={form.control}
          name={`details.${index}.products.${index}.quantity`}
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
          'border-t': index === 0,
        })}
      >
        <Form.Field
          control={form.control}
          name={`details.${index}.products.${index}.unitPrice`}
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
                      <CurrencyValueInput
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
          'rounded-tr-lg border-t': index === 0,
          'rounded-br-lg': index === fieldsLength - 1,
        })}
      >
        <Form.Field
          control={form.control}
          name={`details.${index}.products.${index}.amount`}
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
                    <CurrencyValueInput
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

export const InventoryProductForm = ({
  form,
  index,
  children,
  product,
  selected,
  journal,
  fieldsLength,
}: {
  form: ITransactionGroupForm;
  index: number;
  children: React.ReactNode;
  product: TInventoryProduct & { id: string };
  selected?: boolean;
  journal: JournalEnum;
  fieldsLength: number;
}) => {
  return (
    <Table.Row
      key={product.id}
      data-state={selected ? 'selected' : 'unselected'}
      className="overflow-hidden h-cell"
    >
      {children}

      <Table.Cell
        className={cn({
          'border-t': index === 0,
        })}
      >
        <Form.Field
          control={form.control}
          name={`details.${index}.products.${index}.accountId`}
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
          'border-t': index === 0,
        })}
      >
        <Form.Field
          control={form.control}
          name={`details.${index}.products.${index}.productId`}
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
      <InventoryProductCompute
        index={index}
        form={form}
        product={product}
        fieldsLength={fieldsLength}
      />
    </Table.Row>
  );
};

export const AddProductButton = ({
  form,
  append,
  index,
  fieldsLength,
}: {
  form: ITransactionGroupForm;
  append: (product: TInventoryProduct | TInventoryProduct[]) => void;
  index: number;
  fieldsLength: number;
}) => {
  const { control } = form;

  const lastProduct = useWatch({
    control,
    name: `details.${index}.products.${fieldsLength - 1}`,
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

const RemoveSelectedButton = ({
  selectedProducts,
  setSelectedProducts,
  remove,
  fields,
}: {
  selectedProducts: string[];
  remove: (index: number | number[]) => void;
  fields: Array<{ id: string }>;
  setSelectedProducts: (selectedProducts: string[]) => void;
}) => {
  if (selectedProducts.length === 0) return null;

  const handleRemove = () => {
    remove(
      selectedProducts.map((id) =>
        fields.findIndex((product) => product.id === id),
      ),
    );
    setSelectedProducts([]);
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
