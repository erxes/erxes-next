import { RecordTable } from 'erxes-ui';
import { DepartmentColumns } from './DepartmentColumns';
import { useDepartmentsList } from '../../hooks/useDepartmentsList';
import { DepartmentsRemove } from './DepartmentsRemove';
import { DepartmentEdit } from './detail/DepartmentEdit';

export function DepartmentSettings() {
  const { departments, loading } = useDepartmentsList();
  return (
    <div className="w-full overflow-hidden flex flex-col">
      <DepartmentEdit />
      <RecordTable.Provider
        data={departments || []}
        columns={DepartmentColumns}
        className="m-3"
      >
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
            </RecordTable.Body>
            <DepartmentsRemove />
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </div>
  );
}
