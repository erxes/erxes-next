import { RecordTable, useMultiQueryState } from 'erxes-ui';
import { brandsColumns } from './BrandsColumns';
import { BrandsCommandBar } from './BrandsCommandBar';
import { useBrands } from '../hooks/useBrands';

export function BrandsRecordTable() {
  const [queries] = useMultiQueryState<{
    searchValue: string;
  }>(['searchValue']);
  const { brands, loading } = useBrands({
    variables: {
      searchValue: queries?.searchValue,
    },
  });
  return (
    <RecordTable.Provider
      data={brands || []}
      columns={brandsColumns}
      stickyColumns={['more', 'checkbox', 'name']}
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
