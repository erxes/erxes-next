import { RecordTable } from 'erxes-ui';

import { productColumns } from '@/products/components/ProductColumns';
import { ProductCommandBar } from '@/products/components/ProductCommandBar';
import { useProducts } from '@/products/hooks/useProducts';
export const ProductsRecordTable = () => {
  const { products, handleFetchMore, loading, pageInfo } = useProducts();

  const { hasPreviousPage, hasNextPage, startCursor, endCursor } =
    pageInfo || {};

  return (
    <RecordTable.Provider
      columns={productColumns}
      data={products || []}
      className="m-3"
      stickyColumns={['more', 'checkbox', 'name']}
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={products?.length}
        sessionKey="products_cursor"
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
              startCursor={startCursor}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.RowList />
            <RecordTable.CursorForwardSkeleton
              handleFetchMore={handleFetchMore}
              endCursor={endCursor}
            />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.CursorProvider>
      <ProductCommandBar />
    </RecordTable.Provider>
  );
};
