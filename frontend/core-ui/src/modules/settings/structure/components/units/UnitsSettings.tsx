import { RecordTable } from 'erxes-ui';
import { useUnitsList } from '../../hooks/useUnitsList';
import { UnitsColumns } from './UnitsColumns';

export default function UnitsSettings() {
  const { units, error, loading } = useUnitsList();
  return (
    <section className="flex flex-col h-full w-full p-5">
      <RecordTable.Provider data={units || []} columns={UnitsColumns}>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </section>
  );
}
