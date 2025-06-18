import { SelectAccount } from '@/settings/account/components/SelectAccount';
import { JournalEnum } from '@/settings/account/types/Account';
import { AccountingHotkeyScope } from '@/types/AccountingHotkeyScope';
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
import { ITransactionGroupForm } from '../../../types/JournalForms';

export const InventoryRow = ({
  detailIndex,
  journalIndex,
  form,
}: {
  detailIndex: number;
  journalIndex: number;
  form: ITransactionGroupForm;
}) => {
  const trDoc = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}`,
  });

  const detail = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.details.${detailIndex}`,
  });

  const { unitPrice, count, _id } = detail;

  const getFieldName = (name: string) => {
    return `trDocs.${journalIndex}.details.${detailIndex}.${name}`;
  };

  const handleAmountChange = (
    value: number,
  ) => {
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
      className={cn(
        'overflow-hidden h-cell hover:!bg-background',
        detailIndex === 0 && '[&>td]:border-t',
      )}
    >
      <RecordTableHotKeyControl rowId={_id} rowIndex={detailIndex}>
        <Table.Cell
          className={cn({
            'border-t': detailIndex === 0,
            'rounded-tl-lg': detailIndex === 0,
            'rounded-bl-lg': detailIndex === trDoc.details.length - 1,
          })}
        >
          <RecordTableCellDisplay className="justify-center">
            <Form.Field
              control={form.control}
              name={`trDocs.${journalIndex}.details.${detailIndex}.checked`}
              render={({ field }) => (
                <Form.Item>
                  <Form.Control>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </RecordTableCellDisplay>
        </Table.Cell>
      </RecordTableHotKeyControl>

      <RecordTableHotKeyControl rowId={_id} rowIndex={detailIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.details.${detailIndex}.accountId`}
            render={({ field }) => (
              <SelectAccount
                value={field.value || ''}
                onValueChange={(accountId) => {
                  field.onChange(accountId);
                }}
                defaultFilter={{ journals: [JournalEnum.INVENTORY] }}
                variant="ghost"
                inForm
                scope={AccountingHotkeyScope.TransactionFormPage}
              />
            )}
          />
        </Table.Cell>
      </RecordTableHotKeyControl>
      <RecordTableHotKeyControl rowId={_id} rowIndex={detailIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.details.${detailIndex}.productId`}
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
      <RecordTableHotKeyControl rowId={_id} rowIndex={detailIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.details.${detailIndex}.count`}
            render={({ field }) => (
              <RecordTablePopover
                scope={`trDocs.${journalIndex}.details.${detailIndex}.count`}
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
      <RecordTableHotKeyControl rowId={_id} rowIndex={detailIndex}>
        <Table.Cell>
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.details.${detailIndex}.unitPrice`}
            render={({ field }) => (
              <RecordTablePopover
                scope={`trDocs.${journalIndex}.details.${detailIndex}.unitPrice`}
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
      <RecordTableHotKeyControl rowId={_id} rowIndex={detailIndex}>
        <Table.Cell>
          <RecordTablePopover
            scope={`trDocs.${journalIndex}.details.${detailIndex}.tempAmount`}
            closeOnEnter
          >
            <RecordTableCellTrigger>
              {((unitPrice ?? 0) * (count ?? 0)).toLocaleString() || 0}
            </RecordTableCellTrigger>
            <RecordTableCellContent>
              <CurrencyField.ValueInput
                value={((unitPrice ?? 0) * (count ?? 0)) || 0}
                onChange={(value) =>
                  handleAmountChange(value || 0)
                }
              />
            </RecordTableCellContent>
          </RecordTablePopover>
        </Table.Cell>
      </RecordTableHotKeyControl>
    </Table.Row>
  );
};
