import { Button } from 'erxes-ui/components';
import { IconChevronDown, IconList } from '@tabler/icons-react';
import { columns } from './columns';
// import { ProductCommandBar } from './ProductCommandBar';
// import { ProductsRecordTableOptions } from './RecordTableOptionsButton/ProductsRecordTableOptions';
import { useProducts } from '@/products/hooks/useProducts';
import { ProductsRecordTableSkeleton } from './Skeleton/ProductsRecordTableSkeleton';
import { RecordTable } from 'erxes-ui/modules/record-table';
import { IRecordTableColumn } from 'erxes-ui/modules/record-table/types/recordTableTypes';
import { useProductCategories } from '@/products/hooks/useProductCategories';
import { useProductTags } from '../hooks/useProductTags';
import { ProductCommandBar } from './ProductCommandBar';

export const ProductsRecordTable = () => {
  const { products, handleFetchMore, loading, totalCount } = useProducts();

  const getFetchValueHook = (columnId: string) => {
    if (columnId === 'categoryId') return useProductCategories;
    if (columnId === 'tagIds') return useProductTags;
    return () => ({ loading: false, options: [] });
  };
  return (
    <>
      <RecordTable.TopBar>
        <Button variant="ghost" className="text-muted-foreground">
          <IconList className="w-4 h-4" />
          <span className="inline-flex items-center">
            All
            <span className="mx-1 pb-px">•</span>
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
          {/* <ProductsRecordTableOptions /> */}
        </div>
      </RecordTable.TopBar>
      {loading ? (
        <ProductsRecordTableSkeleton />
      ) : (
        <>
          <RecordTable.Provider
            columns={columns as IRecordTableColumn[]}
            data={products || []}
            handleReachedBottom={handleFetchMore}
            getFetchValueHook={getFetchValueHook}
          >
            <RecordTable>
              <RecordTable.Header />
              <RecordTable.Body>
                {!loading && totalCount > products?.length && (
                  <RecordTable.RowSkeleton
                    rows={4}
                    handleReachedBottom={handleFetchMore}
                  />
                )}
              </RecordTable.Body>
            </RecordTable>
            <ProductCommandBar />
          </RecordTable.Provider>
        </>
      )}
    </>
  );
};
