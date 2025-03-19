import { RecordTable } from 'erxes-ui';

import { columns } from '@/products/components/columns';
import { ProductCommandBar } from '@/products/components/ProductCommandBar';
import { useProducts } from '@/products/hooks/useProducts';
import { productMoreColumn } from './ProductMoreColumn';
export const ProductsRecordTable = () => {
  const { products, handleFetchMore, loading, totalCount } = useProducts();
  return (
    <RecordTable.Provider
      columns={columns}
      data={products || []}
      handleReachedBottom={handleFetchMore}
      className="mt-1.5"
      stickyColumns={['name']}
      moreColumn={productMoreColumn}
    >
      <RecordTable>
        <RecordTable.Header />
        {!loading && (
          <RecordTable.Body>
            {totalCount > products?.length && (
              <RecordTable.RowSkeleton
                rows={4}
                handleReachedBottom={handleFetchMore}
              />
            )}
          </RecordTable.Body>
        )}
      </RecordTable>
      <ProductCommandBar />
    </RecordTable.Provider>
  );
};
