import { IProductCategory } from '@/products/types/productTypes';
import { ColumnDef } from '@tanstack/react-table';
import {
  Avatar,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  RecordTableTree,
} from 'erxes-ui';
import { useProductCategories } from '../hooks/useProductCategories';
import {
  IconHash,
  IconImageInPicture,
  IconLabelFilled,
  IconPackage,
} from '@tabler/icons-react';
import { useMemo } from 'react';

export const ProductCategoriesRecordTable = () => {
  const { productCategories, loading } = useProductCategories();

  const categories = productCategories?.map((category: IProductCategory) => ({
    ...category,
    hasChildren: productCategories?.some(
      (c: IProductCategory) => c.parentId === category._id,
    ),
  }));

  const categoryObject = useMemo(() => {
    return categories?.reduce(
      (acc: Record<string, IProductCategory>, category: IProductCategory) => {
        acc[category._id] = category;
        return acc;
      },
      {},
    );
  }, [categories]);

  return (
    <RecordTable.Provider
      columns={productCategoryColumns(categoryObject)}
      data={categories || []}
      className="m-3"
    >
      <RecordTableTree id="product-categories" ordered>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList
                Row={(props) => (
                  <RecordTableTree.Row
                    {...props}
                    order={categoryObject[props.id as string]?.order}
                    name={categoryObject[props.id as string]?.name}
                  />
                )}
              />
              {loading && <RecordTable.RowSkeleton rows={30} />}
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTableTree>
    </RecordTable.Provider>
  );
};

export const productCategoryColumns: (
  categoryObject: Record<string, IProductCategory>,
) => ColumnDef<IProductCategory & { hasChildren: boolean }>[] = (
  categoryObject,
) => [
  RecordTable.checkboxColumn as ColumnDef<
    IProductCategory & { hasChildren: boolean }
  >,
  {
    id: 'attachment',
    header: () => <RecordTable.InlineHead icon={IconImageInPicture} label="" />,
    accessorKey: 'attachment',
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay className="px-1 justify-center">
          <Avatar>
            <Avatar.Image src={(cell.getValue() as any)?.url || ''} />
            <Avatar.Fallback>
              {cell.row.original.name.charAt(0)}
            </Avatar.Fallback>
          </Avatar>
        </RecordTableCellDisplay>
      );
    },
    size: 32,
  },
  {
    id: 'name',
    header: () => (
      <RecordTable.InlineHead icon={IconLabelFilled} label="Name" />
    ),
    accessorKey: 'name',
    cell: ({ cell }) => {
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableTree.Trigger
              order={cell.row.original.order}
              name={cell.getValue() as string}
              hasChildren={cell.row.original.hasChildren}
            >
              {cell.getValue() as string}
            </RecordTableTree.Trigger>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={cell.getValue() as string} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 300,
  },
  {
    id: 'code',
    header: () => <RecordTable.InlineHead icon={IconHash} label="Code" />,
    accessorKey: 'code',
    cell: ({ cell }) => {
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            {cell.getValue() as string}
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={cell.getValue() as string} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },

  {
    id: 'productCount',
    header: () => (
      <RecordTable.InlineHead icon={IconPackage} label="Product Count" />
    ),
    accessorKey: 'productCount',
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          {cell.getValue() as number}
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'parentId',
    header: () => <RecordTable.InlineHead icon={IconPackage} label="Parent" />,
    accessorKey: 'parentId',
    cell: ({ cell }) => {
      const parent = categoryObject[cell.getValue() as string];
      return <RecordTableCellDisplay>{parent?.name}</RecordTableCellDisplay>;
    },
  },
];
