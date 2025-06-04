import { SelectAccount } from '@/settings/account/components/SelectAccount';
import { Checkbox, cn, CurrencyField, Form, InputNumber, Table } from 'erxes-ui';
import { useWatch } from 'react-hook-form';
import { SelectProduct } from 'ui-modules';
// import { InventoryRowCheckbox } from './InventoryRowCheckbox';
import { JournalEnum } from '@/settings/account/types/Account';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { taxPercentsState } from '../../../states/trStates';
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
    name: `trDocs.${journalIndex}.details.${detailIndex}`,
  });

  const [taxPercents] = useAtom(taxPercentsState);

  const rowPercent = useMemo(() => {
    let percent = taxPercents.sum ?? 0;
    if (detail.excludeVat) {
      percent = percent - (taxPercents.vat ?? 0)
    }
    if (detail.excludeCtax) {
      percent = percent - (taxPercents.ctax ?? 0)
    }
    return percent;
  }, [taxPercents.sum, taxPercents.vat, taxPercents.ctax, detail.excludeVat, detail.excludeCtax])


  const [taxAmounts, setTaxAmounts] = useState({
    unitPriceWithTax: (detail.unitPrice ?? 0) / 100 * (100 + rowPercent),
    amountWithTax: (detail.amount ?? 0) / 100 * (100 + rowPercent),
  });

  const { unitPrice, count, _id } = detail;

  const getFieldName = (name: string) => {
    return `trDocs.${journalIndex}.details.${detailIndex}.${name}`;
  }

  const handleAmountChange = (
    value: number,
    onChange: (value: number) => void,
  ) => {
    onChange(value);

    const newUnitPrice = count ? value / count : 0;
    form.setValue(getFieldName('unitPrice') as any, newUnitPrice);
    if (trDoc.hasVat || trDoc.hasCtax) {
      setTaxAmounts({
        unitPriceWithTax: newUnitPrice / 100 * (100 + rowPercent),
        amountWithTax: value / 100 * (100 + rowPercent),
      })
    }
  };

  const calcAmount = (pCount?: number, pUnitPrice?: number) => {
    const newAmount = (pCount ?? 0) * (pUnitPrice ?? 0);
    form.setValue(getFieldName('amount') as any, newAmount);

    if (trDoc.hasVat || trDoc.hasCtax) {
      setTaxAmounts({
        unitPriceWithTax: (pUnitPrice ?? 0) / 100 * (100 + rowPercent),
        amountWithTax: newAmount / 100 * (100 + rowPercent)
      })
    }
  }

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

  const handleTaxValueChange = (key: string, value: number) => {
    const amountWithTax = key === 'amount' ? value : value * (count ?? 0);
    const unitPriceWithTax = key === 'amount' ? value / (count ?? 1) : value;

    setTaxAmounts({ unitPriceWithTax, amountWithTax });

    form.setValue(getFieldName('amount') as any, amountWithTax / (100 + rowPercent) * 100);
    form.setValue(getFieldName('unitPrice') as any, unitPriceWithTax / (100 + rowPercent) * 100);
  }

  const handleExcludeTax = (type: string, checked: boolean, onChange: (value: boolean) => void) => {
    let percent = taxPercents.sum ?? 0;

    if (type === 'vat' ? !checked : detail.excludeVat) {
      percent = percent - (taxPercents.vat ?? 0)
    }

    if (type === 'ctax' ? !checked : detail.excludeCtax) {
      percent = percent - (taxPercents.ctax ?? 0)
    }

    const unitPriceWithTax = (unitPrice ?? 0) / 100 * (100 + percent);
    setTaxAmounts({
      unitPriceWithTax,
      amountWithTax: unitPriceWithTax * (count ?? 0)
    })
    onChange(!checked);
  }

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
                    handleCountChange(value || 0, field.onChange)
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
          'border-t': detailIndex === 0,
          'rounded-tr-lg': !(trDoc.hasVat || trDoc.hasCtax) && detailIndex === 0,
          'rounded-br-lg': !(trDoc.hasVat || trDoc.hasCtax) && detailIndex === details.length - 1,
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

      {trDoc.hasVat && (
        <Table.Cell
          className={cn({
            'border-t': detailIndex === 0,
          })}
        >
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.details.${detailIndex}.excludeVat`}
            render={({ field }) => (
              <Form.Item>
                <Form.Control>
                  <Checkbox
                    checked={!field.value}
                    onCheckedChange={(checked) => handleExcludeTax('vat', Boolean(checked), field.onChange)}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </Table.Cell>
      )}

      {trDoc.hasCtax && (
        <Table.Cell
          className={cn({
            'border-t': detailIndex === 0,
          })}
        >
          <Form.Field
            control={form.control}
            name={`trDocs.${journalIndex}.details.${detailIndex}.excludeCtax`}
            render={({ field }) => (
              <Form.Item>
                <Form.Control>
                  <Checkbox
                    checked={!field.value}
                    onCheckedChange={(checked) => handleExcludeTax('ctax', Boolean(checked), field.onChange)}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </Table.Cell>
      )}

      {(trDoc.hasVat || trDoc.hasCtax) && (
        <>
          <Table.Cell
            className={cn({
              'border-t': detailIndex === 0,
            })}
          >
            <CurrencyField.ValueInput
              value={taxAmounts.unitPriceWithTax ?? 0}
              className='rounded-none focus-visible:relative focus-visible:z-10 shadow-none'
              onChange={(value) => handleTaxValueChange('unitPrice', value)}
            />

          </Table.Cell>
          <Table.Cell
            className={cn({
              'rounded-tr-lg border-t': detailIndex === 0,
              'rounded-br-lg': detailIndex === details.length - 1,
            })}
          >
            <CurrencyField.ValueInput
              value={taxAmounts.amountWithTax ?? 0}
              className='rounded-none focus-visible:relative focus-visible:z-10 shadow-none'
              onChange={(value) => handleTaxValueChange('amount', value)}
            />
          </Table.Cell>
        </>
      )}
    </Table.Row>
    // </InventoryRowContext.Provider>
  );
};
