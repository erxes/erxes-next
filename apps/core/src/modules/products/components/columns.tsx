import {
  IconChartBar,
  IconHash,
  IconHistory,
  IconCurrencyDollar,
  IconLabel,
  IconCheck,
  IconCategoryPlus,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { Command, Select, Skeleton } from 'erxes-ui/components';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { useState } from 'react';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import { useProductsEdit } from '../hooks/useProductsEdit';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import { CurrencyCode } from 'erxes-ui/types/CurrencyCode';
import { CurrencyDisplay, RelativeDateDisplay } from 'erxes-ui/display';
import { CurrencyInput } from 'erxes-ui/modules/record-field/meta-inputs/components/CurrencyInput';
import { useProductCategories } from '../hooks/useProductCategories';
import { PRODUCT_TYPE_OPTIONS } from '../constants/ProductConstants';
import { ChipDisplay } from 'erxes-ui/components/display/ChipDisplay';

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
        (category) => category._id === value
      );

      return (
        <RecordTableInlineCell
          onSave={(val) => {
            productsEdit({
              variables: {
                _id: cell.row.original._id,
                categoryId: val,
                uom: cell.row.original.uom,
              },
            });
          }}
          getValue={() => cell.getValue()}
          value={value}
          setValue={setValue}
          display={() => (
            <ChipDisplay
              attachment={category?.attachment}
              colorSeed={category?._id}
            >
              {category?.name}
            </ChipDisplay>
          )}
          edit={({ handleSelect }) => (
            <>
              <div className="h-cell border border-primary ring-[3px] ring-ring/20 relative z-10 flex items-center gap-2 p-2">
                <ChipDisplay
                  attachment={category?.attachment}
                  colorSeed={category?._id}
                >
                  {category?.name}
                </ChipDisplay>
              </div>
              <Command>
                <Command.Input variant="secondary" />
                <Command.List className="styled-scroll overflow-x-auto">
                  <Command.Item
                    value={category._id}
                    onSelect={() => handleSelect(category._id)}
                  >
                    <ChipDisplay
                      attachment={category?.attachment}
                      colorSeed={category?._id}
                    >
                      {category?.name}
                    </ChipDisplay>
                    <IconCheck className="ml-auto" />
                  </Command.Item>
                  {productCategories
                    ?.filter((c) => c._id !== category._id)
                    .map((category) => (
                      <Command.Item
                        key={category._id}
                        value={category._id}
                        onSelect={() => handleSelect(category._id)}
                      >
                        <ChipDisplay
                          attachment={category?.attachment}
                          colorSeed={category?._id}
                        >
                          {category?.name}
                        </ChipDisplay>
                      </Command.Item>
                    ))}
                </Command.List>
              </Command>
            </>
          )}
        />
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
    cell: ({ cell }) => (
      <RecordTableInlineCell
        display={() => <>{cell.getValue()}</>}
        edit={() => (
          <Select>
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
    ),
  },
];
