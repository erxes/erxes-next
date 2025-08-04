import { useProductsEdit } from '@/products/hooks/useProductsEdit';
import { renderingProductDetailAtom } from '@/products/states/productDetailStates';
import {
  IconCategory,
  IconCurrencyDollar,
  IconHash,
  IconLabel,
  IconUser,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  TextOverflowTooltip,
  RecordTableCellDisplay,
  CurrencyFormatedDisplay,
  CurrencyCode,
  useQueryState,
  RecordTablePopover,
  RecordTableCellTrigger,
  Badge,
  RecordTableCellContent,
  Input,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { IProduct, SelectCategory } from 'ui-modules';
export const productColumns: ColumnDef<IProduct>[] = [
  RecordTable.checkboxColumn as ColumnDef<IProduct>,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead icon={IconLabel} label="Name" />,
    cell: ({ cell }) => {
      const name = cell.getValue() as string;
      const [, setProductId] = useQueryState('productId');
      const setRenderingProductDetail = useSetAtom(renderingProductDetailAtom);
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <Badge
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setRenderingProductDetail(true);
                setProductId(cell.row.original._id);
              }}
            >
              {name}
            </Badge>
          </RecordTableCellTrigger>
          <RecordTableCellContent className="min-w-72">
            <Input value={name || ''} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead icon={IconHash} label="Code" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'unitPrice',
    accessorKey: 'unitPrice',
    header: () => (
      <RecordTable.InlineHead icon={IconCurrencyDollar} label="Unit Price" />
    ),
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <CurrencyFormatedDisplay
            currencyValue={{
              amountMicros: (cell.getValue() as number),
              currencyCode: CurrencyCode.MNT,
            }}
          />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'vendor',
    accessorKey: 'vendor',
    header: () => <RecordTable.InlineHead icon={IconUser} label="Vendor" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: () => (
      <RecordTable.InlineHead icon={IconCategory} label="Category" />
    ),
    cell: ({ cell }) => {
      const { productsEdit } = useProductsEdit();
      return (
        <SelectCategory.InlineCell
          mode="single"
          value={cell.getValue() as string}
          onValueChange={(value) => {
            productsEdit({
              variables: {
                _id: cell.row.original._id,
                categoryId: value,
              },
            });
          }}
          categories={
            cell.row.original.category ? [cell.row.original.category] : []
          }
        />
      );
    },
  },
];
