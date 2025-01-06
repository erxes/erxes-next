import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';
import { useRecordTable } from 'erxes-ui/modules/record-table/components/RecordTableProvider';

export const SelectFieldDisplay = () => {
  const { column, getValue } = useRecordTableCellContext();
  const { getFetchValueHook } = useRecordTable();
  const { options } = getFetchValueHook(column.id)();
  const option = options?.find((option) => option.value === getValue());
  return <div>{option?.label}</div>;
};
