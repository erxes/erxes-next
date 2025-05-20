import { RecordTable } from 'erxes-ui';
import { useUnitsList } from '../../hooks/useUnitsList';
import { UnitsColumns } from './UnitsColumns';
import { UnitEdit } from './detail/UnitEdit';
import { UnitsRemove } from './UnitsRemove';

export default function UnitsSettings() {
  const { units, loading } = useUnitsList();
  return (
    <section className="flex flex-col h-full w-full p-5">
      <UnitEdit />
      <RecordTable.Provider data={units || []} columns={UnitsColumns}>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
            </RecordTable.Body>
            <UnitsRemove />
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </section>
  );
}
