import { JournalEnum } from '@/settings/account/types/Account';
import { ITransactionGroupForm } from '../../transaction-form/types/AddTransaction';
import { useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { Table } from 'erxes-ui';
import { InventoryRow } from './InventoryRow';
import { AddInventoryRowButton } from './AddInventoryRow';
import { RemoveButton } from './RemoveButton';
import { InventoryContext } from '../context/InventoryContext';
import { InventoryHeaderCheckbox } from './InventoryRowCheckbox';

export const InventoryForm = ({
  form,
  journalIndex,
  journal,
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
  journal: JournalEnum;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `details.${journalIndex}.products`,
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  return (
    <Table className="mt-8 p-1 overflow-hidden rounded-lg bg-sidebar border-sidebar">
      <InventoryContext.Provider
        value={{
          selectedProducts,
          setSelectedProducts,
          journalIndex,
          journal,
          inventoriesLength: fields.length,
          form,
          fields: fields as any,
        }}
      >
        <InventoryTableHeader />
        <Table.Body className="overflow-hidden">
          {fields.map((product, productIndex) => (
            <InventoryRow
              productIndex={productIndex}
              product={product}
              key={product.id}
            />
          ))}
        </Table.Body>
        <Table.Footer>
          <tr>
            <td colSpan={6} className="p-4">
              <div className="flex w-full justify-center gap-4">
                <AddInventoryRowButton append={append} />
                <RemoveButton remove={remove} fields={fields} />
              </div>
            </td>
          </tr>
        </Table.Footer>
      </InventoryContext.Provider>
    </Table>
  );
};

const InventoryTableHeader = () => {
  return (
    <Table.Header>
      <Table.Row>
        <InventoryHeaderCheckbox />
        <Table.Head>Account</Table.Head>
        <Table.Head>Inventory</Table.Head>
        <Table.Head>Quantity</Table.Head>
        <Table.Head>Unit Price</Table.Head>
        <Table.Head>Amount</Table.Head>
      </Table.Row>
    </Table.Header>
  );
};
