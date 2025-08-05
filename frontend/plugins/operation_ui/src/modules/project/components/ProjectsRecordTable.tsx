import { projectsColumns } from '@/project/components/ProjectsColumn';
import { RecordTable, RecordTableTree } from 'erxes-ui';

export const ProjectsRecordTable = ({ type }: { type: string }) => {
  const projects = [
    {
      _id: '1',
      icon: '1',
      name: 'Project 1',
      tagIds: [],
      createdAt: new Date(),
    },
  ];
  return (
    <RecordTable.Provider
      columns={projectsColumns}
      data={projects || []}
      className="m-3"
      stickyColumns={['more', 'name']}
    >
      <RecordTableTree id="projects-list" ordered>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList Row={RecordTableTree.Row} />
              {/* <RecordTable.RowSkeleton rows={20} /> */}
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTableTree>
    </RecordTable.Provider>
  );
};
