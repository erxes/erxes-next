import { RecordTable } from 'erxes-ui';
import React from 'react';
import { DepartmentColumns } from './DepartmentColumns';
import { useDepartmentsList } from '../../hooks/useDepartmentsList';

export default function DepartmentSettings() {
  const { departments, error, loading } = useDepartmentsList();
  return (
    <section className="flex flex-col h-full w-full p-5">
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
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </section>
  );
}
