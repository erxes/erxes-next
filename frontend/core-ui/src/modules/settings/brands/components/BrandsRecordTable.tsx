import { RecordTable } from 'erxes-ui';
import { brandsColumns } from './BrandsColumns';
import { BrandsCommandBar } from './BrandsCommandBar';
import { useBrands } from '../hooks/useBrands';

export function BrandsRecordTable() {
  const { brands, loading } = useBrands();
  return (
    <RecordTable.Provider
      data={brands || []}
      columns={brandsColumns}
      stickyColumns={['checkbox', 'code', 'name']}
      className="m-3"
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          <RecordTable.RowList />
        </RecordTable.Body>
      </RecordTable>
      <BrandsCommandBar />
    </RecordTable.Provider>
  );
}
