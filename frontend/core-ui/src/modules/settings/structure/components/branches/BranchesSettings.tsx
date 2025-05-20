import { useBranchesList } from '../../hooks/useBranchesList';
import { RecordTable } from 'erxes-ui';
import { BranchColumns } from './BranchColumns';
import { BranchesRemove } from './BranchesRemove';
import { BranchEdit } from './details/BranchEdit';

export default function BranchesSettings() {
  const { branches } = useBranchesList();

  return (
    <section className="flex flex-col h-full w-full p-5">
      <BranchEdit />
      <RecordTable.Provider
        data={branches || []}
        columns={BranchColumns}
        stickyColumns={['checkbox', 'code', 'title']}
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
    </section>
  );
}
