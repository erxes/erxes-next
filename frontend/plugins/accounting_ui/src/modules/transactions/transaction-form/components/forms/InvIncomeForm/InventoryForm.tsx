import { AddInventoryRowButton } from './AddInventoryRow';
// import { InventoryHeaderCheckbox } from './InventoryRowCheckbox';
import { InventoryRow } from './InventoryRow';
import { ITransactionGroupForm } from '../../../types/AddTransaction';
import { RemoveButton } from './RemoveButton';
import { Table } from 'erxes-ui';
import { useFieldArray } from 'react-hook-form';
import { useState } from 'react';

export const InventoryForm = ({
  form,
  journalIndex,
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `trDocs.${journalIndex}.details`,
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  return (
    <Table className="mt-8 p-1 overflow-hidden rounded-lg bg-sidebar border-sidebar">
      {/* <InventoryContext.Provider
        value={{
          selectedProducts,
          setSelectedProducts,
          journalIndex,
          journal,
          inventoriesLength: fields.length,
          form,
          fields: fields as any,
        }}
      > */}
      <InventoryTableHeader />
      <Table.Body className="overflow-hidden">
        {fields.map((product, detailIndex) => (
          <InventoryRow
            key={product.id}
            detailIndex={detailIndex}
            journalIndex={journalIndex}
            form={form}
          />
        ))}
      </Table.Body>
      <Table.Footer>
        <tr>
          <td colSpan={6} className="p-4">
            <div className="flex w-full justify-center gap-4">
              <AddInventoryRowButton append={append} form={form} journalIndex={journalIndex} />
              <RemoveButton remove={remove} fields={fields} />
            </div>
          </td>
        </tr>
      </Table.Footer>
      {/* </InventoryContext.Provider> */}
    </Table>
  );
};

const InventoryTableHeader = () => {
  return (
    <Table.Header>
      <Table.Row>
        {/* <InventoryHeaderCheckbox /> */}
        <Table.Head></Table.Head>
        <Table.Head>Account</Table.Head>
        <Table.Head>Inventory</Table.Head>
        <Table.Head>Quantity</Table.Head>
        <Table.Head>Unit Price</Table.Head>
        <Table.Head>Amount</Table.Head>
      </Table.Row>
    </Table.Header>
  );
};
