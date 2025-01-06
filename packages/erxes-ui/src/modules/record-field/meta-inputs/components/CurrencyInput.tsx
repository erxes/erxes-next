import { Input, Select } from 'erxes-ui/components';
import { useRecordTable } from 'erxes-ui/modules/record-table/components/RecordTableProvider';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const CurrencyInput = () => {
  const { value, setValue } = useRecordTableCellContext();

  // Format number for display
  const formatValue = (val: string | number) => {
    const numValue = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(numValue)) return '';
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Handle input change to preserve raw number value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    // Update your state/context here with rawValue
  };

  return (
    <div className="flex">
      <Select defaultValue="usd">
        <Select.Trigger className="h-[34px] w-24 rounded-none focus:z-10 relative">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="usd">USD</Select.Item>
          <Select.Item value="eur">EUR</Select.Item>
        </Select.Content>
      </Select>

      <Input
        type="text"
        value={formatValue(value)}
        onChange={handleChange}
        className="rounded-none relative h-[34px]"
      />
    </div>
  );
};
