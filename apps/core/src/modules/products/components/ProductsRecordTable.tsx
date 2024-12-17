import { flexRender } from '@tanstack/react-table';
import { Button, RecordTable } from 'erxes-ui/components';
import { IconChevronDown, IconList  } from '@tabler/icons-react'
import { columns } from './columns';
import { ProductCommandBar } from './ProductCommandBar';
import { ProductsRecordTableOptions } from './RecordTableOptionsButton/ProductsRecordTableOptions';
import { useProducts } from '../hooks/useProducts';
import { ProductsRecordTableSkeleton } from './Skeleton/ProductsRecordTableSkeleton';

export const ProductsRecordTable = () => {
  const { products, handleFetchMore, loading, totalCount } = useProducts();
  return (
    <>
      <div className="flex items-start justify-between h-9 flex-none">
        <Button variant="ghost" className="text-muted-foreground">
          <IconList className="w-4 h-4" />
          <span className="inline-flex items-center ">
            All
            <span className='mx-1 pb-1'>•</span>
            {totalCount}
          </span>
          <IconChevronDown className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-muted-foreground">
            Filter
          </Button>
          <Button variant="ghost" className="text-muted-foreground">
            Sort
          </Button>
          <ProductsRecordTableOptions />
        </div>
      </div>
      {loading ? (
        <ProductsRecordTableSkeleton />
      ) : (
        <RecordTable.Provider
          columns={columns}
          data={products || []}
          handleReachedBottom={handleFetchMore}
          className="flex-grow-0 basis-full overflow-hidden"
        >
          <RecordTable.ScrollArea className="h-full w-full">
            <RecordTable.Root>
              <RecordTable.Header
                renderHead={(header) => (
                  <RecordTable.Head header={header}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </RecordTable.Head>
                )}
              />
              <RecordTable.Body
                renderCell={(cell) => (
                  <RecordTable.Cell cell={cell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </RecordTable.Cell>
                )}
              >
                {!loading && totalCount > products?.length && (
                  <RecordTable.RowSkeleton
                    rows={4}
                    handleReachedBottom={handleFetchMore}
                  />
                )}
              </RecordTable.Body>
            </RecordTable.Root>
          </RecordTable.ScrollArea>
          <ProductCommandBar />
        </RecordTable.Provider>
      )}
    </>
  );
};
