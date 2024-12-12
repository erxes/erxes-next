import { flexRender } from '@tanstack/react-table';
import { ProductCommandBar } from '../ProductCommandBar';
import { RecordTable } from 'erxes-ui/components/record-table';
import { SkeletonColumns } from './ProductsRecordTableColumnSkeleton';

export const ProductsRecordTableSkeleton = () => {
  const NUMBER_OF_SKELETON_ROW = 10;
  return (
    <RecordTable.Provider
      columns={SkeletonColumns}
      data={Array(NUMBER_OF_SKELETON_ROW).fill({})}
      className="flex-grow-0 basis-full overflow-hidden"
    >
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
        ></RecordTable.Body>
      </RecordTable.Root>
      <ProductCommandBar />
    </RecordTable.Provider>
  );
};

export default ProductsRecordTableSkeleton;
