import { SelectAccount } from '@/settings/account/components/SelectAccount';
import {
  Checkbox,
  cn,
  CurrencyField,
  Form,
  InputNumber,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTableHotKeyControl,
  RecordTablePopover,
  Table,
} from 'erxes-ui';
import { useWatch } from 'react-hook-form';
import { SelectProduct } from 'ui-modules';
// import { ExpenseRowCheckbox } from './ExpenseRowCheckbox';
import { JournalEnum } from '@/settings/account/types/Account';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { taxPercentsState } from '../../../states/trStates';
import { ITransactionGroupForm } from '../../../types/JournalForms';
import { AccountingHotkeyScope } from '~/modules/types/AccountingHotkeyScope';

export const ExpenseRow = ({
  expenseIndex,
  journalIndex,
  form,
}: {
  expenseIndex: number;
  journalIndex: number;
  form: ITransactionGroupForm;
  // product: TInventoryProduct & { id: string };
}) => {
  // const { selectedProducts, form, inventoriesLength, journalIndex } =
  //   useInventoryContext();

  const trDoc = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}`,
  });

  const details = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.details`,
  });

  const detail = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.details.${expenseIndex}`,
  });

  const [taxPercents] = useAtom(taxPercentsState);

  const rowPercent = useMemo(() => {
    let percent = taxPercents.sum ?? 0;
    if (detail.excludeVat) {
      percent = percent - (taxPercents.vat ?? 0);
    }
    if (detail.excludeCtax) {
      percent = percent - (taxPercents.ctax ?? 0);
    }
    return percent;
  }, [
    taxPercents.sum,
    taxPercents.vat,
    taxPercents.ctax,
    detail.excludeVat,
    detail.excludeCtax,
  ]);

  const { unitPrice, count, _id } = detail;

  const getFieldName = (name: string) => {
    return `trDocs.${journalIndex}.details.${expenseIndex}.${name}`;
  };

  const handleAmountChange = (
    value: number,
    onChange: (value: number) => void,
  ) => {
    onChange(value);

    const newUnitPrice = count ? value / count : 0;
    form.setValue(getFieldName('unitPrice') as any, newUnitPrice);
  };

  const calcAmount = (pCount?: number, pUnitPrice?: number) => {
    const newAmount = (pCount ?? 0) * (pUnitPrice ?? 0);
    form.setValue(getFieldName('amount') as any, newAmount);
  };

  const handleCountChange = (
    value: number,
    onChange: (value: number) => void,
  ) => {
    calcAmount(value, unitPrice ?? 0);
    onChange(value);
  };

  const handleUnitPriceChange = (
    value: number,
    onChange: (value: number) => void,
  ) => {
    calcAmount(count ?? 0, value);
    onChange(value);
  };


  return (
    <Table.Row
      key={_id}
      // data-state={
      //   selectedProducts.includes(product.id) ? 'selected' : 'unselected'
      // }
      className={cn(
        'overflow-hidden h-cell hover:!bg-background',
        expenseIndex === 0 && '[&>td]:border-t',
      )}
    >
      {/* <Table.Cell
        className={cn('overflow-hidden', {
          'rounded-tl-lg border-t': expenseIndex === 0,
          'rounded-bl-lg': expenseIndex === details.length - 1,
        })}
      >
        <div className="w-9 flex items-center justify-center">
          <ExpenseRowCheckbox productId={product.id} />
        </div>
      </Table.Cell> */}

      <RecordTableHotKeyControl rowId={_id} rowIndex={expenseIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.details.${expenseIndex}.accountId`}
            render={({ field }) => (
              <SelectAccount
                value={field.value || ''}
                onValueChange={(accountId) => {
                  field.onChange(accountId);
                }}
                defaultFilter={{ journals: [JournalEnum.MAIN, JournalEnum.BANK, JournalEnum.CASH, JournalEnum.DEBT], currency: 'MNT' }}
                variant="ghost"
                inForm
                scope={AccountingHotkeyScope.TransactionFormPage}
              />
            )}
          />
        </Table.Cell>
      </RecordTableHotKeyControl>
      <RecordTableHotKeyControl rowId={_id} rowIndex={expenseIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.details.${expenseIndex}.productId`}
            render={({ field }) => (
              <SelectProduct
                value={field.value || ''}
                onValueChange={(productId) => {
                  field.onChange(productId);
                }}
                variant="ghost"
                scope={AccountingHotkeyScope.TransactionFormPage}
              />
            )}
          />
        </Table.Cell>
      </RecordTableHotKeyControl>
      <RecordTableHotKeyControl rowId={_id} rowIndex={expenseIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.details.${expenseIndex}.count`}
            render={({ field }) => (
              <RecordTablePopover
                scope={`trDocs.${journalIndex}.details.${expenseIndex}.count`}
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
                    onChange={(value) =>
                      handleCountChange(value || 0, field.onChange)
                    }
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
            name={`trDocs.${journalIndex}.details.${expenseIndex}.unitPrice`}
            render={({ field }) => (
              <RecordTablePopover
                scope={`trDocs.${journalIndex}.details.${expenseIndex}.unitPrice`}
                closeOnEnter
              >
                <Form.Control>
                  <RecordTableCellTrigger>
                    {field.value?.toLocaleString() || 0}
                  </RecordTableCellTrigger>
                </Form.Control>
                <RecordTableCellContent>
                  <CurrencyField.ValueInput
                    value={field.value || 0}
                    onChange={(value) =>
                      handleUnitPriceChange(value || 0, field.onChange)
                    }
                  />
                </RecordTableCellContent>
              </RecordTablePopover>
            )}
          />
        </Table.Cell>
      </RecordTableHotKeyControl>
      
    </Table.Row>
  );
};
