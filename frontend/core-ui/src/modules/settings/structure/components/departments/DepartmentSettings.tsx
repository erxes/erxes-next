import { RecordTable } from 'erxes-ui';
import { DepartmentColumns } from './DepartmentColumns';
import { useDepartmentsList } from '../../hooks/useDepartmentsList';
import { DepartmentsRemove } from './DepartmentsRemove';
import { DepartmentEdit } from './detail/DepartmentEdit';

export function DepartmentSettings() {
  const { departments, loading } = useDepartmentsList();
  return (
    <section className="flex flex-col h-full w-full p-5">
      <DepartmentEdit />
      <RecordTable.Provider
        data={departments || []}
        columns={DepartmentColumns}
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
    </section>
  );
}
