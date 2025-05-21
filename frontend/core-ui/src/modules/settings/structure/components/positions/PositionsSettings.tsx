import { RecordTable } from 'erxes-ui';
import { usePositionsList } from '../../hooks/usePositionsList';
import { PositionsColumns } from './PositionsColumns';
import { PositionEdit } from './detail/PositionEdit';
import { PositionsRemove } from './PositionsRemove';

export function PositionsSettings() {
  const { positions } = usePositionsList();
  return (
    <div className="w-full overflow-hidden flex flex-col">
      <PositionEdit />
      <RecordTable.Provider
        data={positions || []}
        columns={PositionsColumns}
        className="m-3"
      >
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
            </RecordTable.Body>
            <PositionsRemove />
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </div>
  );
}
