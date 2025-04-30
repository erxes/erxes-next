import { IProductCategory } from '@/products/types/productTypes';
import { ColumnDef } from '@tanstack/react-table';
import { RecordTable } from 'erxes-ui';
import { useProductCategories } from '../hooks/useProductCategories';

export const ProductCategoriesRecordTable = () => {
  const { productCategories, loading } = useProductCategories();

  return (
    <RecordTable.Provider
      columns={productCategoryColumns}
      data={productCategories || []}
      className="m-3"
    >
      <RecordTable.Scroll>
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.RowList />
            {loading && <RecordTable.RowSkeleton rows={30} />}
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Scroll>
    </RecordTable.Provider>
  );
};

export const productCategoryColumns: ColumnDef<IProductCategory>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
];
