import { RecordTable } from 'erxes-ui';
import { useUnitsList } from '../../hooks/useUnitsList';
import { UnitsColumns } from './UnitsColumns';
import { UnitEdit } from './detail/UnitEdit';
import { UnitsRemove } from './UnitsRemove';

export function UnitsSettings() {
  const { units, loading } = useUnitsList();
  return (
    <div className="w-full overflow-hidden flex flex-col">
      <UnitEdit />
      <RecordTable.Provider
        data={units || []}
        columns={UnitsColumns}
        className="m-3"
      >
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
    </div>
  );
}
