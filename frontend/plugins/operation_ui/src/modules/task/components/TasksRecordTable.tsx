import { tasksColumns } from '@/task/components/TasksColumn';
import { PageSubHeader, RecordTable } from 'erxes-ui';
import { useTasks } from '@/task/hooks/useGetTasks';
import { TASKS_CURSOR_SESSION_KEY } from '@/task/constants';
import { useGetTeams } from '@/team/hooks/useGetTeams';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';
import { TasksFilter } from '@/task/components/TasksFilter';
import { useParams } from 'react-router-dom';

export const TasksRecordTable = () => {
  const { projectId, cycleId } = useParams();
  const currentUser = useAtomValue(currentUserState);

  const variables = {
    projectId: projectId || undefined,
    cycleId: cycleId || undefined,
    userId: currentUser?._id,
  };

  const { tasks, handleFetchMore, pageInfo, loading } = useTasks({
    variables,
  });

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const { teams } = useGetTeams({
    variables: {
      userId: currentUser?._id,
    },
  });

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <PageSubHeader>
        <TasksFilter />
      </PageSubHeader>
      <RecordTable.Provider
        columns={tasksColumns(teams)}
        data={tasks || [{}]}
        className="m-3 h-full"
        stickyColumns={['checkbox', 'name']}
      >
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          dataLength={tasks?.length}
          sessionKey={TASKS_CURSOR_SESSION_KEY}
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
