import { Button } from 'erxes-ui/components';
import { IconChevronDown, IconList } from '@tabler/icons-react';
import { columns } from '@/products/components/columns';
// import { ProductCommandBar } from '@/products/components/ProductCommandBar';
// import { ProductsRecordTableOptions } from '@/products/components/RecordTableOptionsButton/ProductsRecordTableOptions';
import { useProducts } from '@/products/hooks/useProducts';
import { ProductsRecordTableSkeleton } from '@/products/components/Skeleton/ProductsRecordTableSkeleton';
import { RecordTable } from 'erxes-ui/modules/record-table';
import { IRecordTableColumn } from 'erxes-ui/modules/record-table/types/recordTableTypes';
import { useProductCategories } from '@/products/hooks/useProductCategories';
import { useProductTags } from '@/products/hooks/useProductTags';
import { ProductCommandBar } from '@/products/components/ProductCommandBar';
import {
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
} from '@/products/constants/ProductConstants';
import { useProductsEdit } from '@/products/hooks/useProductsEdit';
import { MutationHookOptions } from '@apollo/client';

export const ProductsRecordTable = () => {
  const { products, handleFetchMore, loading, totalCount } = useProducts();

  const getFetchValueHook = (columnId: string) => {
    if (columnId === 'categoryId') return useProductCategories;
    if (columnId === 'tagIds') return useProductTags;
    if (columnId === 'status')
      return () => ({
        loading: false,
        options: PRODUCT_STATUS_OPTIONS,
      });
    if (columnId === 'type')
      return () => ({
        loading: false,
        options: PRODUCT_TYPE_OPTIONS,
      });
    return () => ({ loading: false, options: [] });
  };

  const getProduct = (id: string) =>
    products?.find((product) => product._id === id);

  const useMutateValueHook =
    (columnId: string) => (options?: MutationHookOptions) =>
      useProductsEdit(getProduct);

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
            useMutateValueHook={useMutateValueHook}
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
