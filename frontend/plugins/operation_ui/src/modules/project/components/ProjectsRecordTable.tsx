import { projectsColumns } from '@/project/components/ProjectsColumn';
import { RecordTable } from 'erxes-ui';
import { useProjects } from '@/project/hooks/useGetProjects';
import { PROJECTS_CURSOR_SESSION_KEY } from '@/project/constants';

export const ProjectsRecordTable = ({ type }: { type: string }) => {
  const { projects, handleFetchMore, pageInfo, loading } = useProjects();
  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <RecordTable.Provider
        columns={projectsColumns}
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
