import { ITransactionGroupForm } from '../../../types/JournalForms';
import { JournalEnum } from '@/settings/account/types/Account';
import { SelectAccount } from '@/settings/account/components/SelectAccount';
import { useWatch } from 'react-hook-form';
import {
  Form,
  Input,
  Select,
  cn,
  InputNumber,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTableHotKeyControl,
  RecordTablePopover,
  Table,
  Button,
} from 'erxes-ui';
import { AccountingHotkeyScope } from '~/modules/types/AccountingHotkeyScope';
import { INV_INCOME_EXPENSE_TYPES } from '~/modules/transactions/types/constants';
import { IconTrashX } from '@tabler/icons-react';

export const ExpenseRow = ({
  form,
  journalIndex,
  expenseIndex
}: {
  form: ITransactionGroupForm;
  expenseIndex: number;
  journalIndex: number;
}) => {

  const expenses = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.extraData.invIncomeExpenses`,
  });

  const expense = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.extraData.invIncomeExpenses.${expenseIndex}`,
  });

  const { _id } = expense;

  return (
    <Table.Row
      key={_id}
      className={cn(
        'overflow-hidden h-cell hover:!bg-background',
        expenseIndex === 0 && '[&>td]:border-t',
      )}
    >
      <Table.Cell
        className={cn('overflow-hidden', {
          'rounded-tl-lg border-t': expenseIndex === 0,
          'rounded-bl-lg': expenseIndex === expenses.length - 1,
        })}
      >
        <div className="w-9 flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => form.setValue(
              `trDocs.${journalIndex}.extraData.invIncomeExpenses`,
              expenses.filter(e => e._id !== _id)
            )}

          >
            <IconTrashX />
          </Button>
        </div>
      </Table.Cell>
      <RecordTableHotKeyControl rowId={_id} rowIndex={expenseIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.extraData.invIncomeExpenses.${expenseIndex}.title`}
            render={({ field }) => (
              <RecordTablePopover
                scope={`trDocs.${journalIndex}.extraData.invIncomeExpenses.${expenseIndex}.title`}
                closeOnEnter
              >
                <Form.Control>
                  <RecordTableCellTrigger>
                    {field.value || ''}
                  </RecordTableCellTrigger>
                </Form.Control>
                <RecordTableCellContent>
                  <Input {...field} value={field.value ?? ''} onChange={field.onChange} />
                </RecordTableCellContent>
              </RecordTablePopover>
            )}
          />
        </Table.Cell>
      </RecordTableHotKeyControl>
      <RecordTableHotKeyControl rowId={_id} rowIndex={expenseIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.extraData.invIncomeExpenses.${expenseIndex}.rule`}
            render={({ field }) => (
              <RecordTablePopover
                scope={`trDocs.${journalIndex}.extraData.invIncomeExpenses.${expenseIndex}.rule`}
                closeOnEnter
              >
                <Select value={field.value} onValueChange={field.onChange}>
                  <Form.Control>
                    <Select.Trigger className="h-8 shadow-none">
                      <Select.Value />
                    </Select.Trigger>
                  </Form.Control>

                  <Select.Content>
                    {INV_INCOME_EXPENSE_TYPES.map((rule) => (
                      <Select.Item key={rule.value} value={rule.value}>
                        {rule.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </RecordTablePopover>
            )}
          />
        </Table.Cell>
      </RecordTableHotKeyControl>
      <RecordTableHotKeyControl rowId={_id} rowIndex={expenseIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.extraData.invIncomeExpenses.${expenseIndex}.amount`}
            render={({ field }) => (
              <RecordTablePopover
                scope={`trDocs.${journalIndex}.extraData.invIncomeExpenses.${expenseIndex}.amount`}
                closeOnEnter
              >
                <Form.Control>
                  <RecordTableCellTrigger>
                    {field.value?.toLocaleString() || 0}
                  </RecordTableCellTrigger>
                </Form.Control>
                <RecordTableCellContent>
                  <InputNumber
                    value={field.value ?? 0}
                    onChange={field.onChange}
                  />
                </RecordTableCellContent>
              </RecordTablePopover>
            )}
          />
        </Table.Cell>
      </RecordTableHotKeyControl>
      <RecordTableHotKeyControl rowId={_id} rowIndex={expenseIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.extraData.invIncomeExpenses.${expenseIndex}.accountId`}
            render={({ field }) => (
              <RecordTablePopover
                scope={`trDocs.${journalIndex}.extraData.invIncomeExpenses.${expenseIndex}.amount`}
                closeOnEnter
              >
                <SelectAccount
                  value={field.value || ''}
                  onValueChange={(accountId) => {
                    field.onChange(accountId);
                  }}
                  defaultFilter={{ journals: [JournalEnum.MAIN, JournalEnum.BANK, JournalEnum.CASH, JournalEnum.DEBT], currency: 'MNT' }}
                  variant="ghost"
                  inForm
                  scope={AccountingHotkeyScope.TransactionFormSubPage}
                />
              </RecordTablePopover>
            )}
          />
        </Table.Cell>
      </RecordTableHotKeyControl>

    </Table.Row>
  );
};
