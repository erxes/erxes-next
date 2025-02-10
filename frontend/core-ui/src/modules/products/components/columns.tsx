import { useState } from 'react';

import {
  IconCategoryPlus,
  IconChartBar,
  IconCurrencyDollar,
  IconHash,
  IconHistory,
  IconLabel,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';

import { Select, Skeleton } from 'erxes-ui/components';
import { CurrencyDisplay, RelativeDateDisplay } from 'erxes-ui/display';
import { CurrencyInput } from 'erxes-ui/modules/record-field/meta-inputs/components/CurrencyInput';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import {
  RecordTableInlineCell,
  RecordTableInlineCellContainer,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { CurrencyCode } from 'erxes-ui/types/CurrencyCode';

import { PRODUCT_TYPE_OPTIONS } from '../constants/ProductConstants';
import { useProductCategories } from '../hooks/useProductCategories';
import { useProductsEdit } from '../hooks/useProductsEdit';

import { SelectCategory } from '@/products/product-category/components/SelectCategory';

const TableTextInput = ({ cell }) => {
  const [value, setValue] = useState(cell.getValue() as string);
  const { productsEdit } = useProductsEdit();
  return (
    <RecordTableInlineCell
      onSave={() => {
        productsEdit({
          variables: {
            _id: cell.row.original._id,
            [cell.column.id]: value,
            uom: cell.row.original.uom,
          },
        });
      }}
      getValue={() => cell.getValue()}
      value={value}
      display={() => value}
      edit={() => (
        <RecordTableInlineCellEditForm>
          <TextFieldInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </RecordTableInlineCellEditForm>
      )}
    />
  );
};

export const columns: ColumnDef<any>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTableInlineHead icon={IconLabel} label="Name" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTableInlineHead icon={IconHash} label="Code" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'unitPrice',
    accessorKey: 'unitPrice',
    header: () => (
      <RecordTableInlineHead icon={IconCurrencyDollar} label="Unit Price" />
    ),
    cell: ({ cell }) => {
      const [value, setValue] = useState(cell.getValue() as number);
      const { productsEdit } = useProductsEdit();
      return (
        <RecordTableInlineCell
          onSave={() => {
            productsEdit({
              variables: {
                _id: cell.row.original._id,
                unitPrice: value,
                uom: cell.row.original.uom,
              },
            });
          }}
          getValue={() => cell.getValue()}
          value={value}
          display={() => (
            <CurrencyDisplay
              currencyValue={{
                currencyCode: CurrencyCode.USD,
                amountMicros: value * 1000000,
              }}
            />
          )}
          edit={() => (
            <RecordTableInlineCellEditForm>
              <CurrencyInput
                value={value}
                onChange={(value) => setValue(value)}
              />
            </RecordTableInlineCellEditForm>
          )}
        />
      );
    },
  },
  {
    id: 'categoryId',
    accessorKey: 'categoryId',
    header: () => (
      <RecordTableInlineHead icon={IconChartBar} label="Category" />
    ),
    cell: ({ cell }) => {
      const [value, setValue] = useState(cell.getValue() as string);
      const { productsEdit } = useProductsEdit();
      const { productCategories, loading } = useProductCategories();

      if (loading) return <Skeleton className="h-4 w-24 ml-2" />;

      const category = productCategories?.find(
        (category) => category._id === value,
      );
      return (
        <RecordTableInlineCellContainer>
          <SelectCategory
            selected={category?._id}
            onSelect={() =>
              productsEdit({
                variables: {
                  _id: cell.row.original._id,
                  categoryId: value,
                  uom: cell.row.original.uom,
                },
              })
            }
            className="rounded-none px-2 font-normal border-r-0 ring-0"
            size="lg"
          />
        </RecordTableInlineCellContainer>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => (
      <RecordTableInlineHead icon={IconHistory} label="Created At" />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell
        display={() => (
          <RelativeDateDisplay value={cell.getValue() as string} />
        )}
      />
    ),
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: () => (
      <RecordTableInlineHead icon={IconCategoryPlus} label="Type" />
    ),
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell
          display={() => <span>{cell.getValue() as string}</span>}
          edit={({ isInEditMode, setIsInEditMode }) => (
            <Select open={isInEditMode} onOpenChange={setIsInEditMode}>
              <Select.Trigger className="w-full h-cell rounded-none">
                <Select.Value placeholder="Select type" />
              </Select.Trigger>
              <Select.Content>
                {PRODUCT_TYPE_OPTIONS.map((type) => (
                  <Select.Item value={type.value} key={type.value}>
                    {type.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}
        />
      );
    },
  },
];
