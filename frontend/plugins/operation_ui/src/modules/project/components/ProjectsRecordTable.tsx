import { projectsColumns } from '@/project/components/ProjectsColumn';
import { RecordTable } from 'erxes-ui';
import { useProjects } from '@/project/hooks/useGetProjects';
import { PROJECTS_CURSOR_SESSION_KEY } from '@/project/constants';
import { useGetTeams } from '@/team/hooks/useGetTeams';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules/states';

export const ProjectsRecordTable = ({ type }: { type: string }) => {
  const { projects, handleFetchMore, pageInfo, loading } = useProjects();
  const { hasPreviousPage, hasNextPage } = pageInfo || {};
  const currentUser = useAtomValue(currentUserState);
  const { teams } = useGetTeams({
    variables: {
      teamIds: [currentUser?._id],
    },
  });

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <RecordTable.Provider
        columns={projectsColumns(teams)}
        data={projects || [{}]}
        className="m-3 h-full"
        stickyColumns={['name']}
      >
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          dataLength={projects?.length}
          sessionKey={PROJECTS_CURSOR_SESSION_KEY}
        >
          <RecordTable.Scroll>
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
          </RecordTable.Scroll>
        </RecordTable.CursorProvider>
      </RecordTable.Provider>
    </div>
  );
};
