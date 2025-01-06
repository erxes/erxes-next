import { Input } from 'erxes-ui/components';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const TextFieldInput = () => {
  const { getValue } = useRecordTableCellContext();

  return (
    <Input className="rounded-none h-[34px] px-2 w-full" value={getValue()} />
  );
};
