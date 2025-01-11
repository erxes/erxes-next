import { Skeleton } from 'erxes-ui/components';
import MultipleSelector from 'erxes-ui/components/multiselect';
import { useRecordTable } from 'erxes-ui/modules/record-table/components/RecordTableProvider';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const MultiSelectFieldInput = () => {
  const { column } = useRecordTableCellContext();
  const { getFetchValueHook } = useRecordTable();
  const { options, loading } = getFetchValueHook(column.id)();

  if (loading) return <Skeleton className="h-3 w-full" />;

  return <MultipleSelector options={options} />;
};
