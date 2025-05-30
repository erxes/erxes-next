import { RecordTable, RecordTableTree } from 'erxes-ui';
import { DepartmentColumns } from './DepartmentColumns';
import { useDepartmentsList } from '../../hooks/useDepartmentsList';
import { DepartmentEdit } from './detail/DepartmentEdit';
import { DepartmentsFilter } from './DepartmentsFilter';
import { DepartmentsCommandBar } from './DepartmentsCommandBar';

export function DepartmentSettings() {
  const { sortedDepartments, loading } = useDepartmentsList();
  return (
    <div className="w-full overflow-hidden flex flex-col">
      <DepartmentEdit />
      <DepartmentsFilter />
      <RecordTable.Provider
        data={sortedDepartments || []}
        columns={DepartmentColumns}
        className="m-3"
      >
        <RecordTableTree id="departments-list" ordered>
          <RecordTable.Scroll>
            <RecordTable>
              <RecordTable.Header />
              <RecordTable.Body>
                <RecordTable.RowList Row={RecordTableTree.Row} />
                {loading && <RecordTable.RowSkeleton rows={30} />}
              </RecordTable.Body>
              <DepartmentsCommandBar />
            </RecordTable>
          </RecordTable.Scroll>
        </RecordTableTree>
      </RecordTable.Provider>
    </div>
  );
}
