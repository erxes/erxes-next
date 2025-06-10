import { IconPlus, IconZoomCancel, IconZoomIn } from '@tabler/icons-react';
import { Button } from 'erxes-ui/components/button';
// import { AddInventoryRowButton } from './AddInventoryRow';
// import { InventoryHeaderCheckbox } from './InventoryRowCheckbox';
import { RecordTableHotkeyProvider, Table } from 'erxes-ui';
import { useFieldArray, useWatch } from 'react-hook-form';
import { ITransactionGroupForm } from '../../../types/JournalForms';
// import { InventoryRow } from './InventoryRow';
// import { RemoveButton } from './RemoveButton';
import { AccountingHotkeyScope } from '@/types/AccountingHotkeyScope';
import { useState } from 'react';

export const ExpenseForm = ({
  form,
  journalIndex,
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
}) => {
  const [isShow, setIsShow] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `trDocs.${journalIndex}.extraData.invIncomeExpenses`,
  });

  const trDoc = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}`,
  });

  if (!isShow) {
    return (
      <Button
        variant="link"
        className="bg-border"
        onClick={() => setIsShow(true)}
      >
        <IconZoomIn />
        {`Show expenses (${fields.length})`}
      </Button>
    )
  }

  return (
    <RecordTableHotkeyProvider
      columnLength={5}
      rowLength={fields.length}
      scope={AccountingHotkeyScope.TransactionFormSubPage}
    >
      <Table className="mt-8 p-1 overflow-hidden rounded-lg bg-sidebar border-sidebar">
        <InventoryTableHeader form={form} journalIndex={journalIndex} />
        <Table.Body className="overflow-hidden">
          {fields.map((product, detailIndex) => (
            <></>
            // <InventoryRow
            //   key={product.id}
            //   detailIndex={detailIndex}
            //   journalIndex={journalIndex}
            //   form={form}
            // />
          ))}
        </Table.Body>
        <Table.Footer>
          <tr>
            <td colSpan={5} className="p-4">
              <div className="flex w-full justify-center gap-4">
                <Button
                  variant="secondary"
                  className="bg-border"
                  onClick={() => setIsShow(false)}
                >
                  <IconPlus />
                  {`Add expense`}
                </Button>
                <Button
                  variant="link"
                  className="bg-border"
                  onClick={() => setIsShow(false)}
                >
                  <IconZoomCancel />
                  {`Hide expenses`}
                </Button>
              </div>
            </td>
          </tr>
        </Table.Footer>
      </Table>

    </RecordTableHotkeyProvider>
  );
};

const InventoryTableHeader = ({
  form,
  journalIndex,
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
}) => {
  return (
    <Table.Header>
      <Table.Row>
        {/* <InventoryHeaderCheckbox /> */}
        {/* <Table.Head></Table.Head> */}
        <Table.Head>Expense</Table.Head>
        <Table.Head>Rule</Table.Head>
        <Table.Head>Amount</Table.Head>
        <Table.Head>Actions</Table.Head>
      </Table.Row>
    </Table.Header>
  );
};
