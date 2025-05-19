import { useRecordTable } from 'erxes-ui/modules/record-table/components/RecordTableProvider';
import { useRemoveBranch } from '../../hooks/useBranchActions';
import { Button, Table } from 'erxes-ui';
import { IconX } from '@tabler/icons-react';
import { useRemoveDepartment } from '../../hooks/useDepartmentActions';

export const DepartmentsRemove = () => {
  const { table } = useRecordTable();
  const { handleRemove, loading } = useRemoveDepartment();
  const onRemove = () => {
    const ids: string[] = table
      .getSelectedRowModel()
      .rows?.map((row) => row.original._id);
    handleRemove({
      variables: {
        ids,
      },
    });
  };
  if (table.getSelectedRowModel().rows.length > 0) {
    return (
      <Table.Footer>
        <td colSpan={8} className="p-4 border-none">
          <div className="flex w-full justify-center gap-4">
            <Button
              variant="secondary"
              disabled={loading}
              className="bg-destructive/10 text-destructive col-span-1 col-start-4"
              onClick={onRemove}
            >
              <IconX />
              Remove Selected
            </Button>
          </div>
        </td>
      </Table.Footer>
    );
  }
  return null;
};
