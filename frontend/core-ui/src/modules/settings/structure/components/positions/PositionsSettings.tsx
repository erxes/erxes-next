import { RecordTable } from 'erxes-ui';
import { usePositionsList } from '../../hooks/usePositionsList';
import { PositionsColumns } from './PositionsColumns';
import { PositionEdit } from './detail/PositionEdit';
import { PositionsRemove } from './PositionsRemove';

export default function PositionsSettings() {
  const { positions } = usePositionsList();
  return (
    <section className="flex flex-col h-full w-full p-5">
      <PositionEdit />
      <RecordTable.Provider data={positions || []} columns={PositionsColumns}>
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
    </section>
  );
}
