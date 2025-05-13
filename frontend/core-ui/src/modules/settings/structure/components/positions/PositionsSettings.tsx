import { RecordTable } from 'erxes-ui';
import { usePositionsList } from '../../hooks/usePositionsList';
import { PositionsColumns } from './PositionsColumns';

export default function PositionsSettings() {
  const { positions } = usePositionsList();
  return (
    <section className="flex flex-col h-full w-full p-5">
      <RecordTable.Provider data={positions || []} columns={PositionsColumns}>
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
