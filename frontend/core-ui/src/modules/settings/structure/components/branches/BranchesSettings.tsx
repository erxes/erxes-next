import { useBranchesList } from '../../hooks/useBranchesList';
import { RecordTable } from 'erxes-ui';
import { BranchColumns } from './BranchColumns';
import { BranchesRemove } from './BranchesRemove';
import { BranchEdit } from './details/BranchEdit';

export function BranchesSettings() {
  const { branches } = useBranchesList();

  return (
    <div className="w-full overflow-hidden flex flex-col">
      <BranchEdit />
      <RecordTable.Provider
        data={branches || []}
        columns={BranchColumns}
        stickyColumns={['checkbox', 'code', 'title']}
        className="m-3"
      >
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
            </RecordTable.Body>
            <BranchesRemove />
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </div>
  );
}
