import { tasksColumns } from '@/task/components/TasksColumn';
import { PageSubHeader, RecordTable } from 'erxes-ui';
import { useGetCycles } from '@/cycle/hooks/useGetCycles';
import { currentUserState } from 'ui-modules';
import { useAtomValue } from 'jotai';
import { CYCLES_CURSOR_SESSION_KEY } from '@/cycle/constants';
import { cyclesColumns } from '@/cycle/components/CyclesColumns';

export const CyclesRecordTable = () => {
  const currentUser = useAtomValue(currentUserState);

  const { cycles, handleFetchMore, pageInfo, loading } = useGetCycles();

  const { hasPreviousPage, hasNextPage } = pageInfo || {};



  return (
    <div className="flex flex-col overflow-hidden h-full">
      {/* <PageSubHeader>
        <TasksFilter />
      </PageSubHeader> */}
      <RecordTable.Provider
        columns={cyclesColumns}
        data={cycles || [{}]}
        className="m-3 h-full"
        stickyColumns={['checkbox', 'name']}
      >
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          dataLength={cycles?.length}
          sessionKey={CYCLES_CURSOR_SESSION_KEY}
        >
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.CursorBackwardSkeleton
                handleFetchMore={handleFetchMore}
              />
              {loading && <RecordTable.RowSkeleton rows={40} />}
              <RecordTable.RowList />
              <RecordTable.CursorForwardSkeleton
                handleFetchMore={handleFetchMore}
              />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.CursorProvider>
      </RecordTable.Provider>
    </div>
  );
};
