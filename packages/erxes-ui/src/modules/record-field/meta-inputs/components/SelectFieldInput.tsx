import { Select } from 'erxes-ui/components';
import { useRecordTable } from 'erxes-ui/modules/record-table/components/RecordTableProvider';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const SelectFieldInput = () => {
  const { column, value, onSelect, isInEditMode, setIsInEditMode } =
    useRecordTableCellContext();
  const { getFetchValueHook } = useRecordTable();
  const { options } = getFetchValueHook(column.id)();
  return (
    <Select
      open={isInEditMode}
      onOpenChange={setIsInEditMode}
      value={value}
      onValueChange={(value) => onSelect(value)}
    >
      <Select.Trigger className="h-cell rounded-none">
        <Select.Value placeholder="Select" />
      </Select.Trigger>
      <Select.Content>
        {options?.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
