import { AddInventoryRowButton } from './AddInventoryRow';
// import { InventoryHeaderCheckbox } from './InventoryRowCheckbox';
import { Table } from 'erxes-ui';
import { useState } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { ITransactionGroupForm } from '../../../types/JournalForms';
import { InventoryRow } from './InventoryRow';
import { RemoveButton } from './RemoveButton';

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
      <InventoryTableHeader form={form} journalIndex={journalIndex} />
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

const InventoryTableHeader = ({ form, journalIndex }: { form: ITransactionGroupForm, journalIndex: number }) => {
  const trDoc = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}`,
  });

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
        {trDoc.hasVat && (
          <Table.Head>HasVat</Table.Head>
        )}
        {trDoc.hasCtax && (
          <Table.Head>HasCtax</Table.Head>
        )}
        {(trDoc.hasVat || trDoc.hasCtax) && (
          <>
            <Table.Head>Unit with tax</Table.Head>
            <Table.Head>Amount with tax</Table.Head>
          </>
        )}
      </Table.Row>
    </Table.Header>
  );
};
